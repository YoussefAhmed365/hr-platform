'use client';

import { useParams } from 'next/navigation';
import { AuthLanguageProvider } from '../../../../../components/auth/auth-language-context';
import { LoginForm } from '../../../../../components/auth/login/login-form';

export default function LoginPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';

  return (
    <AuthLanguageProvider initialLocale={locale}>
      <LoginForm />
    </AuthLanguageProvider>
  );
}
