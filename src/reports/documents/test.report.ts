import type { StyleDictionary, TDocumentDefinitions } from 'pdfmake/interfaces';
import { getFormatterDate } from '@common/libs/date';

const styles: StyleDictionary = {
  header: { margin: [40, 20], fontSize: 14, alignment: 'right' },
  table: { margin: [10, 20] },
};

export const testReport = (): TDocumentDefinitions => {
  return {
    header: {
      text: getFormatterDate(),

      style: 'header',
    },
    content: [
      {
        canvas: [
          {
            type: 'line',
            x1: 2,
            y1: 5,
            x2: 520,
            y2: 5,
            lineWidth: 1,
          },
        ],
      },

      {
        style: 'table',
        layout: {
          fillColor: function (rowIndex) {
            return rowIndex % 2 === 0 && rowIndex !== 0 ? '#ebebeb' : null;
          },
        },
        table: {
          body: [
            ['Column 1', 'Column 2', 'Column 3', 'Column 4'],
            ['One value goes here', 'Another one here', 'OK?', 'Test'],
            ['One value goes here', 'Another one here', 'OK?', 'Test'],
            ['One value goes here', 'Another one here', 'OK?', 'Test'],
            ['One value goes here', 'Another one here', 'OK?', 'Test'],
            ['One value goes here', 'Another one here', 'OK?', 'Test'],
          ],
        },
      },
    ],
    styles: styles,
  };
};
