import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Search, Clock, Apple, Pizza, Coffee, LogOut, ChevronUp, ChevronDown } from 'lucide-react';

import {
    FixedModalSheet,
    FixedModalSheetPeek,
    FixedModalSheetBottomPeek,
    FixedModalSheetContent,
    useFixedModalSheetContext,
} from '@/components/fixedModalSheet';
import { Button } from '@/ui/button';

const meta: Meta<typeof FixedModalSheet> = {
    title: 'Components/FixedModalSheet',
    component: FixedModalSheet,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        open: {
            control: 'boolean',
            description: 'Controls if the sheet is expanded (true) or collapsed to peek (false)',
        },
        snapPoints: {
            control: 'object',
            description: 'Array of snap points when expanded (0-1 for %, >1 for px, or strings)',
        },
        initialSnap: {
            control: 'number',
            description: 'Initial snap point index when expanded',
        },
        modal: {
            control: 'boolean',
            description: 'Show backdrop overlay when expanded (default: true)',
        },
        dismissible: {
            control: 'boolean',
            description: 'Allow dismissing by dragging down (default: true)',
        },
    },
};

export default meta;
type Story = StoryObj<typeof FixedModalSheet>;

// Search with persistent peek - like the original ModalSheet
export const SearchWithPeek: Story = {
    name: 'Search with Persistent Peek',
    render: function SearchDemo() {
        const [expanded, setExpanded] = useState(false);
        const [searchValue, setSearchValue] = useState('');

        const recentSearches = ['Chicken breast', 'Brown rice', 'Greek yogurt', 'Almonds'];
        const quickItems = [
            { icon: Apple, name: 'Apple', calories: 95 },
            { icon: Pizza, name: 'Pizza slice', calories: 285 },
            { icon: Coffee, name: 'Black coffee', calories: 5 },
            { icon: Apple, name: 'Banana', calories: 105 },
            { icon: Pizza, name: 'Burger', calories: 450 },
            { icon: Coffee, name: 'Latte', calories: 120 },
            { icon: Apple, name: 'Orange', calories: 62 },
            { icon: Pizza, name: 'Pasta', calories: 320 },
        ];

        return (
            <div className="relative h-[600px] w-[400px] bg-background rounded-xl overflow-hidden border border-border">
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
                        Search bar always visible! Focus to expand, drag down to collapse.
                    </p>
                </div>

                {/* Sheet with persistent search peek */}
                <FixedModalSheet
                    open={expanded}
                    onOpenChange={setExpanded}
                    snapPoints={[0.6, 0.9]}
                    modal={false}
                >
                    {/* Always visible search bar */}
                    <FixedModalSheetPeek>
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
                    </FixedModalSheetPeek>

                    {/* Expanded content - scrollable */}
                    <FixedModalSheetContent>
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

                        <div className="space-y-3">
                            <span className="text-sm font-medium text-muted-foreground">Quick Add</span>
                            <div className="space-y-2">
                                {quickItems.map((item, index) => (
                                    <button
                                        key={`${item.name}-${index}`}
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
                    </FixedModalSheetContent>
                </FixedModalSheet>
            </div>
        );
    },
};

// Bottom peek - search at bottom like original
export const BottomPeekOnly: Story = {
    name: 'Bottom Peek Only',
    render: function BottomPeekDemo() {
        const [expanded, setExpanded] = useState(false);
        const [searchValue, setSearchValue] = useState('');

        const searchResults = [
            { icon: Apple, name: 'Apple', calories: 95, protein: '0.5g' },
            { icon: Pizza, name: 'Pizza Margherita', calories: 285, protein: '12g' },
            { icon: Coffee, name: 'Latte', calories: 120, protein: '6g' },
            { icon: Apple, name: 'Grapes', calories: 67, protein: '0.7g' },
            { icon: Pizza, name: 'Sushi Roll', calories: 200, protein: '8g' },
            { icon: Coffee, name: 'Green Tea', calories: 2, protein: '0g' },
        ];

        return (
            <div className="relative h-[600px] w-[400px] bg-background rounded-xl overflow-hidden border border-border">
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
                        Search bar at bottom - always visible! Focus to expand.
                    </p>
                </div>

                <FixedModalSheet
                    open={expanded}
                    onOpenChange={setExpanded}
                    snapPoints={[0.7]}
                    modal={false}
                >
                    {/* Results appear when expanded */}
                    <FixedModalSheetContent>
                        <div className="space-y-2">
                            <span className="text-sm font-medium text-muted-foreground">Results</span>
                            {searchResults.map((item, index) => (
                                <button
                                    key={`${item.name}-${index}`}
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
                    </FixedModalSheetContent>

                    {/* Always visible search bar at bottom */}
                    <FixedModalSheetBottomPeek>
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
                    </FixedModalSheetBottomPeek>
                </FixedModalSheet>
            </div>
        );
    },
};

// Both peeks visible - header and footer always shown
export const BothPeeksVisible: Story = {
    name: 'Both Peeks Visible',
    render: function BothPeeksDemo() {
        const [expanded, setExpanded] = useState(false);

        const notifications = [
            { title: 'Goal achieved!', desc: 'You hit your protein target', time: '2m ago' },
            { title: 'Reminder', desc: 'Log your lunch', time: '1h ago' },
            { title: 'Weekly report', desc: 'Your progress summary is ready', time: '3h ago' },
            { title: 'New feature', desc: 'Try our meal planner', time: '1d ago' },
            { title: 'Streak bonus', desc: '7 days in a row!', time: '2d ago' },
        ];

        return (
            <div className="relative h-[600px] w-[400px] bg-background rounded-xl overflow-hidden border border-border">
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
                        Header and footer always visible! Tap or drag to expand.
                    </p>
                </div>

                <FixedModalSheet
                    open={expanded}
                    onOpenChange={setExpanded}
                    snapPoints={[0.6]}
                    modal={false}
                >
                    {/* Top peek - notification summary */}
                    <FixedModalSheetPeek>
                        <button
                            onClick={() => setExpanded(!expanded)}
                            className="w-full flex items-center justify-between py-2"
                        >
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-gold animate-pulse" />
                                <span className="text-foreground font-medium">5 notifications</span>
                            </div>
                            <span className="text-sm text-muted-foreground">
                                {expanded ? 'Collapse' : 'View all'}
                            </span>
                        </button>
                    </FixedModalSheetPeek>

                    {/* Scrollable notification list */}
                    <FixedModalSheetContent>
                        <div className="space-y-3">
                            {notifications.map((notif, index) => (
                                <div key={`${notif.title}-${index}`} className="p-3 bg-muted rounded-xl">
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
                    </FixedModalSheetContent>

                    {/* Bottom peek - quick actions */}
                    <FixedModalSheetBottomPeek>
                        <div className="flex gap-2">
                            <Button variant="secondary" className="flex-1" onPress={() => setExpanded(true)}>
                                Mark all read
                            </Button>
                            <Button variant="default" className="flex-1" onPress={() => setExpanded(true)}>
                                View details
                            </Button>
                        </div>
                    </FixedModalSheetBottomPeek>
                </FixedModalSheet>
            </div>
        );
    },
};

// No peek when collapsed - fully dismissible modal
export const NoPeekWhenCollapsed: Story = {
    name: 'No Peek When Collapsed',
    render: function NoPeekDemo() {
        const [showSheet, setShowSheet] = useState(false);

        const formFields = [
            { label: 'Food name', placeholder: 'e.g., Grilled chicken' },
            { label: 'Calories', placeholder: '0' },
            { label: 'Protein (g)', placeholder: '0' },
            { label: 'Carbs (g)', placeholder: '0' },
            { label: 'Fat (g)', placeholder: '0' },
            { label: 'Serving size', placeholder: 'e.g., 100g' },
        ];

        return (
            <div className="relative h-[600px] w-[400px] bg-background rounded-xl overflow-hidden border border-border">
                <div className="p-4 space-y-4">
                    <h2 className="text-xl font-bold text-foreground">Quick Add</h2>
                    <p className="text-muted-foreground">
                        Add a custom food item that's not in the database.
                    </p>
                    <Button onPress={() => setShowSheet(true)} className="w-full">
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

                {/* Modal sheet - no peek, just full modal */}
                {showSheet && (
                    <FixedModalSheet
                        open={true}
                        onOpenChange={(open) => !open && setShowSheet(false)}
                        snapPoints={[0.85]}
                    >
                        {/* Header - only visible when open */}
                        <FixedModalSheetPeek visibleWhenCollapsed={false}>
                            <div className="flex items-center justify-between py-2">
                                <h3 className="text-lg font-bold text-foreground">Add Custom Food</h3>
                                <Button variant="icon" size="icon-sm" onPress={() => setShowSheet(false)}>
                                    <LogOut className="h-4 w-4" />
                                </Button>
                            </div>
                        </FixedModalSheetPeek>

                        {/* Scrollable form */}
                        <FixedModalSheetContent>
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
                        </FixedModalSheetContent>

                        {/* Footer actions */}
                        <FixedModalSheetBottomPeek visibleWhenCollapsed={false}>
                            <div className="flex gap-2">
                                <Button variant="secondary" className="flex-1" onPress={() => setShowSheet(false)}>
                                    Cancel
                                </Button>
                                <Button variant="default" className="flex-1" onPress={() => setShowSheet(false)}>
                                    Save Food
                                </Button>
                            </div>
                        </FixedModalSheetBottomPeek>
                    </FixedModalSheet>
                )}
            </div>
        );
    },
};

// Snap point controls - interactive demo
export const SnapPointControls: Story = {
    name: 'Interactive Snap Points',
    render: function SnapDemo() {
        const [isOpen, setIsOpen] = useState(false);

        function SnapControls() {
            const { currentSnapPoint, snapTo, expand, collapse, isExpanded } = useFixedModalSheetContext();

            return (
                <div className="space-y-4">
                    <div className="text-center">
                        <p className="text-sm text-muted-foreground">Current snap point</p>
                        <p className="text-2xl font-bold text-foreground">{currentSnapPoint}</p>
                        <p className="text-sm text-muted-foreground">
                            {isExpanded ? 'Expanded' : 'Collapsed'}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="secondary"
                            className="flex-1"
                            onPress={() => currentSnapPoint > 0 ? snapTo(currentSnapPoint - 1) : collapse()}
                        >
                            <ChevronDown className="h-4 w-4 mr-2" />
                            Down
                        </Button>
                        <Button
                            variant="secondary"
                            className="flex-1"
                            onPress={() => isExpanded ? snapTo(currentSnapPoint + 1) : expand()}
                            isDisabled={isExpanded && currentSnapPoint === 2}
                        >
                            <ChevronUp className="h-4 w-4 mr-2" />
                            Up
                        </Button>
                    </div>
                    <p className="text-sm text-muted-foreground text-center">
                        Snap points: 30%, 60%, 90%
                    </p>
                </div>
            );
        }

        return (
            <div className="relative h-[600px] w-[400px] bg-background rounded-xl overflow-hidden border border-border">
                <div className="p-4 space-y-4">
                    <h2 className="text-xl font-bold text-foreground">Snap Point Demo</h2>
                    <p className="text-muted-foreground">
                        Peek is always visible. Drag or use buttons to control snap points.
                    </p>
                </div>

                <FixedModalSheet
                    open={isOpen}
                    onOpenChange={setIsOpen}
                    snapPoints={[0.3, 0.6, 0.9]}
                    initialSnap={1}
                    modal={false}
                >
                    <FixedModalSheetPeek>
                        <h3 className="text-lg font-bold text-foreground text-center py-2">
                            Drag or use buttons below
                        </h3>
                    </FixedModalSheetPeek>

                    <FixedModalSheetContent>
                        <SnapControls />
                        <div className="space-y-3 pt-4">
                            {Array.from({ length: 8 }, (_, i) => (
                                <div key={i} className="p-4 bg-muted rounded-xl">
                                    <p className="text-foreground">Scrollable item {i + 1}</p>
                                </div>
                            ))}
                        </div>
                    </FixedModalSheetContent>

                    <FixedModalSheetBottomPeek>
                        <Button className="w-full" onPress={() => setIsOpen(false)}>
                            Close
                        </Button>
                    </FixedModalSheetBottomPeek>
                </FixedModalSheet>
            </div>
        );
    },
};
