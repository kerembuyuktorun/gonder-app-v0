"use client";

import * as React from "react";
import { Button, type ButtonProps } from "@/components/ui/button";

export type AppButtonProps = ButtonProps;

/** Primary product button — wraps design-system Button. */
export const AppButton = React.forwardRef<HTMLButtonElement, AppButtonProps>(
  (props, ref) => <Button ref={ref} {...props} />,
);
AppButton.displayName = "AppButton";
