"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";

export function OtpInput({
  value,
  onChange,
  length = 6,
  disabled,
  error,
}: {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  disabled?: boolean;
  error?: boolean;
}) {
  const inputs = React.useRef<Array<HTMLInputElement | null>>([]);
  const digits = value.padEnd(length, " ").slice(0, length).split("");

  function updateAt(index: number, char: string) {
    const next = value.split("");
    while (next.length < length) next.push("");
    next[index] = char;
    onChange(next.join("").replace(/\s/g, "").slice(0, length));
  }

  return (
    <div className="flex justify-between gap-2">
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            inputs.current[index] = el;
          }}
          inputMode="numeric"
          autoComplete={index === 0 ? "one-time-code" : "off"}
          maxLength={1}
          disabled={disabled}
          value={digit.trim()}
          aria-label={`OTP ${index + 1}`}
          className={cn(
            "h-12 w-11 rounded-lg border border-input bg-card text-center text-lg font-semibold shadow-xs focus-visible:outline-none touch-target",
            error && "border-error",
          )}
          onChange={(e) => {
            const char = e.target.value.replace(/\D/g, "").slice(-1);
            updateAt(index, char);
            if (char && index < length - 1) {
              inputs.current[index + 1]?.focus();
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Backspace" && !digits[index].trim() && index > 0) {
              inputs.current[index - 1]?.focus();
            }
          }}
          onPaste={(e) => {
            e.preventDefault();
            const pasted = e.clipboardData
              .getData("text")
              .replace(/\D/g, "")
              .slice(0, length);
            onChange(pasted);
            inputs.current[Math.min(pasted.length, length - 1)]?.focus();
          }}
        />
      ))}
    </div>
  );
}
