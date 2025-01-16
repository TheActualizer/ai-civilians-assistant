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
  ToastToggle,
} from "@/components/ui/toast"

export function Toaster() {
  const { toasts } = useToast()
  const [collapsedToasts, setCollapsedToasts] = useState<Record<string, boolean>>({})

  const toggleToast = (id: string) => {
    setCollapsedToasts(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        const isCollapsed = collapsedToasts[id]
        return (
          <Toast key={id} {...props} collapsed={isCollapsed}>
            <ToastToggle
              collapsed={isCollapsed}
              onClick={() => toggleToast(id)}
            />
            <div className={cn(
              "grid gap-1 transition-all duration-200",
              isCollapsed ? "opacity-0 h-0" : "opacity-100 h-auto"
            )}>
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}