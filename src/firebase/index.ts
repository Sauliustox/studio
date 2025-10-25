import { getApps, initializeApp } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore';
import { firebaseAppConfig } from './config';

export function initializeFirebase(): {
  firestore: Firestore;
  auth: Auth;
} {
  const apps = getApps();
  const app = apps.length > 0 ? apps[0] : initializeApp(firebaseAppConfig);
  const auth = getAuth(app);
  const firestore = getFirestore(app);
  return { auth, firestore };
}

export { useUser } from './auth/use-user';
export { FirebaseProvider, useAuth, useFirestore, useFirebaseApp } from './provider';
export { FirebaseClientProvider } from './client-provider';
