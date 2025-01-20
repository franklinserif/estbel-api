import type { StyleDictionary, TDocumentDefinitions } from 'pdfmake/interfaces';
import { getFormatterDate } from '@common/libs/date';
import { Group } from '@groups/entities/group.entity';

const styles: StyleDictionary = {
  header: { margin: [40, 20], fontSize: 14, alignment: 'right' },
  table: { margin: [10, 20] },
};

const tableHead = [
  { text: 'N°', alignment: 'center' },
  { text: 'Descripción', alignment: 'center' },
  { text: 'Dirección', alignment: 'center' },
  { text: 'Tipo de grupo', alignment: 'center' },
  { text: 'Fec. Creación', alignment: 'center' },
  { text: 'Fec. Actualización', alignment: 'center' },
];

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
              { text: getFormatterDate(group.updatedAt), alignment: 'center' },
            ]),
          ],
        },
      },
    ],
    styles: styles,
  };
};
