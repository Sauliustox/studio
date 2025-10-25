'use client';
import AuthLayout from '@/components/auth/auth-layout';
import SignupForm from '@/components/auth/signup-form';
import { useTranslation } from '../i18n/client';

export default function SignupPage({ params: { lng } }: { params: { lng: string } }) {
  const { t } = useTranslation(lng, 'common');
  return (
    <AuthLayout
      title={t('auth.signup.title')}
      description={t('auth.signup.description')}
    >
      <SignupForm lng={lng} />
    </AuthLayout>
  );
}
