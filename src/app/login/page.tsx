'use client';
import AuthLayout from '@/components/auth/auth-layout';
import LoginForm from '@/components/auth/login-form';
import { useTranslation } from '../i18n/client';

export default function LoginPage({ params: { lng } }: { params: { lng: string } }) {
  const { t } = useTranslation(lng, 'common');
  return (
    <AuthLayout
      title={t('auth.login.title')}
      description={t('auth.login.description')}
    >
      <LoginForm lng={lng} />
    </AuthLayout>
  );
}
