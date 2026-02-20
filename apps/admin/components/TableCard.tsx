import { PropsWithChildren } from "react";

type Props = PropsWithChildren<{
  title: string;
  subtitle?: string;
}>;

export function TableCard({ title, subtitle, children }: Props) {
  return (
    <section className="table-card">
      <header className="table-card__header">
        <h2>{title}</h2>
        {subtitle ? <p>{subtitle}</p> : null}
      </header>
      <div className="table-card__body">{children}</div>
    </section>
  );
}
