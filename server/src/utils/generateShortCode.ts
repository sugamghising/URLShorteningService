import { nanoid } from "nanoid";
import UrlModel from "../models/Url.model";

export async function generateUniqueShortCode(len = 6): Promise<string> {
    while (true) {
        const code = nanoid(len)
        const exists = await UrlModel.exists({ shortCode: code })
        if (!exists) return code;
    }
}