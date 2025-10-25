'use client';
import AuthLayout from '@/components/auth/auth-layout';
import SignupForm from '@/components/auth/signup-form';
import { useTranslation } from '@/app/i18n/client';
import { fallbackLng } from '../i18n/settings';

export default function SignupPage() {
  const lng = fallbackLng;
  const { t } = useTranslation(lng, 'common');
  return (
    <AuthLayout
      title={t('auth.signup.title')}
      description={t('auth.signup.description')}
    >
      <SignupForm />
    </AuthLayout>
  );
}
