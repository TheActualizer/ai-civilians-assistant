import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

export function Toaster() {
  const { toasts } = useToast()
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  return (
    <ToastProvider duration={3000}>
      {toasts.map(({ id, title, description, action, ...props }) => (
        <Toast
          key={id}
          {...props}
          className={cn(
            "group data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
            "dark:bg-gray-800/90 backdrop-blur-sm border-gray-700/50",
            "hover:brightness-110 transition-all duration-200",
            hoveredId === id && "opacity-100 scale-102",
            !hoveredId && "opacity-90 hover:opacity-100"
          )}
          onMouseEnter={() => setHoveredId(id)}
          onMouseLeave={() => setHoveredId(null)}
        >
          <div className="grid gap-1">
            {title && (
              <ToastTitle className="text-sm font-medium text-gray-100">
                {title}
              </ToastTitle>
            )}
            {description && (
              <ToastDescription className="text-sm text-gray-300">
                {description}
              </ToastDescription>
            )}
          </div>
          {action}
          <ToastClose className="text-gray-400 hover:text-gray-200 transition-colors" />
        </Toast>
      ))}
      <ToastViewport className="fixed bottom-0 right-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]" />
    </ToastProvider>
  )
}