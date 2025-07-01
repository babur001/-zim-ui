import React from "react";
import { cva } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "#lib/utils.js";

interface LoadingIconProps {
  size?: "sm" | "md" | "lg" | "default";
  isLoading: boolean;
  className?: string;
}

const loadingIconVariants = cva("animate-spin opacity-0 data-[loading=true]:opacity-100 transition-opacity", {
  variants: {
    size: {
      default: "size-6",
      sm: "size-4",
      md: "size-5",
      lg: "size-8",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

export const Spin: React.FC<LoadingIconProps> = ({ size = "default", isLoading, className }) => {
  return <Loader2 className={cn(loadingIconVariants({ size }), className)} data-loading={isLoading} />;
};
