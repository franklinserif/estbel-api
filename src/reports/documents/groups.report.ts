import type {
  StyleDictionary,
  TableCell,
  TDocumentDefinitions,
} from 'pdfmake/interfaces';
import { getFormatterDate } from '@common/libs/date';
import { Group } from '@groups/entities/group.entity';
import { docHeader } from '@reports/documents/styles/header';
import { fillColorTable } from '@reports/documents/styles/fillColorTable';

const COLUMN_CONFIG: Record<
  string,
  {
    header: string;
    accessor: (group: Group, index: number) => string | number;
  }
> = {
  n: {
    header: 'N°',
    accessor: (_, index: number) => index + 1,
  },
  name: {
    header: 'Nombre',
    accessor: (group) => group.name,
  },
  description: {
    header: 'Descripción',
    accessor: (group) => group.description,
  },
  'created at': {
    header: 'Fec. Creación',
    accessor: (group) => getFormatterDate(group.createdAt) || '---',
  },
};

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
 * Generates a PDF document definition for the list of groups.
 *
 * @param {Group[]} groups - List of groups to include in the PDF.
 * @returns {TDocumentDefinitions} The PDF document definition.
 */
export const groupsDoc = (
  groups: Group[],
  rows: string[] = Object.keys(COLUMN_CONFIG),
): TDocumentDefinitions => {
  const filteredColumns = rows
    // eslint-disable-next-line security/detect-object-injection
    .filter((row) => COLUMN_CONFIG[row])
    // eslint-disable-next-line security/detect-object-injection
    .map((row) => COLUMN_CONFIG[row]);

  const tableHead: TableCell[] = filteredColumns.map((col) => ({
    text: col.header,
    style: 'tableHeader',
  }));

  const tableBody = groups.map((group, index) =>
    filteredColumns.map((col) => ({
      text: col.accessor(group, index)?.toString() || '---',
      alignment: 'center',
    })),
  );

  return {
    pageOrientation: 'landscape',
    pageSize: 'LEGAL',
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
          headerRows: 1,
          body: [tableHead, ...tableBody],
        },
      },
    ],
    styles: styles,
  };
};
