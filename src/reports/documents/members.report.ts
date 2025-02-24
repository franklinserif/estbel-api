import type {
  StyleDictionary,
  TableCell,
  TDocumentDefinitions,
} from 'pdfmake/interfaces';
import { getFormatterDate } from '@shared/libs/date';
import { Member } from '@members/entities/member.entity';
import { fillColorTable } from '@reports/documents/styles/fillColorTable';
import { docHeader } from '@reports/documents/styles/header';

const COLUMN_CONFIG: Record<
  string,
  {
    header: string;
    accessor: (member: any, index: number) => string | number;
  }
> = {
  'N°': {
    header: 'N°',
    accessor: (_, index: number) => index + 1,
  },
  'First Name': {
    header: 'Nombre',
    accessor: (member) => member.firstName,
  },
  'Last Name': {
    header: 'Apellido',
    accessor: (member) => member.lastName,
  },
  Gender: {
    header: 'Sexo',
    accessor: (member) => member.gender,
  },
  Phone: {
    header: 'Teléfono',
    accessor: (member) => member.phone || '---',
  },
  Country: {
    header: 'Páis',
    accessor: (member) => member.country || '---',
  },
  City: {
    header: 'Ciudad',
    accessor: (member) => member.city || '---',
  },
  Sector: {
    header: 'Municipio',
    accessor: (member) => member.location || '---',
  },
  Zone: {
    header: 'Estado',
    accessor: (member) => member.zone || '---',
  },
  Address: {
    header: 'Dirección',
    accessor: (member) => member.address || '---',
  },
  'Baptism Date': {
    header: 'Fec. Bautismo',
    accessor: (member) => getFormatterDate(member.baptizedAt) || '---',
  },
  'Baptism Church': {
    header: 'Iglesia',
    accessor: (member) => member.baptizedChurch || '---',
  },
  'Civil Status': {
    header: 'Estado Civil',
    accessor: (member) => member.civilStatus || '---',
  },
};

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
 * Generates a PDF document definition for the list of members.
 *
 * @param {Member[]} members - List of members to include in the PDF.
 * @returns {TDocumentDefinitions} The PDF document definition.
 */
export const membersDoc = (
  members: Member[],
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

  const tableBody = members.map((member, index) =>
    filteredColumns.map((col) => ({
      text: col.accessor(member, index)?.toString() || '---',
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
