import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Search, Clock, Apple, Pizza, Coffee, Settings, User, LayoutDashboard, LogOut } from 'lucide-react';

import { ModalSheet, ModalSheetPeek, ModalSheetBottomPeek, ModalSheetContent } from '@/components/modalSheet';
import { Button } from '@/ui/button';

const meta: Meta<typeof ModalSheet> = {
    title: 'Components/ModalSheet',
    component: ModalSheet,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        open: {
            control: 'boolean',
            description: 'Controls if ModalSheetContent is expanded',
        },
        modal: {
            control: 'boolean',
            description: 'Show overlay when expanded (default: true)',
        },
    },
};

export default meta;
type Story = StoryObj<typeof ModalSheet>;

// Search - Persistent search bar that expands with results on focus
export const SearchStory: Story = {
    name: 'Search',
    render: function SearchDemo() {
        const [expanded, setExpanded] = useState(false);
        const [searchValue, setSearchValue] = useState('');

        const recentSearches = ['Chicken breast', 'Brown rice', 'Greek yogurt', 'Almonds'];
        const quickItems = [
            { icon: Apple, name: 'Apple', calories: 95 },
            { icon: Pizza, name: 'Pizza slice', calories: 285 },
            { icon: Coffee, name: 'Black coffee', calories: 5 },
        ];

        return (
            <div className="relative h-[600px] w-[400px] bg-background rounded-xl overflow-hidden border border-border">
                {/* App content behind the sheet */}
                <div className="p-4 space-y-4">
                    <h2 className="text-xl font-bold text-foreground">Today's Log</h2>
                    <div className="space-y-3">
                        {['Breakfast - 450 cal', 'Lunch - 620 cal', 'Snack - 180 cal'].map((meal) => (
                            <div key={meal} className="p-4 bg-surface rounded-xl border border-border">
                                <p className="text-foreground">{meal}</p>
                            </div>
                        ))}
                    </div>
                    <p className="text-sm text-muted-foreground text-center pt-4">
                        Focus on the search bar to expand!
                    </p>
                </div>

                {/* Persistent search sheet */}
                <ModalSheet open={expanded} onOpenChange={setExpanded} modal={false}>
                    {/* Always visible */}
                    <ModalSheetPeek>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search foods..."
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                onFocus={() => setExpanded(true)}
                                className="w-full pl-10 pr-4 py-3 bg-muted rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold"
                            />
                        </div>
                    </ModalSheetPeek>

                    {/* Expandable content */}
                    <ModalSheetContent>
                        {/* Recent searches */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Clock className="h-4 w-4" />
                                <span className="text-sm font-medium">Recent</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {recentSearches.map((item) => (
                                    <button
                                        key={item}
                                        className="px-3 py-1.5 bg-muted rounded-full text-sm text-foreground hover:bg-muted-foreground/20 transition-colors"
                                    >
                                        {item}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Quick add items */}
                        <div className="space-y-3">
                            <span className="text-sm font-medium text-muted-foreground">Quick Add</span>
                            <div className="space-y-2">
                                {quickItems.map((item) => (
                                    <button
                                        key={item.name}
                                        className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors"
                                    >
                                        <div className="h-10 w-10 rounded-full bg-gold/20 flex items-center justify-center">
                                            <item.icon className="h-5 w-5 text-gold" />
                                        </div>
                                        <div className="flex-1 text-left">
                                            <p className="text-foreground font-medium">{item.name}</p>
                                            <p className="text-sm text-muted-foreground">{item.calories} cal</p>
                                        </div>
                                        <Button size="sm" variant="secondary">Add</Button>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </ModalSheetContent>
                </ModalSheet>
            </div>
        );
    },
};

// Menu - Trigger button opens menu items, closes on selection or drag
export const MenuStory: Story = {
    name: 'Menu',
    render: function MenuDemo() {
        const [showMenu, setShowMenu] = useState(false);

        const menuItems = [
            { icon: User, label: 'Profile', action: () => alert('Profile clicked') },
            { icon: LayoutDashboard, label: 'Dashboard', action: () => alert('Dashboard clicked') },
            { icon: Settings, label: 'Settings', action: () => alert('Settings clicked') },
            { icon: LogOut, label: 'Sign Out', action: () => alert('Sign out clicked'), destructive: true },
        ];

        const handleItemClick = (action: () => void) => {
            action();
            setShowMenu(false);
        };

        return (
            <div className="relative h-[500px] w-[400px] bg-background rounded-xl overflow-hidden border border-border">
                {/* App content */}
                <div className="p-4 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-foreground">Home</h2>
                        <Button
                            variant="icon"
                            size="icon"
                            onClick={() => setShowMenu(true)}
                        >
                            <User className="h-5 w-5" />
                        </Button>
                    </div>
                    <p className="text-foreground-secondary">
                        Click the profile icon to open the menu sheet.
                    </p>
                    <div className="space-y-3 pt-4">
                        {['Welcome back!', 'You have 3 notifications', 'Daily goal: 80% complete'].map((text) => (
                            <div key={text} className="p-4 bg-surface rounded-xl border border-border">
                                <p className="text-foreground">{text}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Menu sheet - only rendered when showMenu is true */}
                {showMenu && (
                    <ModalSheet open={true} onOpenChange={(open) => !open && setShowMenu(false)}>
                        <ModalSheetContent>
                            <div className="flex items-center gap-4 pb-2">
                                <div className="h-14 w-14 rounded-full bg-gold/20 flex items-center justify-center">
                                    <User className="h-7 w-7 text-gold" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-foreground">John Doe</h3>
                                    <p className="text-sm text-foreground-secondary">john@example.com</p>
                                </div>
                            </div>

                            <div className="border-t border-border pt-2">
                                {menuItems.map((item) => (
                                    <button
                                        key={item.label}
                                        onClick={() => handleItemClick(item.action)}
                                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${item.destructive
                                            ? 'hover:bg-destructive/10 text-destructive'
                                            : 'hover:bg-muted text-foreground'
                                            }`}
                                    >
                                        <item.icon className="h-5 w-5" />
                                        <span className="font-medium">{item.label}</span>
                                    </button>
                                ))}
                            </div>
                        </ModalSheetContent>
                    </ModalSheet>
                )}
            </div>
        );
    },
};

// BottomPeekOnly - Search bar at bottom, visible when collapsed
export const BottomPeekOnly: Story = {
    name: 'Bottom Peek Only',
    render: function BottomPeekOnlyDemo() {
        const [expanded, setExpanded] = useState(false);
        const [searchValue, setSearchValue] = useState('');

        const searchResults = [
            { icon: Apple, name: 'Apple', calories: 95, protein: '0.5g' },
            { icon: Pizza, name: 'Pizza Margherita', calories: 285, protein: '12g' },
            { icon: Coffee, name: 'Latte', calories: 120, protein: '6g' },
        ];

        return (
            <div className="relative h-[600px] w-[400px] bg-background rounded-xl overflow-hidden border border-border">
                {/* App content behind the sheet */}
                <div className="p-4 space-y-4">
                    <h2 className="text-xl font-bold text-foreground">Today's Log</h2>
                    <div className="space-y-3">
                        {['Breakfast - 450 cal', 'Lunch - 620 cal', 'Snack - 180 cal'].map((meal) => (
                            <div key={meal} className="p-4 bg-surface rounded-xl border border-border">
                                <p className="text-foreground">{meal}</p>
                            </div>
                        ))}
                    </div>
                    <p className="text-sm text-muted-foreground text-center pt-4">
                        Focus on the search bar at the bottom to expand!
                    </p>
                </div>

                {/* Bottom peek search sheet - mobile keyboard friendly */}
                <ModalSheet open={expanded} onOpenChange={setExpanded} modal={false}>
                    {/* Search results appear above the search bar when expanded */}
                    <ModalSheetContent>
                        <div className="space-y-2 pb-2">
                            <span className="text-sm font-medium text-muted-foreground">Results</span>
                            {searchResults.map((item) => (
                                <button
                                    key={item.name}
                                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors"
                                >
                                    <div className="h-10 w-10 rounded-full bg-gold/20 flex items-center justify-center">
                                        <item.icon className="h-5 w-5 text-gold" />
                                    </div>
                                    <div className="flex-1 text-left">
                                        <p className="text-foreground font-medium">{item.name}</p>
                                        <p className="text-sm text-muted-foreground">{item.calories} cal · {item.protein}</p>
                                    </div>
                                    <Button size="sm" variant="secondary">Add</Button>
                                </button>
                            ))}
                        </div>
                    </ModalSheetContent>

                    {/* Search bar at bottom - always visible */}
                    <ModalSheetBottomPeek>
                        <div className="relative pt-2">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/4 h-5 w-5 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search foods..."
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                onFocus={() => setExpanded(true)}
                                className="w-full pl-10 pr-4 py-3 bg-muted rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold"
                            />
                        </div>
                    </ModalSheetBottomPeek>
                </ModalSheet>
            </div>
        );
    },
};

// BothPeeksVisible - Header at top, actions at bottom, both visible when collapsed
export const BothPeeksVisible: Story = {
    name: 'Both Peeks Visible',
    render: function BothPeeksDemo() {
        const [expanded, setExpanded] = useState(false);

        const notifications = [
            { title: 'Goal achieved!', desc: 'You hit your protein target', time: '2m ago' },
            { title: 'Reminder', desc: 'Log your lunch', time: '1h ago' },
            { title: 'Weekly report', desc: 'Your progress summary is ready', time: '3h ago' },
        ];

        return (
            <div className="relative h-[600px] w-[400px] bg-background rounded-xl overflow-hidden border border-border">
                {/* App content */}
                <div className="p-4 space-y-4">
                    <h2 className="text-xl font-bold text-foreground">Dashboard</h2>
                    <div className="grid grid-cols-2 gap-3">
                        {['Calories: 1,250', 'Protein: 85g', 'Carbs: 120g', 'Fat: 45g'].map((stat) => (
                            <div key={stat} className="p-4 bg-surface rounded-xl border border-border text-center">
                                <p className="text-foreground text-sm">{stat}</p>
                            </div>
                        ))}
                    </div>
                    <p className="text-sm text-muted-foreground text-center pt-4">
                        Tap header or buttons to expand notifications
                    </p>
                </div>

                {/* Sheet with both top and bottom peeks */}
                <ModalSheet open={expanded} onOpenChange={setExpanded} modal={false}>
                    {/* Top peek - notification summary */}
                    <ModalSheetPeek>
                        <button
                            onClick={() => setExpanded(!expanded)}
                            className="w-full flex items-center justify-between py-2"
                        >
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-gold animate-pulse" />
                                <span className="text-foreground font-medium">3 notifications</span>
                            </div>
                            <span className="text-sm text-muted-foreground">
                                {expanded ? 'Collapse' : 'View all'}
                            </span>
                        </button>
                    </ModalSheetPeek>

                    {/* Expandable notification list */}
                    <ModalSheetContent>
                        <div className="space-y-3">
                            {notifications.map((notif) => (
                                <div key={notif.title} className="p-3 bg-muted rounded-xl">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-foreground font-medium">{notif.title}</p>
                                            <p className="text-sm text-muted-foreground">{notif.desc}</p>
                                        </div>
                                        <span className="text-xs text-muted-foreground">{notif.time}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ModalSheetContent>

                    {/* Bottom peek - quick actions */}
                    <ModalSheetBottomPeek>
                        <div className="flex gap-2 pt-2">
                            <Button variant="secondary" className="flex-1" onClick={() => setExpanded(true)}>
                                Mark all read
                            </Button>
                            <Button variant="default" className="flex-1" onClick={() => setExpanded(true)}>
                                View details
                            </Button>
                        </div>
                    </ModalSheetBottomPeek>
                </ModalSheet>
            </div>
        );
    },
};

// NoPeekWhenCollapsed - Fully dismissible modal with persistent elements when open
export const NoPeekWhenCollapsed: Story = {
    name: 'No Peek When Collapsed',
    render: function NoPeekDemo() {
        const [showSheet, setShowSheet] = useState(false);

        const formFields = [
            { label: 'Food name', placeholder: 'e.g., Grilled chicken' },
            { label: 'Calories', placeholder: '0' },
            { label: 'Protein (g)', placeholder: '0' },
        ];

        return (
            <div className="relative h-[600px] w-[400px] bg-background rounded-xl overflow-hidden border border-border">
                {/* App content */}
                <div className="p-4 space-y-4">
                    <h2 className="text-xl font-bold text-foreground">Quick Add</h2>
                    <p className="text-muted-foreground">
                        Add a custom food item that's not in the database.
                    </p>
                    <Button onClick={() => setShowSheet(true)} className="w-full">
                        Add Custom Food
                    </Button>
                    <div className="space-y-3 pt-4">
                        <p className="text-sm text-muted-foreground">Recent custom foods:</p>
                        {['Homemade soup - 180 cal', 'Protein shake - 250 cal'].map((food) => (
                            <div key={food} className="p-4 bg-surface rounded-xl border border-border">
                                <p className="text-foreground">{food}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Modal sheet - no peek when collapsed, but has header/footer when open */}
                {showSheet && (
                    <ModalSheet open={true} onOpenChange={(open) => !open && setShowSheet(false)}>
                        {/* Header - only visible when sheet is open */}
                        <ModalSheetPeek visibleWhenCollapsed={false}>
                            <div className="flex items-center justify-between py-2">
                                <h3 className="text-lg font-bold text-foreground">Add Custom Food</h3>
                                <Button variant="icon" size="icon-sm" onClick={() => setShowSheet(false)}>
                                    <LogOut className="h-4 w-4" />
                                </Button>
                            </div>
                        </ModalSheetPeek>

                        {/* Form content */}
                        <ModalSheetContent>
                            <div className="space-y-4">
                                {formFields.map((field) => (
                                    <div key={field.label} className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">{field.label}</label>
                                        <input
                                            type="text"
                                            placeholder={field.placeholder}
                                            className="w-full px-4 py-3 bg-muted rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold"
                                        />
                                    </div>
                                ))}
                            </div>
                        </ModalSheetContent>

                        {/* Footer actions - only visible when sheet is open */}
                        <ModalSheetBottomPeek visibleWhenCollapsed={false}>
                            <div className="flex gap-2 pt-4">
                                <Button variant="secondary" className="flex-1" onClick={() => setShowSheet(false)}>
                                    Cancel
                                </Button>
                                <Button variant="default" className="flex-1" onClick={() => setShowSheet(false)}>
                                    Save Food
                                </Button>
                            </div>
                        </ModalSheetBottomPeek>
                    </ModalSheet>
                )}
            </div>
        );
    },
};
