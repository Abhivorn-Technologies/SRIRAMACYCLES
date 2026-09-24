import mongoose, { Schema, Document, Model } from 'mongoose';
import { IEnquiry } from '@/types';

export interface IEnquiryDocument extends Omit<IEnquiry, '_id'>, Document {}

const EnquirySchema = new Schema<IEnquiryDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, default: '', trim: true },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ['unread', 'read', 'replied'],
      default: 'unread',
    },
  },
  {
    timestamps: true,
  }
);

const Enquiry: Model<IEnquiryDocument> =
  mongoose.models.Enquiry || mongoose.model<IEnquiryDocument>('Enquiry', EnquirySchema);

export default Enquiry;
