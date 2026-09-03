export default defineOAuthGitHubEventHandler({
  async onSuccess(event, { user }) {
    await setUserSession(event, {
      user: {
        provider: 'github',
        providerId: user.id,
        username: user.login,
        avatarUrl: user.avatar_url,
      },
    })
    return sendRedirect(event, '/')
  },
})
