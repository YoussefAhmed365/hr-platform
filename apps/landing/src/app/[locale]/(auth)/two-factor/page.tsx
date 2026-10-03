'use client';

import { useParams } from 'next/navigation';
import { AuthLanguageProvider } from '../../../../../components/auth/auth-language-context';
import { TwoFactorForm } from '../../../../../components/auth/two-factor/two-factor-form';

export default function TwoFactorPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';

  return (
    <AuthLanguageProvider initialLocale={locale}>
      <TwoFactorForm />
    </AuthLanguageProvider>
  );
}
