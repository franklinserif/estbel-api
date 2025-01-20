import type { StyleDictionary, TDocumentDefinitions } from 'pdfmake/interfaces';
import { getFormatterDate } from '@common/libs/date';
import { Member } from '@members/entities/member.entity';

const styles: StyleDictionary = {
  header: { margin: [40, 20], fontSize: 14, alignment: 'right' },
  table: { margin: [0, 10, 0, 0], alignment: 'center' },
};

const tableHead = [
  { text: 'N°' },
  { text: 'Nombre' },
  { text: 'Apellido' },
  { text: 'Fec. nacimiento' },
  { text: 'Sexo' },
  { text: 'Teléfono' },
  { text: 'Páis' },
  { text: 'Ciudad' },
  { text: 'Sector' },
  { text: 'Parroquia' },
  { text: 'Dirección' },
  { text: 'Fec. Bautizo' },
  { text: 'Baut. Iglesia' },
  { text: 'Est. Civil' },
  { text: 'Fec. Boda' },
];

export const membersReport = (members: Member[]): TDocumentDefinitions => {
  return {
    pageOrientation: 'landscape',
    pageSize: 'LEGAL',
    pageMargins: [20, 50, 20, 20],
    header: (currentPage, pageCount) => {
      return {
        style: 'header',
        columns: [
          {
            text: `Página ${currentPage} de ${pageCount}`,
            alignment: 'left',
          },
          {
            text: getFormatterDate(),
            alignment: 'right',
          },
        ],
      };
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
          dontBreakRows: true,
          headerRows: 1,
          body: [
            tableHead,
            ...members.map((member, index) => [
              { text: `${index}`, alignment: 'center' },
              { text: member.firstName, alignment: 'center' },
              { text: member.lastName, alignment: 'center' },
              { text: member.birthdate, alignment: 'center' },
              { text: member.gender, alignment: 'center' },
              { text: member.phone || '---', alignment: 'center' },
              { text: member.country || '---', alignment: 'center' },
              { text: member.city || '---', alignment: 'center' },
              { text: member.location || '---', alignment: 'center' },
              { text: member.zone || '---', alignment: 'center' },
              { text: member.address || '---', alignment: 'center' },
              { text: member.baptizedAt || '---', alignment: 'center' },
              { text: member.baptizedChurch || '---', alignment: 'center' },
              { text: member.civilStatus || '---', alignment: 'center' },
              { text: member.weddingAt || '---', alignment: 'center' },
            ]),
          ],
        },
      },
    ],
    styles: styles,
  };
};
