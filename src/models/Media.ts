import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMediaDocument extends Document {
  filename: string;
  contentType: string;
  data: string; // Base64 encoded string
  size: number;
  createdAt: Date;
  updatedAt: Date;
}

const MediaSchema = new Schema<IMediaDocument>(
  {
    filename: {
      type: String,
      required: true,
      trim: true,
    },
    contentType: {
      type: String,
      required: true,
      default: 'image/jpeg',
    },
    data: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

MediaSchema.index({ createdAt: -1 });

const Media: Model<IMediaDocument> =
  mongoose.models.Media || mongoose.model<IMediaDocument>('Media', MediaSchema);

export default Media;

