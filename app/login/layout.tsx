import { Metadata } from 'next';
import '../globals.css';

export const metadata: Metadata = {
  title: 'Login - FiftyFifty ToolKit',
  description: 'Enter your access code to access the FiftyFifty ToolKit',
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

