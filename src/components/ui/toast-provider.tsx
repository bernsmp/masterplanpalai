"use client"

import { createContext, useContext, ReactNode } from 'react'
import { useToast, Toast } from '@/hooks/use-toast'

interface ToastContextType {
  toast: (toast: Omit<Toast, 'id'>) => { id: string }
  dismiss: (id: string) => void
  toasts: Toast[]
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const toastHook = useToast()
  
  return (
    <ToastContext.Provider value={toastHook}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  )
}

export function useToastContext() {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error('useToastContext must be used within a ToastProvider')
  }
  return context
}

function ToastContainer() {
  const { toasts, dismiss } = useToastContext()
  
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            bg-white dark:bg-slate-800 border rounded-lg shadow-lg p-4 max-w-sm
            ${toast.variant === 'destructive' 
              ? 'border-red-200 dark:border-red-800' 
              : 'border-green-200 dark:border-green-800'
            }
          `}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              {toast.title && (
                <div className={`
                  font-semibold text-sm
                  ${toast.variant === 'destructive' 
                    ? 'text-red-800 dark:text-red-200' 
                    : 'text-green-800 dark:text-green-200'
                  }
                `}>
                  {toast.title}
                </div>
              )}
              {toast.description && (
                <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  {toast.description}
                </div>
              )}
            </div>
            <button
              onClick={() => dismiss(toast.id)}
              className="ml-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
