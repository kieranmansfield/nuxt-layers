#!/usr/bin/env python3
"""Topology extraction for the nuxt-layers monorepo.

Parses layers/** and apps/** and emits analysis/entire/topology.json
plus domain-level Mermaid diagrams. Re-runnable, no dependencies.

Edge sources handled:
  - static ESM imports (relative + ~ / ~~ aliases)
  - Nuxt layer `extends` in nuxt.config.ts (dispatch)
  - Nuxt auto-imports: composables/utils symbol usage (dispatch)
  - Nuxt auto-registered components used as template tags (dispatch)
  - client -> server route calls via $fetch/useFetch('/api/...') (dispatch)
  - external data stores via SDK/URL fingerprints (read/write)
"""

import json, os, re, sys
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "analysis" / "entire"
SKIP_DIRS = {"node_modules", ".nuxt", ".output", "dist", ".turbo", ".netlify"}
EXTS = {".ts", ".vue", ".mts"}

# ---------------------------------------------------------------- collect files
def domain_of(rel: str):
    p = rel.split("/")
    if p[0] == "layers":
        if len(p) > 3 and p[1] == "metadata" and p[2] == "providers":
            return f"layers/metadata/providers/{p[3]}"
        return f"layers/{p[1]}"
    if p[0] == "apps":
        return f"apps/{p[1]}"
    return None

files = {}  # rel -> {"loc": int, "text": str}
for dirpath, dirnames, filenames in os.walk(ROOT):
    dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS and not d.startswith(".")]
    for fn in filenames:
        p = Path(dirpath) / fn
        rel = str(p.relative_to(ROOT))
        if p.suffix not in EXTS or not rel.startswith(("layers/", "apps/")):
            continue
        if re.search(r"\.(test|spec)\.[cm]?ts$", fn):
            continue  # characterization tests are mapped separately, not runtime modules
        try:
            text = p.read_text(errors="replace")
        except OSError:
            continue
        files[rel] = {"loc": text.count("\n") + 1, "text": text}

domains = defaultdict(list)
for rel in sorted(files):
    d = domain_of(rel)
    if d:
        domains[d].append(rel)

# ------------------------------------------------------------- symbol tables
sym_to_file = {}          # auto-importable symbol -> file id
sym_conflicts = set()
component_to_file = {}    # PascalCase tag -> file id
AUTO_DIRS = ("/composables/", "/utils/", "/shared/")

export_re = re.compile(r"export\s+(?:async\s+)?(?:function|const|class)\s+([A-Za-z_$][\w$]*)")
for rel, meta in files.items():
    if any(a in rel for a in AUTO_DIRS):
        for sym in export_re.findall(meta["text"]):
            if sym in sym_to_file and sym_to_file[sym] != rel:
                sym_conflicts.add(sym)
            sym_to_file.setdefault(sym, rel)
    m = re.search(r"/app/components/(.+)\.vue$", "/" + rel)
    if m:
        parts = m.group(1).split("/")
        name = "".join(s[:1].upper() + s[1:] for s in parts)
        name = re.sub(r"Index$", "", name) or name
        component_to_file.setdefault(name, rel)

# server API/route files -> URL path
route_files = {}  # url regex -> file id
for rel in files:
    m = re.search(r"server/(api|routes)/(.+?)\.(get|post|put|delete|patch)?\.?ts$", rel)
    if not m:
        continue
    path = m.group(2)
    url = ("/api/" if m.group(1) == "api" else "/") + re.sub(r"\.(get|post|put|delete|patch)$", "", path)
    url = re.sub(r"/index$", "", url) or "/"
    pattern = re.escape(url)
    pattern = re.sub(r"\\\[\\\.\\\.\\\..*?\\\]", ".+", pattern)
    pattern = re.sub(r"\\\[.*?\\\]", "[^/]+", pattern)
    route_files[pattern] = rel

# ------------------------------------------------------------------- edges
edges = set()  # (src, dst, kind)

def add_edge(s, t, kind):
    if s != t:
        edges.add((s, t, kind))

