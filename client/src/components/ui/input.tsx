import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cn } from "../../lib/utils";

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn("text-sm font-medium text-slate-700 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className)}
    {...props}
  />
));
Label.displayName = LabelPrimitive.Root.displayName;

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-lg border border-pink-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

// TextField component that mimics MUI's TextField API
interface TextFieldProps extends Omit<InputProps, "type" | "children"> {
  label?: string;
  type?: string;
  select?: boolean;
  children?: React.ReactNode;
  InputLabelProps?: { shrink?: boolean };
  error?: boolean;
  helperText?: string;
}

const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, type, select, children, InputLabelProps, error, helperText, className, ...props }, ref) => {
    const id = React.useId();

    if (select) {
      return (
        <div className={cn("flex flex-col gap-2", className)}>
          {label && (
            <Label htmlFor={id} className={error ? "text-red-600" : ""}>
              {label}
            </Label>
          )}
          <select
            id={id}
            className={cn(
              "flex h-10 w-full rounded-lg border bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
              error ? "border-red-500" : "border-pink-200"
            )}
            {...(props as any)}
          >
            {children}
          </select>
          {helperText && <p className={cn("text-xs", error ? "text-red-600" : "text-slate-500")}>{helperText}</p>}
        </div>
      );
    }

    return (
      <div className={cn("flex flex-col gap-2", className)}>
        {label && (
          <Label htmlFor={id} className={error ? "text-red-600" : ""}>
            {label}
          </Label>
        )}
        <Input
          id={id}
          type={type}
          ref={ref}
          className={error ? "border-red-500 focus-visible:ring-red-500" : ""}
          {...props}
        />
        {helperText && <p className={cn("text-xs", error ? "text-red-600" : "text-slate-500")}>{helperText}</p>}
      </div>
    );
  }
);
TextField.displayName = "TextField";

// MenuItem for select dropdowns
const MenuItem = ({ value, children, ...props }: React.OptionHTMLAttributes<HTMLOptionElement>) => (
  <option value={value} {...props}>
    {children}
  </option>
);

export { Input, TextField, Label, MenuItem };
