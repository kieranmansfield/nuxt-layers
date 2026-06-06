export default defineEventHandler((event) => {
  return sendRedirect(event, '/feed/rss', 302)
})
