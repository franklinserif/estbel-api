import { Injectable } from '@nestjs/common';
import PdfPrinter from 'pdfmake';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { fonts } from '@reports/documents/styles/fonts';

@Injectable()
export class PrinterService {
  private readonly pdfmake = new PdfPrinter(fonts);

  /**
   * Creates a PDF document using the provided document definition.
   * @param {TDocumentDefinitions} docDefinition - The definition of the document to be created.
   * @returns {PDFKit.PDFDocument} - The generated PDF document.
   */
  createPDF(docDefinition: TDocumentDefinitions): PDFKit.PDFDocument {
    return this.pdfmake.createPdfKitDocument(docDefinition);
  }
}
