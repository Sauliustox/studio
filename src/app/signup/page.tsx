import AuthLayout from '@/components/auth/auth-layout';
import SignupForm from '@/components/auth/signup-form';
import { useTranslation } from 'react-i18next';

export default function SignupPage() {
  const { t } = useTranslation();
  return (
    <AuthLayout
      title={t('auth.signup.title')}
      description={t('auth.signup.description')}
    >
      <SignupForm />
    </AuthLayout>
  );
}
