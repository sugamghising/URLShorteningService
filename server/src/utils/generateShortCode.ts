import UrlModel from "../models/Url.model";

// Cache the nanoid import to avoid re-importing on every call
let nanoidModule: { nanoid: (size?: number) => string } | null = null;

/**
 * Dynamically imports nanoid (ESM module) in CommonJS context
 * Caches the import to avoid repeated dynamic imports
 * 
 * This is necessary because nanoid v5+ is ESM-only, but we compile to CommonJS
 * Dynamic import() works in CommonJS modules at runtime (Node.js feature)
 */
async function getNanoid(): Promise<(size?: number) => string> {
    if (!nanoidModule) {
        try {
            nanoidModule = await import("nanoid");
        } catch (error) {
            throw new Error(`Failed to import nanoid: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    return nanoidModule.nanoid;
}

export async function generateUniqueShortCode(len = 6): Promise<string> {
    const nanoid = await getNanoid();
    while (true) {
        const code = nanoid(len)
        const exists = await UrlModel.exists({ shortCode: code })
        if (!exists) return code;
    }
}