import { Html } from '@react-email/components';

interface Props {
  firstName: string;
  email: string;
  password: string;
  resetPasswordLink: string;
}

/**
 * Email template component for sending a new password notification.
 * @component
 * @param {Props} props - The component props.
 * @param {string} props.firstName - The first name of the recipient.
 * @param {string} props.email - The email address of the recipient.
 * @param {string} props.password - The newly generated temporary password.
 * @param {string} props.resetPasswordLink - The link to reset the password.
 * @returns {JSX.Element} The email template.
 */
export const NewPassword = (props: Props) => {
  const { firstName, resetPasswordLink, password } = props;
  return (
    <Html style={{ display: 'flex', justifyContent: 'center' }}>
      <h1>🔐 Tu contraseña ha sido cambiada</h1>
      <h4 style={{ fontSize: '16px' }}>Hola {firstName},</h4>
      <p style={{ fontSize: '16px' }}>
        Has solicitado una nueva contraseña para tu cuenta en Estbel.
      </p>
      <p style={{ fontSize: '16px' }}>Tu nueva contraseña es:</p>
      <p style={{ fontSize: '16px' }}>🔑 {password}</p>
      <p style={{ fontSize: '16px' }}>
        <a href={resetPasswordLink} target="_blank" rel="noreferrer">
          Link para acceder a la plataforma
        </a>
      </p>
      <p style={{ fontSize: '12px' }}>
        Si no solicitaste este cambio, por favor, ignora este mensaje o contacta
        con nuestro equipo de soporte.
      </p>
      <p style={{ fontSize: '16px' }}>Estbel team</p>
    </Html>
  );
};
