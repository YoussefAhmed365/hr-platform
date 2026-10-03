'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { AuthLanguageProvider } from '../../../../../components/auth/auth-language-context';
import { ResetPasswordForm } from '../../../../../components/auth/recovery/reset-password-form';

function ResetPasswordContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const locale = (params?.locale as string) || 'ar';
  const token = searchParams.get('token') || 'mock-token';

  return (
    <AuthLanguageProvider initialLocale={locale}>
      <ResetPasswordForm token={token} />
    </AuthLanguageProvider>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#faf8ff]">
        <div className="animate-spin w-6 h-6 border-2 border-[#006c49] border-t-transparent rounded-full" />
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}
