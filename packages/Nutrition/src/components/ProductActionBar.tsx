import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { Button, Input } from "@ydin/design-system";
import { productAtomFamily, servingSizeAtom } from "@/atoms/selectedFood";
import { addEntryAndRefreshAtom } from "@/atoms/day";
import { logHourAtom } from "@/atoms/time";
import { sheetExpandedAtom } from "@/atoms/sheet";
import { Serving } from "@/domain";

interface ProductActionBarProps {
    code: string;
}

/**
 * Isolated action bar for logging a food product.
 * Two-row layout:
 * - Row 1: Input + Log Food button
 * - Row 2: Unit badges | Serving size presets
 */
export function ProductActionBar({ code }: Readonly<ProductActionBarProps>) {
    const navigate = useNavigate();
    const product = useAtomValue(productAtomFamily(code));
    const addEntry = useSetAtom(addEntryAndRefreshAtom);
    const [logHour, setLogHour] = useAtom(logHourAtom);
    const setIsExpanded = useSetAtom(sheetExpandedAtom);

    // Shared serving size atom - syncs with ProductDetail
    const [servingSize, setServingSize] = useAtom(servingSizeAtom);

    // Product's default serving size
    const productServingSize = product?.macros?.serving_size;
    const hasProductServing = productServingSize && productServingSize > 0 && productServingSize !== 100;

    // Initialize serving size when product loads
    useEffect(() => {
        if (product) {
            setServingSize(productServingSize ?? 100);
        }
    }, [product, productServingSize, setServingSize]);

    const handleServingSizeChange = (value: string) => {
        // Allow empty input - treat as 0
        if (value === "" || value === undefined) {
            setServingSize(0);
            return;
        }

        const parsed = Number.parseInt(value, 10);
        if (Number.isNaN(parsed)) {
            setServingSize(0);
        } else {
            setServingSize(parsed);
        }
    };

    const handleLogFood = async () => {
        if (!product) return;

        // Ensure at least 1g when logging
        const finalServingSize = Serving.clamp(servingSize);
        const macros = Serving.scaleMacros(product.macros?.per100g, finalServingSize);

        await addEntry({
            hour: logHour,
            entry: {
                code: product.code,
                name: product.product_name ?? "Unknown",
                servingCount: 1,
                servingSize: finalServingSize,
                unit: "g",
                macros,
            },
        });

        // Reset and navigate back
        setLogHour(null);
        setIsExpanded(false);
        navigate("/food");
    };

    if (!product) {
        return null;
    }

    return (
        <div className="flex flex-col gap-2 h-full justify-center">
            {/* Row 1: Input + Log Food button */}
            <div className="flex items-center gap-2">
                <Input
                    type="number"
                    value={String(servingSize || "")}
                    onChange={handleServingSizeChange}
                    endAdornment={
                        <div className="text-foreground-secondary px-2">
                            g
                        </div>
                    }
                />

                {/* Log Food Button */}
                <Button onPress={handleLogFood}>
                    Log Food
                </Button>
            </div>

            {/* Row 2: Unit badges | Serving size presets */}
            <div className="flex items-center gap-1">
                {/* Unit badge - g (selected) */}
                <Button size="xs" variant="default">
                    g
                </Button>

                {/* Separator */}
                <span className="text-foreground-secondary/30 mx-1">|</span>

                {/* 100g preset badge */}
                <Button
                    size="xs"
                    variant={servingSize === 100 ? "default" : "secondary"}
                    onPress={() => setServingSize(100)}
                >
                    100g
                </Button>

                {/* serving preset badge - only shown if product has serving size different from 100 */}
                {hasProductServing && (
                    <Button
                        size="xs"
                        variant={servingSize === productServingSize ? "default" : "secondary"}
                        onPress={() => setServingSize(productServingSize)}
                    >
                        serving
                    </Button>
                )}
            </div>
        </div>
    );
}