def resolve_import(src: str, spec: str):
    """Resolve a relative or ~/~~ alias import to a repo file id."""
    if spec.startswith(("~/", "@/")):
        dom = domain_of(src)
        base = Path(dom) / "app" / spec[2:]
    elif spec.startswith("~~/"):
        base = Path(domain_of(src)) / spec[3:]
    elif spec.startswith("."):
        base = (Path(src).parent / spec).resolve().relative_to(ROOT)
    else:
        return None
    for cand in (str(base), f"{base}.ts", f"{base}.vue", f"{base}/index.ts"):
        if cand in files:
            return cand
    return None

DATASTORES = {
    "ds:comicvine-api":   (r"comicvine\.gamespot\.com", "read"),
    "ds:openlibrary-api": (r"openlibrary\.org", "read"),
    "ds:google-books-api":(r"googleapis\.com/books|books/v1", "read"),
    "ds:tmdb-api":        (r"api\.themoviedb\.org", "read"),
    "ds:resend-email":    (r"\bnew Resend\b|resend\.emails|from ['\"]resend", "write"),
    "ds:neon-postgres":   (r"useDrizzle\(|neon\(|drizzle\(", "write"),
    "ds:content-collections": (r"queryCollection|defineCollection", "read"),
    "ds:github-oauth":    (r"defineOAuthGitHubEventHandler|github.*oauth", "read"),
    "ds:nitro-cache":     (r"useStorage\(|defineCachedEventHandler|cachedEventHandler", "write"),
}

import_re = re.compile(r"""(?:import|export)[^'"]*?from\s+['"]([^'"]+)['"]|import\(\s*['"]([^'"]+)['"]""")
fetch_re = re.compile(r"""(?:\$fetch|useFetch|useLazyFetch)[^'"`]*['"`](/[^'"`\s?]+)""")
word_cache = {}

for rel, meta in files.items():
    text = meta["text"]
    # static imports
    for m in import_re.finditer(text):
        spec = m.group(1) or m.group(2)
        tgt = resolve_import(rel, spec)
        if tgt:
            add_edge(rel, tgt, "call")
    # auto-imported symbols (dispatch)
    words = set(re.findall(r"[A-Za-z_$][\w$]*", text))
    for sym in words & set(sym_to_file):
        tgt = sym_to_file[sym]
        if tgt != rel and re.search(rf"\b{re.escape(sym)}\s*\(", text):
            add_edge(rel, tgt, "dispatch")
    # component tags (dispatch)
    if rel.endswith(".vue"):
        for tag in set(re.findall(r"<([A-Z][\w]+)", text)) & set(component_to_file):
            add_edge(rel, component_to_file[tag], "dispatch")
    # client -> server route calls
    for url in fetch_re.findall(text):
        for pattern, tgt in route_files.items():
            if re.fullmatch(pattern, url):
                add_edge(rel, tgt, "dispatch")
    # data stores
    for ds, (pat, kind) in DATASTORES.items():
        if re.search(pat, text, re.I):
            add_edge(rel, ds, kind)

# layer extends -> dispatch between nuxt.config.ts nodes
for rel in [f for f in files if f.endswith("nuxt.config.ts")]:
    src_dir = Path(rel).parent
    for spec in re.findall(r"['\"](\.\.[^'\"]*)['\"]", files[rel]["text"]):
        tgt_dir = (ROOT / src_dir / spec).resolve()
        try:
            tgt = str((tgt_dir / "nuxt.config.ts").relative_to(ROOT))
        except ValueError:
            continue
        if tgt in files:
            add_edge(rel, tgt, "dispatch")

used_datastores = {t for _, t, _ in edges if t.startswith("ds:")}

# ------------------------------------------------------------- entry points
entry_points = sorted(
    rel for rel in files
    if re.search(r"server/(api|routes)/", rel)
    or "/app/pages/" in rel
    or rel.endswith(("app/app.vue", "app/error.vue"))
    or "/app/plugins/" in rel
)

# --------------------------------------------------------------- dead ends
inbound = defaultdict(int)
for s, t, _ in edges:
    inbound[t] += 1
PUBLIC_API_HINT = re.compile(
    r"/(components|composables|utils|types|assets)/|nuxt\.config|app\.config|content\.config|\.d\.ts$"
    # framework-dispatched, never statically referenced: not dead
    r"|/middleware/|/server/plugins/|/app/layouts/")
dead_ends = sorted(
    rel for rel in files
    if inbound[rel] == 0 and rel not in entry_points and not PUBLIC_API_HINT.search(rel)
)

