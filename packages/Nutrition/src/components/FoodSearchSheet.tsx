import { useState, useEffect, useRef } from "react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useNavigate } from "react-router-dom";
import { ModalSheet, ModalSheetPeek, ModalSheetContent, SearchInput, TabGroup, TabButton, Button } from "@ydin/design-system";
import { Scan, ScanBarcode, Search, Clock, ChevronLeft, X } from "@ydin/design-system/icons";
import SearchResults from "@/components/SearchResults";
import Scanner from "@/components/Scanner";
import ProductDetail from "@/components/ProductDetail";
import { sheetExpandedAtom } from "@/atoms/sheet";
import { logHourAtom } from "@/atoms/time";

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
            <ModalSheetPeek>
                {isViewingProduct ? (
                    // Product detail action bar
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
                ) : (
                    // Search input (default view)
                    activeTab === SEARCH_TAB_INDEX && (
                        <div className="py-2">
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
                    )
                )}
            </ModalSheetPeek>

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
        </ModalSheet>
    );
}
