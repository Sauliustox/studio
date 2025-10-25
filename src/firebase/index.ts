import { getApps, initializeApp, FirebaseApp } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore';
import { firebaseAppConfig } from './config';

type FirebaseServices = {
  app: FirebaseApp | null;
  auth: Auth | null;
  firestore: Firestore | null;
};

export function initializeFirebase(): FirebaseServices {
  if (!firebaseAppConfig) {
    return { app: null, auth: null, firestore: null };
  }

  const apps = getApps();
  const app = apps.length > 0 ? apps[0] : initializeApp(firebaseAppConfig);
  const auth = getAuth(app);
  const firestore = getFirestore(app);
  return { app, auth, firestore };
}

export { useUser } from './auth/use-user';
export { FirebaseProvider, useAuth, useFirestore, useFirebaseApp } from './provider';
export { FirebaseClientProvider } from './client-provider';
