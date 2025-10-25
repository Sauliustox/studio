'use client';
import React, { useMemo } from 'react';
import { FirebaseProvider } from './provider';
import { initializeFirebase } from '.';

export const FirebaseClientProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { auth, firestore } = useMemo(() => initializeFirebase(), []);

  return (
    <FirebaseProvider auth={auth} firestore={firestore}>
      {children}
    </FirebaseProvider>
  );
};
