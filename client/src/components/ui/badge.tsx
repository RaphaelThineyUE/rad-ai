import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-rose-600 text-white hover:bg-rose-700",
        secondary: "border-transparent bg-pink-100 text-rose-700 hover:bg-pink-200",
        outlined: "border-rose-300 bg-transparent text-rose-700",
        destructive: "border-transparent bg-red-500 text-white hover:bg-red-600",
        success: "border-transparent bg-green-500 text-white hover:bg-green-600",
        warning: "border-transparent bg-yellow-500 text-white hover:bg-yellow-600",
        error: "border-transparent bg-red-500 text-white hover:bg-red-600",
      },
      size: {
        default: "px-2.5 py-0.5",
        small: "px-2 py-0.5 text-xs",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant, size }), className)} {...props} />;
}

// Chip component for MUI compatibility
interface ChipProps {
  label?: string;
  color?: "default" | "primary" | "secondary" | "success" | "warning" | "error";
  variant?: "filled" | "outlined";
  size?: "default" | "small";
  children?: React.ReactNode;
  className?: string;
}

const Chip = ({ label, color = "default", variant = "filled", size = "default", children, className }: ChipProps) => {
  const colorMap: Record<string, "default" | "secondary" | "outlined" | "destructive" | "success" | "warning" | "error"> = {
    default: "default",
    primary: "default",
    secondary: "secondary",
    success: "success",
    warning: "warning",
    error: "error",
  };

  const badgeVariant = variant === "outlined" ? "outlined" : colorMap[color];

  return (
    <Badge variant={badgeVariant} size={size} className={className}>
      {label || children}
    </Badge>
  );
};

export { Badge, badgeVariants, Chip };
