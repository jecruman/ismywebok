import Container from './Container';
import Section from './Section';

const features = [
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
];

export default function FeatureGrid() {
  return (
    <Section id="features" className="bg-gray-50 py-14">
      <Container>
        <h2 className="text-2xl font-semibold tracking-tight">
          See what&apos;s slowing your website down.
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          IsMyWebOk focuses on the essentials: speed, Core Web Vitals, and
          simple actions that improve user experience and visibility.
        </p>

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
