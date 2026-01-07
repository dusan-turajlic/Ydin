import { useState } from 'react'
import { Menu } from '@ydin/design-system/icons'
import { FixedModalSheet, FixedModalSheetContent } from '@ydin/design-system'

const navigation = [
    { name: 'Copy day', href: '#' },
    { name: 'Make day my meal plan', href: '#' },
    { name: 'Clear day', href: '#' },
    { name: 'Export day', href: '#' },
]

export default function TopNavigation() {
    const [showMenu, setShowMenu] = useState(false)

    const handleItemClick = (href: string) => {
        console.log('Navigate to:', href)
        setShowMenu(false)
    }

    return (
        <div className="sticky top-0 z-10 left-0 right-0 p-3 px-4 bg-primary-foreground">
            <div className="relative flex items-center justify-between">
                <div className="inset-y-0 left-0 flex items-center">
                    <button
                        onClick={() => setShowMenu(true)}
                        className="group relative inline-flex items-center justify-center rounded-md"
                    >
                        <span className="absolute -inset-0.5" />
                        <span className="sr-only">Open main menu</span>
                        <Menu aria-hidden="true" className="block size-6" />
                    </button>
                </div>
            </div>

            <FixedModalSheet open={showMenu} onOpenChange={setShowMenu} snapPoints={[0.35]}>
                <FixedModalSheetContent>
                    <div className="space-y-1">
                        {navigation.map((item) => (
                            <button
                                key={item.name}
                                onClick={() => handleItemClick(item.href)}
                                className="w-full flex items-center gap-3 p-3 rounded-xl transition-colors text-white/70 hover:bg-surface-elevated hover:text-brand-gold"
                            >
                                <span className="font-medium">{item.name}</span>
                            </button>
                        ))}
                    </div>
                </FixedModalSheetContent>
            </FixedModalSheet>
        </div>
    )
}
