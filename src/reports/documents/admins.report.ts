import type {
  StyleDictionary,
  TDocumentDefinitions,
  TableCell,
} from 'pdfmake/interfaces';
import { Admin } from '@admins/entities/admin.entity';
import { fillColorTable } from './styles/fillColorTable';
import { docHeader } from './styles/header';

/**
 * Predefined styles for the PDF document.
 *
 * @type {StyleDictionary}
 */
const styles: StyleDictionary = {
  header: { margin: [40, 20], fontSize: 14, alignment: 'right' },
  table: { margin: [0, 10, 0, 0], alignment: 'center' },
};

/**
 * Table headers for the PDF document.
 *
 * @type {Array<TableCell>}
 */
const tableHead: TableCell[] = [
  { text: 'N°', margin: [5, 5] },
  { text: 'Name', margin: [5, 5] },
  { text: 'Last Name', margin: [5, 5] },
  { text: 'Email', margin: [5, 5] },
  { text: 'Phone', margin: [5, 5] },
];

/**
 * Generates a PDF document definition for the list of admins.
 *
 * @param {Admin[]} admins - List of admins to include in the PDF.
 * @returns {TDocumentDefinitions} The PDF document definition.
 */
export const adminsDoc = (admins: Admin[]): TDocumentDefinitions => {
  return {
    pageOrientation: 'landscape',
    pageSize: 'LETTER',
    pageMargins: [20, 50, 20, 20],
    header: docHeader,
    content: [
      {
        style: 'table',
        layout: {
          fillColor: fillColorTable,
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
