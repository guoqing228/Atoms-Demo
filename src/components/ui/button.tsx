"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "ring-focus inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-[10px] text-[13px] font-medium transition-[background,color,border-color,transform,box-shadow] duration-150 disabled:pointer-events-none disabled:opacity-40 active:translate-y-px",
  {
    variants: {
      variant: {
        primary:
          "bg-lime text-white hover:brightness-[1.06] shadow-[0_1px_2px_rgba(34,31,26,0.14)]",
        soft: "bg-ink/[0.06] text-ink hover:bg-ink/[0.1] border border-line",
        outline:
          "border border-line-strong bg-transparent text-ink hover:bg-ink/[0.05] hover:border-line20",
        ghost: "text-dim hover:bg-ink/[0.06] hover:text-ink",
        danger: "bg-danger/10 text-danger border border-danger/25 hover:bg-danger/15",
        link: "text-dim underline-offset-4 hover:text-ink hover:underline",
      },
      size: {
        sm: "h-7 px-2.5 text-[12px] rounded-lg gap-1.5",
        md: "h-9 px-3.5",
        lg: "h-11 px-5 text-[14px] rounded-xl",
        icon: "h-8 w-8 rounded-lg",
        "icon-sm": "h-7 w-7 rounded-md",
      },
    },
    defaultVariants: { variant: "soft", size: "md" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { buttonVariants };
