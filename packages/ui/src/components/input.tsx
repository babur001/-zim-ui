import * as React from "react";

import { cn } from "#/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "placeholder:text-accent border-[0.25px] border-accent/40 flex h-12 w-full min-w-0 rounded-md px-3 py-1 text-base transition-[color,box-shadow] outline-none file:inline-flex file:h-7 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "focus-visible:ring-ring focus-visible:ring-3",
        "aria-invalid:ring-destructive/20 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  );
}

export { Input };
