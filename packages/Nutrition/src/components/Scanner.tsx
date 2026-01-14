import { useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { BarcodeScanner } from "react-barcode-scanner";
import "react-barcode-scanner/polyfill";
import { motion, AnimatePresence } from "framer-motion";
import { SegmentedControl, Button, Input } from "@ydin/design-system";
import { Keyboard, X, CameraOff } from "@ydin/design-system/icons";
import { ScanFrame } from "./ScanFrame";

// TODO: Label mode - OCR scanning for nutrition labels
// Recommended library: tesseract.js (https://github.com/naptha/tesseract.js)
// v6.0.0+ has WebAssembly support for browser-based OCR

type ScannerMode = "barcode" | "label";

const SCANNER_MODES = [
    { value: "barcode" as const, label: "Barcode" },
    { value: "label" as const, label: "Label" },
] as const;

// Supported barcode formats
const BARCODE_FORMATS = ["ean_13", "ean_8", "upc_a", "upc_e", "qr_code"];

interface DetectedBarcode {
    rawValue: string;
    format: string;
    boundingBox?: DOMRectReadOnly;
    cornerPoints?: { x: number; y: number }[];
}

export default function Scanner() {
    const navigate = useNavigate();
    const hasNavigated = useRef(false);

    // Local state
    const [mode, setMode] = useState<ScannerMode>("barcode");
    const [showManualInput, setShowManualInput] = useState(false);
    const [manualBarcode, setManualBarcode] = useState("");
    const [cameraError] = useState<string | null>(null);

    // Handle barcode detection
    const handleCapture = useCallback(
        (barcodes: DetectedBarcode[]) => {
            if (barcodes.length === 0 || hasNavigated.current) return;

            const barcode = barcodes[0];
            const code = barcode.rawValue;

            // Prevent duplicate scans using ref (avoids re-render)
            hasNavigated.current = true;

            // Haptic feedback if available
            if (navigator.vibrate) {
                navigator.vibrate(100);
            }

            // Navigate to product detail (same as clicking a search result)
            navigate(`/food/${code}`);
        },
        [navigate]
    );

    // Handle manual barcode submission
    const handleManualSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const code = manualBarcode.trim();
        if (code) {
            setShowManualInput(false);
            navigate(`/food/${code}`);
        }
    };

    // Handle mode change
    const handleModeChange = (newMode: ScannerMode) => {
        // Label mode is disabled for now
        if (newMode === "label") return;
        setMode(newMode);
    };

    // Camera error UI
    if (cameraError) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-foreground-secondary p-6 text-center">
                <CameraOff className="h-12 w-12 mb-4" />
                <p className="text-lg font-medium mb-2">Camera Access Required</p>
                <p className="text-sm">{cameraError}</p>
            </div>
        );
    }

    return (
        <div className="relative w-full h-[60vh] overflow-hidden bg-black rounded-xl">
            {/* Camera view */}
            {mode === "barcode" && (
                <BarcodeScanner
                    onCapture={handleCapture}
                    options={{
                        delay: 500,
                        formats: BARCODE_FORMATS,
                    }}
                    trackConstraints={{
                        facingMode: "environment",
                        width: { ideal: 1280 },
                        height: { ideal: 720 },
                    }}
                    paused={showManualInput}
                />
            )}

            {/* Label mode placeholder */}
            {mode === "label" && (
                <div className="absolute inset-0 flex items-center justify-center text-foreground-secondary">
                    <p>Label scanning coming soon</p>
                </div>
            )}

            {/* Scan frame overlay */}
            <ScanFrame />

            {/* Top controls overlay */}
            <div className="absolute inset-x-0 top-0 p-4 flex items-center justify-between">
                <SegmentedControl
                    options={SCANNER_MODES}
                    value={mode}
                    onChange={handleModeChange}
                    size="sm"
                    aria-label="Scanner mode"
                    className="bg-surface/80 backdrop-blur"
                />

                <div className="flex gap-2">
                    <Button
                        variant="icon"
                        size="icon-sm"
                        onPress={() => setShowManualInput(true)}
                        aria-label="Enter barcode manually"
                        className="bg-surface/80 backdrop-blur"
                    >
                        <Keyboard className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Manual input overlay */}
            <AnimatePresence>
                {showManualInput && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ type: "spring", stiffness: 500, damping: 35 }}
                        className="absolute inset-x-4 bottom-4 bg-surface rounded-2xl p-4 shadow-lg"
                    >
                        <div className="flex items-center gap-2 mb-3">
                            <h3 className="text-foreground font-medium flex-1">Enter Barcode</h3>
                            <Button
                                variant="ghost"
                                size="icon-sm"
                                onPress={() => setShowManualInput(false)}
                                aria-label="Close"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                        <form onSubmit={handleManualSubmit} className="flex gap-2">
                            <Input
                                value={manualBarcode}
                                onChange={setManualBarcode}
                                placeholder="e.g., 5901234123457"
                                type="text"
                                className="flex-1"
                                autoFocus
                            />
                            <Button type="submit" isDisabled={!manualBarcode.trim()}>
                                Search
                            </Button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
