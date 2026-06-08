/* eslint-disable @typescript-eslint/consistent-type-assertions */
type ToastOptions = {
  description?: string
  duration?: number
}

export function useAppToast() {
  const toast = useToast()

  return {
    success: (title: string, opts?: ToastOptions) =>
      toast.add({ title, icon: 'lucide:check-circle', color: 'success' as 'primary', ...opts }),

    error: (title: string, opts?: ToastOptions) =>
      toast.add({ title, icon: 'lucide:x-circle', color: 'error' as 'primary', ...opts }),

    info: (title: string, opts?: ToastOptions) =>
      toast.add({ title, icon: 'lucide:info', color: 'info' as 'primary', ...opts }),

    warning: (title: string, opts?: ToastOptions) =>
      toast.add({ title, icon: 'lucide:triangle-alert', color: 'warning' as 'primary', ...opts }),
  }
}
