import { ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  meta?: ReactNode;
  action?: ReactNode;
};

export default function PageHeader({ title, meta, action }: PageHeaderProps) {
  return (
    <header className="page-header">
      <div>
        <h1>{title}</h1>
        {meta && <p className="page-header__meta">{meta}</p>}
      </div>
      {action}
    </header>
  );
}
