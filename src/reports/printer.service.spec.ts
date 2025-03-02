import { Test, TestingModule } from '@nestjs/testing';
import { PrinterService } from './printer.service';
import { TDocumentDefinitions } from 'pdfmake/interfaces';

describe('PrinterService', () => {
  let service: PrinterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrinterService],
    }).compile();

    service = module.get<PrinterService>(PrinterService);
  });

  it('debería estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('createPDF', () => {
    it('debería llamar a createPdfKitDocument de pdfmake con la definición del documento y retornar el PDF generado', () => {
      const docDefinition: TDocumentDefinitions = { content: 'Hola mundo' };
      const fakePdfDocument = {} as PDFKit.PDFDocument;

      // Espiamos el método createPdfKitDocument de la instancia interna de pdfmake
      const createPdfKitDocumentSpy = jest
        .spyOn((service as any).pdfmake, 'createPdfKitDocument')
        .mockReturnValue(fakePdfDocument);

      const result = service.createPDF(docDefinition);

      expect(createPdfKitDocumentSpy).toHaveBeenCalledWith(docDefinition);
      expect(result).toBe(fakePdfDocument);
    });
  });
});
