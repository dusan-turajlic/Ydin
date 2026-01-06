import { useState, useEffect, useRef } from "react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useNavigate } from "react-router-dom";
import { ModalSheet, ModalSheetPeek, ModalSheetBottomPeek, ModalSheetContent, SearchInput, TabGroup, TabButton, Button } from "@ydin/design-system";
import { Scan, ScanBarcode, Search, Clock, ChevronLeft, X, Plus, Minus } from "@ydin/design-system/icons";
import SearchResults from "@/components/SearchResults";
import Scanner from "@/components/Scanner";
import ProductDetail from "@/components/ProductDetail";
import { sheetExpandedAtom } from "@/atoms/sheet";
import { logHourAtom } from "@/atoms/time";
import { productActionAtom, logFoodCallbackAtom, incrementServingAtom, decrementServingAtom } from "@/atoms/productAction";

const SCAN_TAB_INDEX = 0;
const SEARCH_TAB_INDEX = 1;

interface FoodSearchSheetProps {
    code?: string;
}

export default function FoodSearchSheet({ code }: Readonly<FoodSearchSheetProps>) {
    const navigate = useNavigate();
    const [isExpanded, setIsExpanded] = useAtom(sheetExpandedAtom);
    const [activeTab, setActiveTab] = useState(SEARCH_TAB_INDEX);
    const [searchQuery, setSearchQuery] = useState("");
    const logHour = useAtomValue(logHourAtom);
    const setLogHour = useSetAtom(logHourAtom);
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Product action bar state from atoms
    const productAction = useAtomValue(productActionAtom);
    const logFoodCallback = useAtomValue(logFoodCallbackAtom);
    const incrementServing = useAtomValue(incrementServingAtom);
    const decrementServing = useAtomValue(decrementServingAtom);

    // Auto-expand when viewing product details
    useEffect(() => {
        if (code) {
            setIsExpanded(true);
        }
    }, [code, setIsExpanded]);

    // Auto-focus search input when sheet expands and search tab is active
    useEffect(() => {
        if (isExpanded && activeTab === SEARCH_TAB_INDEX && !code) {
            // Small delay to ensure the DOM is ready after animation
            const timeoutId = setTimeout(() => {
                searchInputRef.current?.focus();
            }, 100);
            return () => clearTimeout(timeoutId);
        }
    }, [isExpanded, activeTab, code]);

    const handleTabChange = (index: number) => {
        setActiveTab(index);
    };

    const handleCloseProductDetail = () => {
        setIsExpanded(false);
        navigate("/food");
    };

    // Display time from atom (selected or current hour)
    const displayTime = `${logHour}:00`;

    const tabs = [
        {
            index: SCAN_TAB_INDEX,
            tab: <TabButton icon={<Scan className="h-4 w-4" />}>Scan</TabButton>,
            content: <Scanner />,
        },
        {
            index: SEARCH_TAB_INDEX,
            tab: <TabButton icon={<Search className="h-4 w-4" />}>Search</TabButton>,
            content: <SearchResults query={searchQuery} />,
        },
    ].sort((a, b) => a.index - b.index);

    // Viewing product details
    const isViewingProduct = !!code;

    return (
        <ModalSheet
            open={isExpanded}
            onOpenChange={(open) => {
                setIsExpanded(open);
                if (!open) {
                    setActiveTab(SEARCH_TAB_INDEX);
                    // Clear selected hour when closing
                    setLogHour(null);
                    // Navigate back if closing product detail
                    if (isViewingProduct) {
                        navigate("/food");
                    }
                }
            }}
            modal={false}
        >
            {/* Product detail action bar - only visible when viewing a product */}
            {isViewingProduct && (
                <ModalSheetPeek visibleWhenCollapsed={false}>
                    <div className="flex items-center justify-between py-2">
                        <button
                            type="button"
                            onClick={() => navigate("/food")}
                            className="p-1 -ml-1 text-foreground-secondary hover:text-foreground transition-colors"
                        >
                            <ChevronLeft className="h-6 w-6" />
                        </button>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-2 bg-muted rounded-full px-3 py-1.5">
                                <Clock className="h-4 w-4 text-foreground-secondary" />
                                <span className="text-sm text-foreground">{displayTime}</span>
                            </div>
                            <Button variant="secondary" size="icon-sm" onClick={handleCloseProductDetail}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </ModalSheetPeek>
            )}

            <ModalSheetContent>
                {isExpanded && (
                    isViewingProduct ? (
                        <ProductDetail code={code} />
                    ) : (
                        <TabGroup
                            defaultTab={activeTab}
                            tabs={tabs}
                            onTabChange={handleTabChange}
                        />
                    )
                )}
            </ModalSheetContent>

            {/* Bottom peek - always render to keep hasPersistentPeek stable */}
            <ModalSheetBottomPeek>
                <div className="relative h-12">
                    {/* Search input - shown when on search tab and not viewing product */}
                    <div
                        className={`absolute inset-0 ${activeTab === SEARCH_TAB_INDEX && !isViewingProduct
                            ? 'w-full'
                            : 'w-0 pointer-events-none -z-50 overflow-hidden'
                            }`}
                    >
                        <SearchInput
                            ref={searchInputRef}
                            placeholder="Search for a food..."
                            onFocus={() => setIsExpanded(true)}
                            onSearch={setSearchQuery}
                            action={!isExpanded && (
                                <Button
                                    onClick={() => {
                                        setActiveTab(SCAN_TAB_INDEX);
                                        setIsExpanded(true);
                                    }}
                                    variant="icon"
                                    size="icon-sm"
                                    aria-label="Scan barcode"
                                >
                                    <ScanBarcode className="h-4 w-4" />
                                </Button>
                            )}
                        />
                    </div>

                    {/* Product action bar - shown when viewing product */}
                    <div
                        className={`absolute inset-0 ${isViewingProduct && productAction
                            ? 'w-full'
                            : 'w-0 pointer-events-none overflow-hidden'
                            }`}
                    >
                        <div className="flex items-center gap-3 h-full">
                            {/* Serving Counter */}
                            <div className="flex items-center gap-1">
                                <button
                                    type="button"
                                    onClick={() => decrementServing?.()}
                                    className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors text-foreground disabled:opacity-50"
                                    disabled={!productAction?.canDecrement}
                                >
                                    <Minus className="h-4 w-4" />
                                </button>
                                <span className="w-8 text-center font-bold text-foreground">
                                    {productAction?.servingCount ?? 1}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => incrementServing?.()}
                                    className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors text-foreground"
                                >
                                    <Plus className="h-4 w-4" />
                                </button>
                            </div>

                            {/* Serving Info */}
                            <div className="flex-1 bg-muted rounded-xl px-3 py-2 text-sm text-foreground truncate">
                                {productAction?.productName ?? "serving"} • {productAction?.totalServing ?? 0} {productAction?.servingUnit ?? "g"}
                            </div>

                            {/* Log Food Button */}
                            <Button onClick={() => logFoodCallback?.()}>
                                Log Food
                            </Button>
                        </div>
                    </div>
                </div>
            </ModalSheetBottomPeek>
        </ModalSheet>
    );
}
