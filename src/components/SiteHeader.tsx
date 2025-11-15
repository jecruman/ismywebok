'use client';

import Container from './Container';
import type { Lang } from '@/lib/lang';

interface Props {
  lang: Lang;
  onChangeLang: (lang: Lang) => void;
}

export default function SiteHeader({ lang, onChangeLang }: Props) {
  const isEn = lang === 'en';

  const nav = {
    features: isEn ? 'Features' : 'Funkcje',
    how: isEn ? 'How it works' : 'Jak to działa',
    faq: 'FAQ',
    history: isEn ? 'History' : 'Historia',
  };

  return (
    <header className="border-b bg-white/70 backdrop-blur">
      <Container className="flex items-center justify-between py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-green text-xs font-bold text-white">
            OK
          </div>
          <span className="text-sm font-semibold tracking-tight">
            IsMyWebOk
          </span>
        </div>
        <div className="flex items-center gap-4">
          <nav className="hidden items-center gap-6 text-xs text-gray-600 sm:flex">
            <a href="#features" className="hover:text-gray-900">
              {nav.features}
            </a>
            <a href="#how-it-works" className="hover:text-gray-900">
              {nav.how}
            </a>
            <a href="#faq" className="hover:text-gray-900">
              {nav.faq}
            </a>
            <a href="/history" className="hover:text-gray-900">
              {nav.history}
            </a>
          </nav>
          <div className="flex items-center rounded-full border bg-white text-[11px]">
            <button
              type="button"
              onClick={() => onChangeLang('en')}
              className={`px-2 py-1 ${
                isEn ? 'bg-brand-green text-white rounded-full' : 'text-gray-600'
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => onChangeLang('pl')}
              className={`px-2 py-1 ${
                !isEn ? 'bg-brand-green text-white rounded-full' : 'text-gray-600'
              }`}
            >
              PL
            </button>
          </div>
        </div>
      </Container>
    </header>
  );
}
