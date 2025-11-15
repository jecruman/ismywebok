import Container from './Container';

export default function SiteHeader() {
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
        <nav className="hidden items-center gap-6 text-xs text-gray-600 sm:flex">
          <a href="#features" className="hover:text-gray-900">
            Features
          </a>
          <a href="#how-it-works" className="hover:text-gray-900">
            How it works
          </a>
          <a href="#faq" className="hover:text-gray-900">
            FAQ
          </a>
        </nav>
      </Container>
    </header>
  );
}
