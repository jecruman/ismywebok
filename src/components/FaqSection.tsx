import Container from './Container';
import Section from './Section';
import type { Lang } from '@/lib/lang';

export default function FaqSection({ lang }: { lang: Lang }) {
  const isEn = lang === 'en';

  const title = 'FAQ';

  const subtitle = isEn
    ? 'A few quick answers. You can always extend this later based on real user questions.'
    : 'Kilka szybkich odpowiedzi. Później możesz dodać więcej na podstawie pytań użytkowników.';

  const faqs = isEn
    ? [
        {
          q: 'Is this using real Google data?',
          a: 'Yes. We call the official Google PageSpeed Insights API under the hood to fetch performance metrics for your URL.',
        },
        {
          q: 'Do you store my URL or results?',
          a: 'For the MVP we only keep results temporarily in memory to show you the report. In the future, you can choose to save history.',
        },
        {
          q: 'Is it safe to use on client websites?',
          a: 'Yes. PageSpeed is a read-only performance test that does not modify anything on the website.',
        },
      ]
    : [
        {
          q: 'Czy to korzysta z prawdziwych danych Google?',
          a: 'Tak. Pod spodem wywołujemy oficjalne API Google PageSpeed Insights, aby pobrać metryki wydajności dla Twojego adresu.',
        },
        {
          q: 'Czy zapisujecie mój adres URL i wyniki?',
          a: 'W wersji MVP wyniki przechowujemy tylko tymczasowo, żeby pokazać raport. W przyszłości będzie można zapisywać historię.',
        },
        {
          q: 'Czy to bezpieczne dla stron klientów?',
          a: 'Tak. PageSpeed to test tylko do odczytu – nic nie zmienia na stronie.',
        },
      ];

  return (
    <Section id="faq" className="bg-gray-50 py-14">
      <Container>
        <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
        <p className="mt-2 text-sm text-gray-600">{subtitle}</p>

        <div className="mt-6 space-y-4 text-sm">
          {faqs.map((item) => (
            <div
              key={item.q}
              className="rounded-2xl border bg-white p-4 shadow-sm"
            >
              <p className="font-semibold text-gray-900">{item.q}</p>
              <p className="mt-1 text-gray-600">{item.a}</p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
