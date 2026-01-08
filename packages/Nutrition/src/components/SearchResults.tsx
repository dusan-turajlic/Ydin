import { useEffect, useState, useRef } from "react";
import { FoodCard } from "@ydin/design-system";
import { search } from "@/services/api/openFoodDex";
import type { IOpenFoodDexObject } from "@/modals";
import { formatProductName } from "@/utils/format";
import { calculateCaloriesFromMacros } from "@/utils/macros";
import { LoadingSpinner } from "@/components/ui";
import { Search, SearchX } from "@ydin/design-system/icons";
import { Link } from "react-router-dom";

interface SearchResultsProps {
    query: string;
}

const DEFAULT_EMOJI = "🍽️";
const DEBOUNCE_MS = 500;

export default function SearchResults({ query }: Readonly<SearchResultsProps>) {
    const [results, setResults] = useState<IOpenFoodDexObject[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

    useEffect(() => {
        // Clear previous timeout
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        // Reset if query is empty
        if (!query.trim()) {
            setResults([]);
            setIsSearching(false);
            return;
        }

        setIsSearching(true);

        // Debounce the search
        debounceRef.current = setTimeout(async () => {
            const searchResults = await search(query);
            setResults(searchResults);
            setIsSearching(false);
        }, DEBOUNCE_MS);

        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        };
    }, [query]);

    const formatServing = (item: IOpenFoodDexObject): string => {
        if (item.serving_size && item.serving_unit) {
            return `${item.serving_size}${item.serving_unit}`;
        }
        if (item.serving_size) {
            return `${item.serving_size}g`;
        }
        return "1 serving";
    };

    const handleItemClick = (item: IOpenFoodDexObject) => {
        // TODO: Navigate to food item detail
        console.log("Selected:", item.code);
    };

    // Empty state when no query
    if (!query.trim()) {
        return (
            <div className="flex flex-col items-center justify-center text-foreground-secondary py-12 h-full">
                <span className="text-4xl mb-2"><Search className="h-8 w-8" /></span>
                <p>Start typing to search for foods</p>
            </div>
        );
    }

    // Loading state
    if (isSearching && results.length === 0) {
        return (
            <div className="flex items-center justify-center py-12 h-full">
                <LoadingSpinner show={true} />
            </div>
        );
    }

    // No results state
    if (!isSearching && results.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center text-foreground-secondary py-12 h-full">
                <span className="text-4xl mb-2"><SearchX className="h-8 w-8" /></span>
                <p>No results found for "{query}"</p>
            </div>
        );
    }

    return (
        <div className="overflow-y-auto h-full">
            <div className="flex flex-col gap-2">
                {results.map((item) => {
                    const calories = item.kcal ?? calculateCaloriesFromMacros({
                        protein: item.protein,
                        fat: item.fat,
                        carbs: item.carbs,
                    });

                    return (
                        <Link key={item.code} to={`/food/${item.code}`}>
                            <FoodCard
                                title={formatProductName(item.name, item.brand)}
                                emoji={DEFAULT_EMOJI}
                                calories={Math.round(calories)}
                                protein={Math.round(item.protein ?? 0)}
                                fat={Math.round(item.fat ?? 0)}
                                carbs={Math.round(item.carbs ?? 0)}
                                serving={formatServing(item)}
                                onToggle={() => handleItemClick(item)}
                            />
                        </Link>
                    );
                })}

                {/* Show spinner at bottom while loading more */}
                {isSearching && results.length > 0 && (
                    <div className="flex justify-center py-4">
                        <LoadingSpinner show={true} size="sm" />
                    </div>
                )}
            </div>
        </div>
    );
}

