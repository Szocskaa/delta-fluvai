import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { STRINGS, type Lang, type Strings } from './strings'

type LangContextValue = {
  lang: Lang
  setLang: (lang: Lang) => void
  s: Strings
}

const LangContext = createContext<LangContextValue | null>(null)

function detectLang(): Lang {
  const saved = localStorage.getItem('lang')
  if (saved === 'en' || saved === 'hu') return saved
  return navigator.language?.toLowerCase().startsWith('hu') ? 'hu' : 'en'
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(detectLang)

  useEffect(() => {
    localStorage.setItem('lang', lang)
    document.documentElement.lang = lang
    document.title = STRINGS[lang].meta.title
  }, [lang])

  return (
    <LangContext.Provider value={{ lang, setLang, s: STRINGS[lang] }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang(): LangContextValue {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error('useLang must be used inside LanguageProvider')
  return ctx
}

/** Convenience hook returning the active string table. */
export function useStrings(): Strings {
  return useLang().s
}
