"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "@/lib/utils";

interface ProgressProps
  extends React.ComponentProps<typeof ProgressPrimitive.Root> {
  value?: number;
  autoPlay?: boolean;
  duration?: number;
}

function Progress({
  className,
  value = 0,
  autoPlay = false,
  duration = 10000,
  ...props
}: ProgressProps) {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    if (autoPlay) {
      setProgress(0);
      const timer = setTimeout(() => {
        setProgress(value);
      }, 50);

      return () => clearTimeout(timer);
    } else {
      setProgress(value);
    }
  }, [value, autoPlay]);

  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "bg-primary/20 relative h-2 w-full overflow-hidden rounded-full",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="bg-green-900 h-full w-full flex-1 transition-all"
        style={{
          transform: `translateX(-${100 - progress}%)`,
          transitionDuration: autoPlay ? `${duration}ms` : "150ms",
          transitionTimingFunction: autoPlay ? "ease-out" : "ease-in-out",
        }}
      />
    </ProgressPrimitive.Root>
  );
}

export { Progress };
