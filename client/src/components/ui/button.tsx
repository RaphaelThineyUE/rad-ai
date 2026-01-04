import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        contained: "bg-rose-600 text-white hover:bg-rose-700 shadow-sm",
        outlined: "border-2 border-rose-600 text-rose-600 hover:bg-rose-50",
        text: "text-rose-600 hover:bg-rose-50",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-12 rounded-md px-8",
        icon: "h-10 w-10",
        small: "h-8 w-8",
      },
      color: {
        primary: "",
        error: "",
      }
    },
    compoundVariants: [
      {
        variant: "contained",
        color: "error",
        className: "bg-red-600 hover:bg-red-700 text-white",
      },
    ],
    defaultVariants: {
      variant: "contained",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, color, startIcon, endIcon, children, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, color, className }))}
        ref={ref}
        {...props}
      >
        {startIcon && <span className="inline-flex">{startIcon}</span>}
        {children}
        {endIcon && <span className="inline-flex">{endIcon}</span>}
      </button>
    );
  }
);
Button.displayName = "Button";

const IconButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, size = "icon", children, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant: "text", size, className }))}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);
IconButton.displayName = "IconButton";

export { Button, IconButton, buttonVariants };
