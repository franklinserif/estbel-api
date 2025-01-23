import type {
  StyleDictionary,
  TableCell,
  TDocumentDefinitions,
} from 'pdfmake/interfaces';
import { getFormatterDate } from '@common/libs/date';
import { fillColorTable } from './styles/fillColorTable';
import { docHeader } from './styles/header';
import { Group } from '@groups/entities/group.entity';

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
  { text: 'N°' },
  { text: 'Name' },
  { text: 'Last Name' },
  { text: 'Gender' },
  { text: 'Phone' },
  { text: 'Country' },
  { text: 'City' },
  { text: 'Sector' },
  { text: 'Zone' },
  { text: 'Address' },
  { text: 'Baptism Date' },
  { text: 'Baptism Church' },
  { text: 'Civil Status' },
  { text: 'Nombre del Grupo' },
];

/**
 * Generates a PDF document definition for the group list of members.
 *
 * @param {Group} group - the group member list to include in the PDF.
 * @returns {TDocumentDefinitions} The PDF document definition.
 */
export const groupMembersDoc = (group: Group): TDocumentDefinitions => {
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
          body: [
            tableHead,
            ...group.members.map((member, index) => [
              { text: `${index + 1}`, alignment: 'center' },
              { text: member.firstName, alignment: 'center' },
              { text: member.lastName, alignment: 'center' },
              { text: member.gender, alignment: 'center' },
              { text: member.phone || '---', alignment: 'center' },
              { text: member.country || '---', alignment: 'center' },
              { text: member.city || '---', alignment: 'center' },
              { text: member.location || '---', alignment: 'center' },
              { text: member.zone || '---', alignment: 'center' },
              { text: member.address || '---', alignment: 'center' },
              {
                text: getFormatterDate(member.baptizedAt) || '---',
                alignment: 'center',
              },
              {
                text: member.baptizedChurch || '---',
                alignment: 'center',
              },
              { text: member.civilStatus || '---', alignment: 'center' },

              { text: group.name || '---', alignment: 'center' },
            ]),
          ],
        },
      },
    ],
    styles: styles,
  };
};
