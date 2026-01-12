/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

declare module "country-flag-emoji" {
    export interface CountryFlagEmoji {
        code: string;
        unicode: string;
        name: string;
        emoji: string;
    }

    export const list: CountryFlagEmoji[];
}
