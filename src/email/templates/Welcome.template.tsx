import { Html, Button } from '@react-email/components';

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
