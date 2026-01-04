import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cn } from "../../lib/utils";

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer h-5 w-5 shrink-0 rounded border-2 border-rose-400 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-rose-600 data-[state=checked]:border-rose-600 data-[state=checked]:text-white",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator className={cn("flex items-center justify-center text-current")}>
      <Check className="h-4 w-4" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

// FormControlLabel for MUI compatibility
interface FormControlLabelProps {
  control: React.ReactElement;
  label: string;
  className?: string;
}

const FormControlLabel = ({ control, label, className }: FormControlLabelProps) => {
  const id = React.useId();
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {React.cloneElement(control, { id })}
      <LabelPrimitive.Root htmlFor={id} className="text-sm font-medium text-slate-700 cursor-pointer">
        {label}
      </LabelPrimitive.Root>
    </div>
  );
};

export { Checkbox, FormControlLabel };
