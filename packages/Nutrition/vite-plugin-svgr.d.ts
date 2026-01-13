declare module "vite-plugin-svgr" {
    import type { Plugin } from "vite";
    
    interface SvgrOptions {
        include?: string | RegExp | (string | RegExp)[];
        exclude?: string | RegExp | (string | RegExp)[];
        svgrOptions?: Record<string, unknown>;
        esbuildOptions?: Record<string, unknown>;
    }
    
    export default function svgr(options?: SvgrOptions): Plugin;
}
