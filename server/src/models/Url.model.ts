import mongoose, { Document, Schema } from "mongoose";

export interface IUrl extends Document {
    url: string;
    shortCode: string;
    accessCount: number;
    createdAt: Date;
    updatedAt: Date;
}

const urlSchema = new Schema<IUrl>({
    url: {
        type: String,
        required: true
    },
    shortCode: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    accessCount: {
        type: Number,
        required: true,
        default: 0
    }
},
    { timestamps: true }
)

export default mongoose.model<IUrl>('Url', urlSchema);