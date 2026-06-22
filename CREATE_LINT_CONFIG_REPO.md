# Task: Create `lint-config` GitHub Repo

Create a new public GitHub repo at `kieranmansfield/lint-config` and populate it with the shared lint/format config files from this repo (`nuxt-layers`).

## Steps

### 1. Create the GitHub repo
```sh
gh repo create kieranmansfield/lint-config --public --description "Shared lint and formatting config" --clone=false
```

### 2. Create a temp directory and initialise git
```sh
mkdir /tmp/lint-config && cd /tmp/lint-config
git init
git remote add origin https://github.com/kieranmansfield/lint-config.git
```

### 3. Copy the config files from this repo
Source path: `/Users/kieranmansfield/Developer/layers/nuxt-layers`

```sh
cp /Users/kieranmansfield/Developer/layers/nuxt-layers/.editorconfig .
cp /Users/kieranmansfield/Developer/layers/nuxt-layers/eslint.config.mjs .
cp /Users/kieranmansfield/Developer/layers/nuxt-layers/prettier.config.cjs .
cp /Users/kieranmansfield/Developer/layers/nuxt-layers/.prettierignore .
cp /Users/kieranmansfield/Developer/layers/nuxt-layers/stylelint.config.mjs .
```

### 4. Commit and push
```sh
git add .
git commit -m "Initial commit: shared lint and format config"
git branch -M main
git push -u origin main
```

### 5. Verify
Confirm the repo exists and all five files are present:
```sh
gh repo view kieranmansfield/lint-config
gh api repos/kieranmansfield/lint-config/git/trees/HEAD --jq '.tree[].path'
```

Expected files:
- `.editorconfig`
- `eslint.config.mjs`
- `prettier.config.cjs`
- `.prettierignore`
- `stylelint.config.mjs`

## After completion

Add the remote in the frontend boilerplate repo and the `lint:sync` script is already wired up:
```sh
# In /Users/kieranmansfield/Developer/boilerplate/frontend
git remote add lint-config https://github.com/kieranmansfield/lint-config.git
```

Then to sync in future:
```sh
pnpm run lint:sync
```
