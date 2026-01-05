import { useWindowSize } from "@uidotdev/usehooks";

interface UseSheetContentHeightOptions {
    /** Percentage of viewport height (0-1). Default: 0.7 */
    percentage?: number;
    /** Fallback value when calculation fails. Default: '70vh' */
    fallback?: string;
}

/**
 * Returns a calculated height string based on viewport height percentage.
 * Useful for modal sheets and panels that need responsive sizing.
 */
export function useSheetContentHeight(options: UseSheetContentHeightOptions = {}): string {
    const { percentage = 0.7, fallback = '70vh' } = options;
    const windowSize = useWindowSize();

    const calculatedHeight = Math.round((windowSize.height ?? 0) * percentage);

    if (calculatedHeight <= 0) {
        return fallback;
    }

    return `${calculatedHeight}px`;
}

export default useSheetContentHeight;

