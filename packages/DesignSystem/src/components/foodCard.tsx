import { Card } from "@/components/card"
import { IconButton } from "@/components/iconButton"

interface FoodCardProps {
  title: string
  emoji: string
  calories: number
  protein: number
  fat: number
  carbs: number
  serving: string
  selected?: boolean
  onToggle?: () => void
  className?: string
}

export function FoodCard({
  title,
  emoji,
  calories,
  protein,
  fat,
  carbs,
  serving,
  selected = false,
  onToggle,
  className,
}: Readonly<FoodCardProps>) {
  return (
    <Card
      icon={<span className="text-xl">{emoji}</span>}
      title={title}
      selected={selected}
      className={className}
      action={
        <IconButton
          icon={selected ? "check" : "plus"}
          label={selected ? "Remove from meal" : "Add to meal"}
          onClick={onToggle}
        />
      }
    >
      <p className="text-sm text-foreground-secondary mt-1">
        {calories} 🔥 {protein}P {fat}F {carbs}C • {serving}
      </p>
    </Card>
  )
}
