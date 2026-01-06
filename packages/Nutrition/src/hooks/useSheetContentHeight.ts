import { useWindowSize } from "@uidotdev/usehooks";

/** Default distance from the top of the viewport in pixels */
const DEFAULT_TOP_OFFSET = 186;

interface UseSheetContentHeightOptions {
    /** Distance from top of viewport in pixels. Default: 100 */
    topOffset?: number;
    /** Bottom safe area / padding in pixels. Default: 0 */
    bottomOffset?: number;
    /** Fallback value when calculation fails. Default: 'calc(100vh - 100px)' */
    fallback?: string;
}

/**
 * Returns a calculated height string based on distance from top of viewport.
 * Ensures the sheet's top edge stays at a consistent position.
 * Useful for modal sheets and panels that need responsive sizing.
 */
export function useSheetContentHeight(options: UseSheetContentHeightOptions = {}): string {
    const {
        topOffset = DEFAULT_TOP_OFFSET,
        bottomOffset = 0,
        fallback = `calc(100vh - ${DEFAULT_TOP_OFFSET}px)`
    } = options;
    const windowSize = useWindowSize();

    const viewportHeight = windowSize.height ?? 0;
    const calculatedHeight = Math.round(viewportHeight - topOffset - bottomOffset);

    if (calculatedHeight <= 0) {
        return fallback;
    }

    return `${calculatedHeight}px`;
}

export default useSheetContentHeight;
