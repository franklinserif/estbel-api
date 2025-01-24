import type {
  StyleDictionary,
  TDocumentDefinitions,
  TableCell,
} from 'pdfmake/interfaces';
import { Admin } from '@admins/entities/admin.entity';
import { fillColorTable } from './styles/fillColorTable';
import { docHeader } from './styles/header';
import { Member } from '@members/entities/member.entity';

const COLUMN_CONFIG: Record<
  string,
  {
    header: string;
    accessor: (admin: Member, index: number) => string | number;
  }
> = {
  'N°': {
    header: 'N°',
    accessor: (_, index: number) => index + 1,
  },
  'First Name': {
    header: 'Nombre',
    accessor: (admin) => admin.firstName,
  },
  'Last Name': {
    header: 'Apellido',
    accessor: (admin) => admin.lastName,
  },
  Gender: {
    header: 'Sexo',
    accessor: (admin) => admin.gender,
  },
  Phone: {
    header: 'Teléfono',
    accessor: (admin) => admin.phone || '---',
  },
  Country: {
    header: 'Páis',
    accessor: (admin) => admin.country || '---',
  },
  City: {
    header: 'Ciudad',
    accessor: (admin) => admin.city || '---',
  },
  Sector: {
    header: 'Municipio',
    accessor: (admin) => admin.location || '---',
  },
  Zone: {
    header: 'Estado',
    accessor: (admin) => admin.zone || '---',
  },
  Address: {
    header: 'Dirección',
    accessor: (admin) => admin.address || '---',
  },
  'Baptism Church': {
    header: 'Iglesia',
    accessor: (admin) => admin.baptizedChurch || '---',
  },
  'Civil Status': {
    header: 'Estado Civil',
    accessor: (admin) => admin.civilStatus || '---',
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
 * Generates a PDF document definition for the list of admins.
 *
 * @param {Admin[]} admins - List of admins to include in the PDF.
 * @returns {TDocumentDefinitions} The PDF document definition.
 */
export const adminsDoc = (
  admins: Admin[],
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

  // Generar cuerpo de la tabla
  const tableBody = admins.map((admin, index) =>
    filteredColumns.map((col) => ({
      text: col.accessor(admin.member, index)?.toString() || '---',
      alignment: 'center',
    })),
  );

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
          body: [tableHead, ...tableBody],
        },
      },
    ],

    styles: styles,
  };
};
