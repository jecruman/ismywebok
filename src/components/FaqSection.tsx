import Container from './Container';
import Section from './Section';

const faqs = [
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
];

export default function FaqSection() {
  return (
    <Section id="faq" className="bg-gray-50 py-14">
      <Container>
        <h2 className="text-2xl font-semibold tracking-tight">FAQ</h2>
        <p className="mt-2 text-sm text-gray-600">
          A few quick answers. You can always extend this later based on real
          user questions.
        </p>

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
