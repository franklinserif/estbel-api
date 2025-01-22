import type {
  StyleDictionary,
  TableCell,
  TDocumentDefinitions,
} from 'pdfmake/interfaces';
import { getFormatterDate } from '@common/libs/date';
import { Member } from '@members/entities/member.entity';
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
  { text: 'N°' },
  { text: 'Name' },
  { text: 'Last Name' },
  { text: 'Birthdate' },
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
  { text: 'Wedding Date' },
];

/**
 * Generates a PDF document definition for the list of members.
 *
 * @param {Member[]} members - List of members to include in the PDF.
 * @returns {TDocumentDefinitions} The PDF document definition.
 */
export const membersDoc = (members: Member[]): TDocumentDefinitions => {
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
            ...members.map((member, index) => [
              { text: `${index + 1}`, alignment: 'center' },
              { text: member.firstName, alignment: 'center' },
              { text: member.lastName, alignment: 'center' },
              {
                text: getFormatterDate(member.birthdate),
                alignment: 'center',
              },
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
              {
                text: member.civilStatus || '---',
                alignment: 'center',
              },
              {
                text: getFormatterDate(member.weddingAt) || '---',
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
