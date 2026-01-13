/// <reference types="vite/client" />

declare module "*.svg?react" {
    import type * as React from "react";
    const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    export default ReactComponent;
}

declare module "country-flag-emoji" {
    export interface CountryFlagEmoji {
        code: string;
        unicode: string;
        name: string;
        emoji: string;
    }

    export const list: CountryFlagEmoji[];
}
