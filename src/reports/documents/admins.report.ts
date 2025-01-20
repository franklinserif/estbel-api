import type { StyleDictionary, TDocumentDefinitions } from 'pdfmake/interfaces';
import { getFormatterDate } from '@common/libs/date';
import { Admin } from '@admins/entities/admin.entity';

const styles: StyleDictionary = {
  header: { margin: [40, 20], fontSize: 14, alignment: 'right' },
  table: { margin: [0, 10, 0, 0], alignment: 'center' },
};

const tableHead = [
  { text: 'N°', margin: [5, 5] },
  { text: 'Nombre', margin: [5, 5] },
  { text: 'Apellido', margin: [5, 5] },
  { text: 'Email', margin: [5, 5] },
  { text: 'Teléfono', margin: [5, 5] },
];

export const adminsDoc = (admins: Admin[]): TDocumentDefinitions => {
  return {
    pageOrientation: 'landscape',
    pageSize: 'LETTER',
    pageMargins: [20, 50, 20, 20],
    header: (currentPage, pageCount) => {
      return {
        style: 'header',
        columns: [
          {
            text: `Página ${currentPage} de ${pageCount}`,
            alignment: 'left',
          },
          {
            text: getFormatterDate(),
            alignment: 'right',
          },
        ],
      };
    },
    content: [
      {
        style: 'table',
        layout: {
          fillColor: function (rowIndex) {
            return rowIndex % 2 === 0 && rowIndex !== 0 ? '#ebebeb' : null;
          },
        },
        table: {
          dontBreakRows: true,
          widths: [30, 'auto', 'auto', '*', 'auto'],
          headerRows: 1,
          body: [
            tableHead,
            ...admins.map((user, index) => [
              { text: index + 1, alignment: 'center', margin: [0, 5] },
            ]),
          ],
        },
      },
    ],
    styles: styles,
  };
};
