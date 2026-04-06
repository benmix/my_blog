import type { ComponentProps, FC } from "react";

import { cn } from "@lib/utils";

const Table_: FC<ComponentProps<"table">> = (props) => (
  <div className="my-12 w-full max-w-[76ch]">
    <div className="mb-3 flex items-center justify-between gap-3 md:hidden">
      <span className="font-mono text-[0.68rem] tracking-[0.18em] text-muted-foreground uppercase">
        Scroll for full table
      </span>
      <span
        aria-hidden="true"
        className="font-mono text-[0.68rem] tracking-[0.18em] text-muted-foreground uppercase"
      >
        -&gt;
      </span>
    </div>
    <div className="relative overflow-hidden border-y border-border">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 z-10 hidden w-6 bg-gradient-to-r from-background to-transparent md:block"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-background to-transparent"
      />
      <div className="overflow-x-auto">
        <table
          {...props}
          className={cn(
            "min-w-[38rem] border-collapse text-left text-sm text-foreground md:min-w-full",
            props.className,
          )}
        />
      </div>
    </div>
  </div>
);

const Thead: FC<ComponentProps<"thead">> = (props) => (
  <thead {...props} className={cn(props.className)} />
);

const Tbody: FC<ComponentProps<"tbody">> = (props) => (
  <tbody {...props} className={cn("font-sans text-[0.98rem]", props.className)} />
);

const Th: FC<ComponentProps<"th">> = (props) => {
  return (
    <th
      {...props}
      className={cn(
        "border-b border-border px-5 py-4 font-mono text-[0.72rem] font-medium tracking-[0.18em] text-foreground uppercase",
        props.className,
      )}
    />
  );
};

const Tr: FC<ComponentProps<"tr">> = (props) => {
  return (
    <tr {...props} className={cn("border-b border-border/80 transition-colors", props.className)} />
  );
};

const Td: FC<ComponentProps<"td">> = (props) => {
  return (
    <td
      {...props}
      className={cn(
        "px-5 py-4 font-sans text-[0.98rem] leading-[1.7] text-muted-foreground",
        props.className,
      )}
    />
  );
};

export const Table = Object.assign(Table_, {
  Thead,
  Tbody,
  Th,
  Tr,
  Td,
});
