import { Injectable } from '@nestjs/common';
import PdfPrinter from 'pdfmake';
import { fonts } from './documents/styles/fonts';
import { TDocumentDefinitions } from 'pdfmake/interfaces';

@Injectable()
export class PrinterService {
  private readonly pdfmake = new PdfPrinter(fonts);

  createPDF(docDefinition: TDocumentDefinitions) {
    return this.pdfmake.createPdfKitDocument(docDefinition);
  }
}
