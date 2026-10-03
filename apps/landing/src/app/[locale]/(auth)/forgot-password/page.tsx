'use client';

import { useParams } from 'next/navigation';
import { AuthLanguageProvider } from '../../../../../components/auth/auth-language-context';
import { ForgotPasswordForm } from '../../../../../components/auth/recovery/forgot-password-form';

export default function ForgotPasswordPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';

  return (
    <AuthLanguageProvider initialLocale={locale}>
      <ForgotPasswordForm />
    </AuthLanguageProvider>
  );
}
