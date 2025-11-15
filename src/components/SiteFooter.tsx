import Container from './Container';
import type { Lang } from '@/lib/lang';

export default function SiteFooter({ lang }: { lang: Lang }) {
  const isEn = lang === 'en';

  return (
    <footer className="border-t bg-white py-4 text-xs text-gray-500">
      <Container className="flex flex-col items-center justify-between gap-2 sm:flex-row">
        <p>
          © {new Date().getFullYear()} IsMyWebOk.{' '}
          {isEn ? 'All rights reserved.' : 'Wszelkie prawa zastrzeżone.'}
        </p>
        <p className="text-[11px]">
          {isEn
            ? 'Uses Google PageSpeed Insights API for performance metrics.'
            : 'Korzysta z Google PageSpeed Insights API do pomiaru wydajności.'}
        </p>
      </Container>
    </footer>
  );
}
