import { cn } from "@/lib/utils"

export function GradientCard({ children, className, gradient = "primary", ...props }) {
  const gradients = {
    primary: "bg-gradient-to-br from-primary/10 via-primary/5 to-background border-primary/20",
    secondary: "bg-gradient-to-br from-secondary/10 via-secondary/5 to-background border-secondary/20",
    accent: "bg-gradient-to-br from-accent/10 via-accent/5 to-background border-accent/20",
    muted: "bg-gradient-to-br from-muted/50 via-muted/20 to-background border-muted/30"
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg border backdrop-blur-sm",
        gradients[gradient],
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
      {children}
    </div>
  )
}