import { clsx } from "clsx";
import type { HTMLAttributes, ReactNode } from "react";

type SectionProps = {
  className?: string;
  children: ReactNode;
} & HTMLAttributes<HTMLElement>;

export default function Section({
  className,
  children,
  ...rest
}: SectionProps) {
  return (
    <section className={clsx("w-full", className)} {...rest}>
      {children}
    </section>
  );
}
