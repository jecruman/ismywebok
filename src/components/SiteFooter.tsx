import Container from './Container';

export default function SiteFooter() {
  return (
    <footer className="border-t bg-white py-4 text-xs text-gray-500">
      <Container className="flex flex-col items-center justify-between gap-2 sm:flex-row">
        <p>© {new Date().getFullYear()} IsMyWebOk. All rights reserved.</p>
        <p className="text-[11px]">
          Uses Google PageSpeed Insights API for performance metrics.
        </p>
      </Container>
    </footer>
  );
}
