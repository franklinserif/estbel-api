import type { StyleDictionary, TDocumentDefinitions } from 'pdfmake/interfaces';
import { getFormatterDate } from '@common/libs/date';
import { fillColorTable } from './styles/fillColorTable';

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
 * Generates a test report PDF document definition.
 *
 * @returns {TDocumentDefinitions} The PDF document definition.
 */
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
          fillColor: fillColorTable,
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
