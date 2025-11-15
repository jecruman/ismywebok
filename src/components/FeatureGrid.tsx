import Container from './Container';
import Section from './Section';
import type { Lang } from '@/lib/lang';

export default function FeatureGrid({ lang }: { lang: Lang }) {
  const isEn = lang === 'en';

  const title = isEn
    ? "See what's slowing your website down."
    : 'Zobacz, co spowalnia Twoją stronę.';

  const subtitle = isEn
    ? 'IsMyWebOk focuses on the essentials: speed, Core Web Vitals, and simple actions that improve user experience and visibility.'
    : 'IsMyWebOk skupia się na najważniejszych rzeczach: szybkości, Core Web Vitals oraz prostych działaniach poprawiających doświadczenie użytkownika i widoczność.';

  const features = isEn
    ? [
        {
          title: 'Real performance data',
          description:
            'We use Google PageSpeed Insights to get real Core Web Vitals and performance metrics.',
        },
        {
          title: 'Understandable reports',
          description:
            'No SEO jargon. Just a clear score and a short list of the most important things to fix.',
        },
        {
          title: 'Perfect for small businesses',
          description:
            'Ideal for agencies, freelancers, and local businesses that need a simple health check.',
        },
      ]
    : [
        {
          title: 'Prawdziwe dane o wydajności',
          description:
            'Korzystamy z Google PageSpeed Insights, aby uzyskać realne Core Web Vitals i metryki wydajności.',
        },
        {
          title: 'Zrozumiały raport',
          description:
            'Bez żargonu SEO. Tylko prosty wynik i krótka lista najważniejszych rzeczy do poprawy.',
        },
        {
          title: 'Dla małych firm',
          description:
            'Idealne dla agencji, freelancerów i lokalnych biznesów, które chcą prostego przeglądu kondycji strony.',
        },
      ];

  return (
    <Section id="features" className="bg-gray-50 py-14">
      <Container>
        <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
        <p className="mt-2 text-sm text-gray-600">{subtitle}</p>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border bg-white p-5 text-sm shadow-sm"
            >
              <h3 className="text-base font-semibold text-gray-900">
                {f.title}
              </h3>
              <p className="mt-2 text-gray-600">{f.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
