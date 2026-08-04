"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils/cn";

export type DetailDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
};

/** Desktop-friendly detail overlay that slides in as a wide dialog panel. */
export function DetailDrawer({
  open,
  onOpenChange,
  title,
  description,
  children,
  className,
}: DetailDrawerProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "left-auto right-0 top-0 h-dvh max-h-dvh w-full max-w-md translate-x-0 translate-y-0 rounded-none border-y-0 border-r-0 sm:max-w-lg",
          className,
        )}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description ? (
            <DialogDescription>{description}</DialogDescription>
          ) : null}
        </DialogHeader>
        <ScrollArea className="h-[calc(100dvh-7rem)] pr-2">{children}</ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
