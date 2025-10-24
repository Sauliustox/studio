'use client'

import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import resourcesToBackend from 'i18next-resources-to-backend'
import { fallbackLng, defaultNS } from './settings'

i18n
  .use(initReactI18next)
  .use(resourcesToBackend((language: string, namespace: string) => import(`../../../public/locales/${language}/${namespace}.json`)))
  .init({
    lng: fallbackLng,
    fallbackLng,
    defaultNS,
    ns: [defaultNS],
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  })

export default i18n