# ------------------------------------------------------------------- tree
def node(rel):
    lang = "vue" if rel.endswith(".vue") else "typescript"
    return {"id": rel, "name": Path(rel).name, "kind": "module",
            "language": lang, "loc": files[rel]["loc"], "file": rel}

children = [
    {"id": f"dom:{d}", "name": d, "kind": "domain",
     "children": [node(r) for r in rels]}
    for d, rels in sorted(domains.items())
]
children.append({
    "id": "dom:data", "name": "Data stores", "kind": "domain",
    "children": [{"id": ds, "name": ds[3:], "kind": "datastore"} for ds in sorted(used_datastores)],
})

# ------------------------------------------------------------------- flows
def pick(*globs):
    out = []
    for g in globs:
        rx = re.compile(re.escape(g).replace(r"\*", "[^ ]*") + "$")
        out += [r for r in sorted(files) if rx.search(r)]
        if g.startswith("ds:") and g in used_datastores:
            out.append(g)
    return out

def flow_steps(steps):
    out = []
    for label, globs in steps:
        nodes = pick(*globs)
        if nodes:
            out.append({"label": label, "nodes": nodes[:6]})
    return out

flows = [
    {"name": "Visitor opens a page", "persona": "Site visitor",
     "description": "A visitor loads any page: theme is applied without flash, layout/typography render, SEO tags are served.",
     "steps": flow_steps([
        ("Browser requests the page shell", [["apps/playground/app/app.vue"]][0]),
        ("Theme applied before paint (no flash of wrong theme)", ["layers/theme/server/utils/fouc-config.ts", "layers/theme/app/plugins/*"]),
        ("Page renders with layout + typography", ["layers/layout/app/components/*Grid*.vue", "layers/typography/app/composables/useTypography.ts"]),
        ("SEO/meta tags served with response", ["layers/seo/app/utils/seoConfig.ts"]),
     ])},
    {"name": "Visitor sends a contact message", "persona": "Site visitor",
     "description": "A visitor fills the contact form; it is validated and delivered by email.",
     "steps": flow_steps([
        ("Visitor fills the contact form", ["layers/forms/app/components/Form/Contact.vue"]),
        ("Input validated against schema", ["layers/forms/app/utils/contact-schema.ts"]),
        ("Server receives the submission", ["layers/forms/server/api/contact.post.ts"]),
        ("Email sent via Resend", ["layers/mailer/server/utils/*", "ds:resend-email"]),
     ])},
    {"name": "Curator searches for a title", "persona": "Catalogue curator",
     "description": "A curator searches for a book, comic, or film; results are merged from four external providers.",
     "steps": flow_steps([
        ("Curator types a search query", ["apps/playground/app/pages/metadata.vue"]),
        ("Search API fans out to providers", ["layers/metadata/server/api/metadata/search.get.ts", "layers/metadata/server/utils/metadata/provider-registry.ts"]),
        ("Each provider queries its upstream API", ["layers/metadata/providers/*/server/utils/*/client.ts"]),
        ("Upstream catalogues respond", ["ds:comicvine-api", "ds:openlibrary-api", "ds:google-books-api", "ds:tmdb-api"]),
        ("Results normalised and cached", ["layers/metadata/server/utils/metadata/cache.ts"]),
     ])},
    {"name": "Reader subscribes to the feed", "persona": "RSS reader",
     "description": "A feed reader fetches RSS/Atom/JSON feeds generated from published content collections.",
     "steps": flow_steps([
        ("Reader requests the feed URL", ["layers/feeds/server/routes/feed/rss.get.ts"]),
        ("Published content queried", ["layers/feeds/server/utils/content-adapter.ts", "ds:content-collections"]),
        ("Feed XML/JSON generated", ["layers/feeds/server/utils/feed-xml.ts", "layers/feeds/server/utils/formats/rss.ts"]),
     ])},
]

