import type { ReactNode } from "react";

const WIDTH = {
  stage: "mx-auto w-full max-w-stage px-4 md:px-8",
  sheet: "mx-auto w-full max-w-measure px-4 md:px-8",
} as const;

export function PageInner({
  width = "stage",
  className,
  children,
}: {
  width?: keyof typeof WIDTH;
  className?: string;
  children: ReactNode;
}) {
  const frame = WIDTH[width];
  return (
    <div className={className ? `${frame} ${className}` : frame}>{children}</div>
  );
}
