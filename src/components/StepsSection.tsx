import Container from './Container';
import Section from './Section';
import type { Lang } from '@/lib/lang';

export default function StepsSection({ lang }: { lang: Lang }) {
  const isEn = lang === 'en';

  const title = isEn ? 'How IsMyWebOk works' : 'Jak działa IsMyWebOk';

  const subtitle = isEn
    ? 'Designed to be simple enough for business owners and precise enough for developers.'
    : 'Stworzone tak, aby było proste dla właścicieli firm i wystarczająco precyzyjne dla developerów.';

  const steps = isEn
    ? [
        {
          title: '1. Enter your website',
          text: 'Paste your URL and run a free check. No login, no credit card.',
        },
        {
          title: '2. We audit with PageSpeed',
          text: 'We call Google PageSpeed Insights to fetch real performance metrics for your site.',
        },
        {
          title: '3. Get a clear health report',
          text: 'See your overall score, key metrics, and a short list of the top issues to fix.',
        },
      ]
    : [
        {
          title: '1. Podaj adres swojej strony',
          text: 'Wklej adres URL i uruchom darmowy test. Bez logowania i bez karty.',
        },
        {
          title: '2. Audyt z PageSpeed',
          text: 'Wywołujemy Google PageSpeed Insights i pobieramy realne metryki wydajności.',
        },
        {
          title: '3. Otrzymaj prosty raport',
          text: 'Zobacz ogólny wynik, kluczowe metryki i krótką listę najważniejszych problemów.',
        },
      ];

  return (
    <Section id="how-it-works" className="py-14">
      <Container>
        <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
        <p className="mt-2 text-sm text-gray-600">{subtitle}</p>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.title}
              className="rounded-2xl border bg-white p-5 text-sm shadow-sm"
            >
              <h3 className="text-base font-semibold text-gray-900">
                {step.title}
              </h3>
              <p className="mt-2 text-gray-600">{step.text}</p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
