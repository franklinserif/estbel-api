import { type FC } from 'react';
import { Html, Button } from '@react-email/components';

interface Props {
  firstName: string;
  email: string;
  password: string;
  resetPasswordLink: string;
}

/**
 * Email template component for sending a new password notification.
 *
 * @component
 * @param {Props} props - The component props.
 * @param {string} props.firstName - The first name of the recipient.
 * @param {string} props.email - The email address of the recipient.
 * @param {string} props.password - The newly generated temporary password.
 * @param {string} props.resetPasswordLink - The link to reset the password.
 * @returns {JSX.Element} The email template.
 */
export const NewPassword: FC<Props> = (props) => {
  const { firstName, resetPasswordLink, password } = props;
  return (
    <Html style={{ display: 'flex', justifyContent: 'center' }}>
      <h1>🔐 Tu nueva contraseña ha sido generada</h1>
      <h4 style={{ font: '24px' }}>Hola {firstName},</h4>
      <p style={{ font: '24px' }}>
        Has solicitado una nueva contraseña para tu cuenta en EstbelSoft.
      </p>
      <p style={{ font: '24px' }}>Tu nueva contraseña temporal es:</p>
      <p style={{ font: '24px' }}>🔑 {password}</p>
      <p style={{ font: '24px' }}>
        <a href={resetPasswordLink} target="_blank" rel="noreferrer">
          {resetPasswordLink}
        </a>
      </p>
      <p style={{ font: '24px' }}>
        Si no solicitaste este cambio, por favor, ignora este mensaje o contacta
        con nuestro equipo de soporte.
      </p>
      <p style={{ font: '24px' }}>Saludos</p>
      <Button href="https://example.com/login" style={{ color: '#61dafb' }}>
        Get Started
      </Button>
    </Html>
  );
};
