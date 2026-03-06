export default defineNuxtPlugin(() => {
  const { config } = useRoutingConfig()
  if (!config.scrollRouting.enabled) return

  const router = useRouter()
  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries.find(e => e.isIntersecting)
      if (!visible) return
      const id = visible.target.getAttribute('data-section')
      if (!id) return
      const method = config.scrollRouting.mode === 'push' ? 'push' : 'replace'
      router[method]({ hash: `#${id}` })
    },
    { threshold: 0.5 },
  )

  onNuxtReady(() => {
    document.querySelectorAll('[data-section]').forEach(el => observer.observe(el))
  })
})
