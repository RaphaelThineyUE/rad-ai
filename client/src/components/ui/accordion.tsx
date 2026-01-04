import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import { cn } from "../../lib/utils";

const Accordion = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Root>
>(({ className, ...props }, ref) => <AccordionPrimitive.Root ref={ref} className={cn("w-full", className)} {...props} />);
Accordion.displayName = "Accordion";
Accordion.defaultProps = {
  type: "single",
  collapsible: true,
};

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item ref={ref} className={cn("border-b border-pink-100", className)} {...props} />
));
AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:text-rose-600 [&[data-state=open]>svg]:rotate-180",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    <div className={cn("pb-4 pt-0", className)}>{children}</div>
  </AccordionPrimitive.Content>
));

AccordionContent.displayName = AccordionPrimitive.Content.displayName;

// MUI-compatible wrapper
interface AccordionWrapperProps {
  children: React.ReactNode;
  className?: string;
}

const AccordionWrapper = ({ children, className }: AccordionWrapperProps) => {
  // Extract title and details from children
  const childArray = React.Children.toArray(children);
  const summaryChild = childArray.find((child: any) => child.type?.displayName === "AccordionSummary");
  const detailsChild = childArray.find((child: any) => child.type?.displayName === "AccordionDetails");

  const id = React.useId();

  return (
    <Accordion type="single" collapsible className={className}>
      <AccordionItem value={id}>
        <AccordionTrigger>{summaryChild}</AccordionTrigger>
        <AccordionContent>{detailsChild}</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

const AccordionSummary = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};
AccordionSummary.displayName = "AccordionSummary";

const AccordionDetails = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};
AccordionDetails.displayName = "AccordionDetails";

export {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  AccordionWrapper as default,
  AccordionSummary,
  AccordionDetails,
};
