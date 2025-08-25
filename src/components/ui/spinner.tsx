import { Loader2Icon } from "lucide-react";

export default function Spinner({
  size,
  className,
}: {
  size?: "small" | "medium" | "large";
  className?: string;
}) {
  const string = `animate-spin h-${
    size === "small" ? "4" : size === "medium" ? "6" : "8"
  } w-${size === "small" ? "4" : size === "medium" ? "6" : "8"}`;

  return (
    <div className={`flex flex-wrap items-center gap-4 ${className}`}>
      <Loader2Icon className={string} />
    </div>
  );
}
