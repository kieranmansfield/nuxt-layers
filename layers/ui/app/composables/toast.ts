type ToastOptions = {
  description?: string
  duration?: number
}

export function useAppToast() {
  const toast = useToast()

  return {
    success: (title: string, opts?: ToastOptions) =>
      toast.add({ title, icon: 'lucide:check-circle', color: 'success', ...opts }),

    error: (title: string, opts?: ToastOptions) =>
      toast.add({ title, icon: 'lucide:x-circle', color: 'error', ...opts }),

    info: (title: string, opts?: ToastOptions) =>
      toast.add({ title, icon: 'lucide:info', color: 'info', ...opts }),

    warning: (title: string, opts?: ToastOptions) =>
      toast.add({ title, icon: 'lucide:triangle-alert', color: 'warning', ...opts }),
  }
}
