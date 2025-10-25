'use client';
import { Auth } from 'firebase/auth';
import { Firestore } from 'firebase/firestore';
import { FirebaseApp } from 'firebase/app';

import React, { createContext, useContext, ReactNode } from 'react';

type FirebaseContextValue = {
  auth: Auth;
  firestore: Firestore;
  firebaseApp: FirebaseApp;
};

const FirebaseContext = createContext<FirebaseContextValue | undefined>(
  undefined,
);

type FirebaseProviderProps = {
  children: ReactNode;
  auth: Auth;
  firestore: Firestore;
};

export const FirebaseProvider = ({
  children,
  auth,
  firestore,
}: FirebaseProviderProps) => {
  const firebaseApp = auth.app;
  return (
    <FirebaseContext.Provider value={{ auth, firestore, firebaseApp }}>
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};

export const useAuth = () => {
  const { auth } = useFirebase();
  return auth;
};

export const useFirestore = () => {
  const { firestore } = useFirebase();
  return firestore;
};

export const useFirebaseApp = () => {
  const { firebaseApp } = useFirebase();
  return firebaseApp;
};
