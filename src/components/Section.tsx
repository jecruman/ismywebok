import { clsx } from 'clsx';

export default function Section({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <section className={clsx('w-full', className)}>{children}</section>;
}
