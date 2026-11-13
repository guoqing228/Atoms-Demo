"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;

export const DialogContent = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
    title: React.ReactNode;
    description?: React.ReactNode;
    hideClose?: boolean;
  }
>(({ className, children, title, description, hideClose, ...props }, ref) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay className="vf-overlay fixed inset-0 z-50 bg-ink/45 backdrop-blur-[2px]" />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "vf-dialog fixed left-1/2 top-1/2 z-50 w-[min(560px,calc(100vw-32px))] max-h-[min(88vh,900px)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-line bg-popover shadow-[0_30px_80px_-24px_rgba(34,31,26,0.35)]",
        className,
      )}
      {...props}
    >
      <div className="flex items-start justify-between gap-6 border-b border-line px-5 py-4">
        <div className="min-w-0">
          <DialogPrimitive.Title className="text-[15px] font-semibold tracking-[-0.01em] text-ink">
            {title}
          </DialogPrimitive.Title>
          {description ? (
            <DialogPrimitive.Description className="mt-1 text-[13.5px] leading-relaxed text-dim">
              {description}
            </DialogPrimitive.Description>
          ) : null}
        </div>
        {hideClose ? null : (
          <DialogPrimitive.Close
            className="ring-focus -mr-1 mt-0.5 rounded-md p-1.5 text-faint transition-colors hover:bg-ink/[0.06] hover:text-ink"
            aria-label="关闭"
          >
            <X size={15} />
          </DialogPrimitive.Close>
        )}
      </div>
      {children}
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
));
DialogContent.displayName = "DialogContent";
