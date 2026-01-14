interface ScanFrameProps {
    /** Size of the scan frame in pixels */
    size?: number;
}

export function ScanFrame({ size = 256 }: ScanFrameProps) {
    const cornerSize = 40;
    const strokeWidth = 4;

    return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {/* Scan frame with corner brackets */}
            <div
                className="relative"
                style={{ width: size, height: size }}
            >
                {/* Top-left corner */}
                <svg
                    className="absolute top-0 left-0"
                    width={cornerSize}
                    height={cornerSize}
                    viewBox={`0 0 ${cornerSize} ${cornerSize}`}
                >
                    <path
                        d={`M0 ${cornerSize} L0 0 L${cornerSize} 0`}
                        fill="none"
                        stroke="#e4b962"
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>

                {/* Top-right corner */}
                <svg
                    className="absolute top-0 right-0"
                    width={cornerSize}
                    height={cornerSize}
                    viewBox={`0 0 ${cornerSize} ${cornerSize}`}
                >
                    <path
                        d={`M0 0 L${cornerSize} 0 L${cornerSize} ${cornerSize}`}
                        fill="none"
                        stroke="#e4b962"
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>

                {/* Bottom-left corner */}
                <svg
                    className="absolute bottom-0 left-0"
                    width={cornerSize}
                    height={cornerSize}
                    viewBox={`0 0 ${cornerSize} ${cornerSize}`}
                >
                    <path
                        d={`M0 0 L0 ${cornerSize} L${cornerSize} ${cornerSize}`}
                        fill="none"
                        stroke="#e4b962"
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>

                {/* Bottom-right corner */}
                <svg
                    className="absolute bottom-0 right-0"
                    width={cornerSize}
                    height={cornerSize}
                    viewBox={`0 0 ${cornerSize} ${cornerSize}`}
                >
                    <path
                        d={`M${cornerSize} 0 L${cornerSize} ${cornerSize} L0 ${cornerSize}`}
                        fill="none"
                        stroke="#e4b962"
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </div>
        </div>
    );
}
