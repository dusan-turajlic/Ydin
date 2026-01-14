import { useState, useEffect, useRef, Suspense, useMemo } from "react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useNavigate } from "react-router-dom";
import { FixedModalSheet, FixedModalSheetPeek, FixedModalSheetBottomPeek, FixedModalSheetContent, SearchInput, TabGroup, TabButton, Button } from "@ydin/design-system";
import { Scan, ScanBarcode, Search, Clock, ChevronLeft, X } from "@ydin/design-system/icons";
import SearchResults from "@/components/SearchResults";
import Scanner from "@/components/Scanner";
import ProductDetail from "@/components/ProductDetail";
import { ProductActionBar } from "@/components/ProductActionBar";
import { sheetExpandedAtom } from "@/atoms/sheet";
import { logHourAtom } from "@/atoms/time";

const SCAN_TAB_ID = "scan";
const SEARCH_TAB_ID = "search";

interface FoodSearchSheetProps {
    code?: string;
}

export default function FoodSearchSheet({ code }: Readonly<FoodSearchSheetProps>) {
    const navigate = useNavigate();
    const [isExpanded, setIsExpanded] = useAtom(sheetExpandedAtom);
    const [activeTab, setActiveTab] = useState(SEARCH_TAB_ID);
    const [searchQuery, setSearchQuery] = useState("");
    const logHour = useAtomValue(logHourAtom);
    const setLogHour = useSetAtom(logHourAtom);
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Auto-expand when viewing product details
    useEffect(() => {
        if (code) {
            setIsExpanded(true);
        }
    }, [code, setIsExpanded]);

    // Auto-focus search input when sheet expands and search tab is active
    useEffect(() => {
        if (isExpanded && activeTab === SEARCH_TAB_ID && !code) {
            // Small delay to ensure the DOM is ready after animation
            const timeoutId = setTimeout(() => {
                searchInputRef.current?.focus();
            }, 100);
            return () => clearTimeout(timeoutId);
        }
    }, [isExpanded, activeTab, code]);

    const handleTabChange = (id: string) => {
        setActiveTab(id);
    };

    const handleCloseProductDetail = () => {
        setIsExpanded(false);
        navigate("/food");
    };

    // Display time from atom (selected or current hour)
    const displayTime = `${logHour}:00`;

    const tabs = useMemo(() => [
        {
            id: SCAN_TAB_ID,
            tab: <TabButton icon={<Scan className="h-4 w-4" />}>Scan</TabButton>,
            content: <Scanner />,
        },
        {
            id: SEARCH_TAB_ID,
            tab: <TabButton icon={<Search className="h-4 w-4" />}>Search</TabButton>,
            content: <SearchResults query={searchQuery} />,
        },
    ], [searchQuery]);

    // Viewing product details
    const isViewingProduct = !!code;

    return (
        <FixedModalSheet
            open={isExpanded}
            onOpenChange={(open) => {
                setIsExpanded(open);
                if (!open) {
                    setActiveTab(SEARCH_TAB_ID);
                    // Clear selected hour when closing
                    setLogHour(null);
                    // Navigate back if closing product detail
                    if (isViewingProduct) {
                        navigate("/food");
                    }
                }
            }}
            snapPoints={[0.9]}
            modal={false}
        >
            {/* Product detail action bar - only visible when viewing a product */}
            {isViewingProduct && (
                <FixedModalSheetPeek visibleWhenCollapsed={false}>
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
                            <Button variant="secondary" size="icon-sm" onPress={handleCloseProductDetail}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </FixedModalSheetPeek>
            )}

            <FixedModalSheetContent>
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
            </FixedModalSheetContent>

            {/* Bottom peek - always render to keep hasPersistentPeek stable */}
            <FixedModalSheetBottomPeek>
                <div className={`relative ${isViewingProduct ? 'h-20' : 'h-12'}`}>
                    {/* Search input - shown when on search tab and not viewing product */}
                    <div
                        className={`absolute inset-0 ${activeTab === SEARCH_TAB_ID && !isViewingProduct
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
                                    onPress={() => {
                                        setActiveTab(SCAN_TAB_ID);
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
                        className={`absolute inset-0 ${isViewingProduct
                            ? 'w-full'
                            : 'w-0 pointer-events-none overflow-hidden'
                            }`}
                    >
                        {isViewingProduct && (
                            <Suspense fallback={<div className="h-full" />}>
                                <ProductActionBar key={code} code={code} />
                            </Suspense>
                        )}
                    </div>
                </div>
            </FixedModalSheetBottomPeek>
        </FixedModalSheet>
    );
}
