import mongoose, { Schema } from "mongoose";

const PDFSchema = new Schema(
  {
    pdfUrl: {
      type: String,
      required: true
    },
    pdfPublicId: {
      type: String,
      required: true
    },
    pdfName: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

export const PDF = mongoose.model("PDF", PDFSchema);
