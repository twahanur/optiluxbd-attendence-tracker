"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface CollapsibleProps {
  children: React.ReactNode
  className?: string
  defaultOpen?: boolean
  asChild?: boolean
}

interface CollapsibleContextType {
  open: boolean
  toggle: () => void
}

const CollapsibleContext = React.createContext<CollapsibleContextType | null>(null)

const Collapsible = React.forwardRef<HTMLDivElement, CollapsibleProps>(
  ({ children, className, defaultOpen = false, asChild = false, ...props }, ref) => {
    const [open, setOpen] = React.useState(defaultOpen)
    
    const toggle = React.useCallback(() => {
      setOpen(prev => !prev)
    }, [])

    const value = React.useMemo(() => ({ open, toggle }), [open, toggle])

    if (asChild) {
      return (
        <CollapsibleContext.Provider value={value}>
          {children}
        </CollapsibleContext.Provider>
      )
    }

    return (
      <div ref={ref} className={cn(className)} {...props}>
        <CollapsibleContext.Provider value={value}>
          {children}
        </CollapsibleContext.Provider>
      </div>
    )
  }
)
Collapsible.displayName = "Collapsible"

const CollapsibleTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }>(
  ({ children, className, asChild = false, onClick, ...props }, ref) => {
    const context = React.useContext(CollapsibleContext)
    
    if (!context) {
      throw new Error('CollapsibleTrigger must be used within a Collapsible')
    }

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      context.toggle()
      onClick?.(e)
    }

    if (asChild) {
      return React.cloneElement(children as React.ReactElement<any>, {
        onClick: handleClick,
        'aria-expanded': context.open,
      } as any)
    }

    return (
      <button
        ref={ref}
        className={cn(className)}
        onClick={handleClick}
        aria-expanded={context.open}
        {...props}
      >
        {children}
      </button>
    )
  }
)
CollapsibleTrigger.displayName = "CollapsibleTrigger"

const CollapsibleContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ children, className, ...props }, ref) => {
    const context = React.useContext(CollapsibleContext)
    
    if (!context) {
      throw new Error('CollapsibleContent must be used within a Collapsible')
    }

    if (!context.open) return null

    return (
      <div ref={ref} className={cn(className)} {...props}>
        {children}
      </div>
    )
  }
)
CollapsibleContent.displayName = "CollapsibleContent"

export { Collapsible, CollapsibleTrigger, CollapsibleContent }