import { cn } from "@/lib/utils"

interface CardProps {
  icon: React.ReactNode
  title: string
  children: React.ReactNode
  action?: React.ReactNode
  onClick?: () => void
  selected?: boolean
  className?: string
}

export function Card({
  icon,
  title,
  children,
  action,
  onClick,
  selected = false,
  className,
}: Readonly<CardProps>) {
  const isButton = !!onClick

  const cardStyles = cn(
    "flex items-start gap-4 p-4 rounded-xl bg-surface border border-border transition-all",
    "hover:bg-muted",
    selected && "ring-2 ring-gold",
    isButton && "w-full text-left active:scale-[0.98] hover:border-gold/50 cursor-pointer",
    className,
  )

  const content = (
    <>
      {/* Icon container */}
      <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center shrink-0">
        {icon}
      </div>

      {/* Content area */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-foreground leading-tight">{title}</h3>
        {children}
      </div>

      {/* Optional action */}
      {action && <div className="shrink-0">{action}</div>}
    </>
  )

  if (isButton) {
    return (
      <button type="button" onClick={onClick} className={cardStyles}>
        {content}
      </button>
    )
  }

  return <div className={cardStyles}>{content}</div>
}