observations = [
    "Layer dependency graph is clean and acyclic: core is the universal base; ui and motion are pure orchestrator layers (2 files each) that only aggregate other layers via extends.",
    "shader is by far the largest layer (243 files, ~1/3 of the estate) — TSL shader blocks/materials/presets; it dwarfs the canvas layer (6 files) it extends.",
    "Nuxt auto-imports mean most coupling is dispatch (implicit), not explicit imports — any composable/util/component rename is a cross-layer breaking change with no compiler-visible edge.",
    f"{len(sym_conflicts)} auto-import symbol names are defined in more than one file (last-layer-wins at build time): {sorted(sym_conflicts)[:8]}",
    "External write paths are narrow: only mailer (Resend) and database (Neon) write anywhere; all metadata providers are read-only upstreams behind one registry.",
    "This repo is a published library (layers consumed by external apps), so zero-inbound-edge modules are still public API — dead-end list below only contains internal non-API files and needs human review, not deletion.",
    "apps/visual-identity and apps/debug plus layers starter/baseline/feeds exist in the repo but are absent from CLAUDE.md's documented architecture — docs lag the code.",
]

topology = {
    "system": "nuxt-layers",
    "root": {"id": "sys", "name": "nuxt-layers", "kind": "system", "children": children},
    "edges": [{"source": s, "target": t, "kind": k} for s, t, k in sorted(edges)],
    "entryPoints": entry_points,
    "deadEnds": dead_ends,
    "observations": observations,
    "flows": flows,
}
OUT.mkdir(parents=True, exist_ok=True)
(OUT / "topology.json").write_text(json.dumps(topology, indent=1))

# ------------------------------------------------------------- mermaid (domain level)
dom_of_node = {r: d for d, rels in domains.items() for r in rels}
dom_edges = defaultdict(set)
for s, t, k in edges:
    ds_, dt = dom_of_node.get(s), (t if t.startswith("ds:") else dom_of_node.get(t))
    if ds_ and dt and ds_ != dt:
        dom_edges[(ds_, dt)].add(k)

def mid(x):  # mermaid-safe id
    return re.sub(r"\W", "_", x)

call_lines = ["graph TD"]
lineage_lines = ["graph LR"]
for (a, b), kinds in sorted(dom_edges.items()):
    if b.startswith("ds:"):
        arrow = "-- write -->" if "write" in kinds else "-- read -->"
        lineage_lines.append(f'  {mid(a)}["{a}"] {arrow} {mid(b)}[("{b[3:]}")]')
    else:
        call_lines.append(f'  {mid(a)}["{a}"] --> {mid(b)}["{b}"]')
entry_doms = sorted({dom_of_node[e] for e in entry_points if e in dom_of_node})
for d in entry_doms:
    call_lines.append(f"  style {mid(d)} stroke:#e8590c,stroke-width:3px")
(OUT / "call-graph.mmd").write_text("\n".join(call_lines) + "\n")
(OUT / "data-lineage.mmd").write_text("\n".join(lineage_lines) + "\n")

crit = ["flowchart TD"]
prev = None
for i, step in enumerate(flows[2]["steps"]):
    nid = f"s{i}"
    crit.append(f'  {nid}["{step["label"]}"]')
    if prev:
        crit.append(f"  {prev} --> {nid}")
    prev = nid
(OUT / "critical-path.mmd").write_text("\n".join(crit) + "\n")

# ------------------------------------------------------------------ summary
print(f"nuxt-layers topology: {len(files)} modules, {len(domains)} domains, "
      f"{len(edges)} edges, {len(entry_points)} entry points, {len(dead_ends)} dead-end candidates")
print(f"\nDomains by size (files / LOC):")
for d, rels in sorted(domains.items(), key=lambda kv: -sum(files[r]['loc'] for r in kv[1]))[:15]:
    print(f"  {d:45s} {len(rels):4d} files  {sum(files[r]['loc'] for r in rels):6d} loc")
print(f"\nData stores in use: {', '.join(sorted(used_datastores))}")
print(f"\nEdge kinds: " + ", ".join(f"{k}={n}" for k, n in
      sorted(((k, sum(1 for e in edges if e[2] == k)) for k in {e[2] for e in edges}), key=lambda x: -x[1])))
print(f"\nDead-end candidates (internal, non-API — review, don't delete):")
for r in dead_ends[:25]:
    print(f"  {r}")
if len(dead_ends) > 25:
    print(f"  ... and {len(dead_ends) - 25} more")
print(f"\nAuto-import symbol conflicts: {len(sym_conflicts)}")
