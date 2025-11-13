import { clsx } from 'clsx';

export default function Container({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={clsx('mx-auto max-w-5xl px-4', className)}>
      {children}
    </div>
  );
}
