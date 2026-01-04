import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "../../lib/utils";

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-lg bg-pink-50 p-1 text-slate-500",
      className
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-rose-600 data-[state=active]:shadow-sm",
      className
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

// MUI-compatible wrapper
interface TabsWrapperProps {
  value: string;
  onChange: (event: React.SyntheticEvent, value: string) => void;
  children: React.ReactNode;
  "aria-label"?: string;
  textColor?: string;
  indicatorColor?: string;
  className?: string;
}

const TabsWrapper = ({ value, onChange, children, className, ...props }: TabsWrapperProps) => {
  return (
    <Tabs value={value} onValueChange={(val) => onChange({} as React.SyntheticEvent, val)} className={className}>
      <TabsList {...props}>{children}</TabsList>
    </Tabs>
  );
};

interface TabProps {
  value: string;
  label: string;
  className?: string;
}

const Tab = ({ value, label, className }: TabProps) => {
  return (
    <TabsTrigger value={value} className={className}>
      {label}
    </TabsTrigger>
  );
};

export { Tabs, TabsList, TabsTrigger, TabsContent, TabsWrapper as default, Tab };
