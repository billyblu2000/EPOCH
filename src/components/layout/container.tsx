import { cn } from "@/lib/utils";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  narrow?: boolean;
}

export function Container({ children, className, narrow }: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-6",
        narrow ? "max-w-3xl" : "max-w-5xl",
        className
      )}
    >
      {children}
    </div>
  );
}
