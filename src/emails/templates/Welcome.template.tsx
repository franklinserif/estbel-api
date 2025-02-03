import { Html, Button } from '@react-email/components';

/**
 * WelcomeEmail component renders a welcome email template.
 * @param {Object} props - The component props.
 * @param {string} props.username - The username of the recipient.
 * @returns {JSX.Element} The rendered email template.
 */
export const WelcomeEmail = ({ username }: { username: string }) => {
  return (
    <Html>
      <h1>Welcome, {username}!</h1>
      <p>Thanks for joining our service!</p>
      <Button href="https://example.com/login" style={{ color: '#61dafb' }}>
        Get Started
      </Button>
    </Html>
  );
};
