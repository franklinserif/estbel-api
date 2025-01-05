import type { TDocumentDefinitions } from 'pdfmake/interfaces';

export const testReport = (): TDocumentDefinitions => {
  return {
    header: {
      text: 'Bill report',
      alignment: 'right',
      margin: [10, 10],
    },
    content: ['Hola mundo', 'Franklin Rodriguez'],
  };
};
