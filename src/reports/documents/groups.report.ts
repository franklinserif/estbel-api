import type {
  StyleDictionary,
  TableCell,
  TDocumentDefinitions,
} from 'pdfmake/interfaces';
import { getFormatterDate } from '@common/libs/date';
import { Group } from '@groups/entities/group.entity';

/**
 * Predefined styles for the PDF document.
 *
 * @type {StyleDictionary}
 */
const styles: StyleDictionary = {
  header: { margin: [40, 20], fontSize: 14, alignment: 'right' },
  table: { margin: [10, 20] },
};

/**
 * Table headers for the PDF document.
 *
 * @type {TableCell[]}
 */
const tableHead: TableCell[] = [
  { text: 'N°', alignment: 'center' },
  { text: 'Description', alignment: 'center' },
  { text: 'Address', alignment: 'center' },
  { text: 'Group Type', alignment: 'center' },
  { text: 'Creation Date', alignment: 'center' },
  { text: 'Update Date', alignment: 'center' },
];

/**
 * Generates a PDF document definition for the list of groups.
 *
 * @param {Group[]} groups - List of groups to include in the PDF.
 * @returns {TDocumentDefinitions} The PDF document definition.
 */
export const groupsDoc = (groups: Group[]): TDocumentDefinitions => {
  return {
    pageOrientation: 'landscape',
    header: {
      text: getFormatterDate(),
      style: 'header',
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
          widths: [15, 100, '*', 120, 100, 100],
          body: [
            tableHead,
            ...groups.map((group, index) => [
              { text: index + 1, alignment: 'center' },
              { text: group.name, alignment: 'center' },
              { text: group.description },
              { text: group.groupType.name, alignment: 'center' },
              {
                text: getFormatterDate(group.createdAt),
                alignment: 'center',
              },
              {
                text: getFormatterDate(group.updatedAt),
                alignment: 'center',
              },
            ]),
          ],
        },
      },
    ],
    styles: styles,
  };
};
