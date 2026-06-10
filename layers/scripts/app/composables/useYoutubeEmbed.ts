export function useYoutubeEmbed(videoId: string) {
  const yt = useScriptYouTubePlayer({})

  const thumbnailUrl = computed(() => `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`)

  const embedUrl = computed(() => `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`)

  return {
    proxy: yt.proxy,
    thumbnailUrl,
    embedUrl,
    load: () => yt.load(),
  }
}
