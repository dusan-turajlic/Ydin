import { useSheetContentHeight } from "@/hooks/useSheetContentHeight";

export default function Scanner() {
    const sheetHeight = useSheetContentHeight();

    return (
        <div className="flex flex-col items-center justify-center text-foreground-secondary py-12" style={{ height: sheetHeight }}>
            <p>Scanner</p>
        </div>
    );
}
