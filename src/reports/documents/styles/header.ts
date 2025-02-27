import { getFormatterDate } from '@shared/libs/date';
import { Content } from 'pdfmake/interfaces';

/**
 * Generates a header for a PDF document.
 * The header includes the current page number, total page count, and the current date.
 *
 * @param {number} currentPage - The current page number.
 * @param {number} pageCount - The total number of pages in the document.
 * @returns {Content} - A PDFMake `Content` object representing the header.
 */
export function docHeader(currentPage: number, pageCount: number): Content {
  return {
    style: 'header', // Apply the 'header' style
    columns: [
      {
        text: `Page ${currentPage} of ${pageCount}`, // Display current page and total pages
        alignment: 'left', // Left-align the page number text
      },
      {
        text: getFormatterDate(), // Display the current date (formatted)
        alignment: 'right', // Right-align the date text
      },
    ],
  };
}
