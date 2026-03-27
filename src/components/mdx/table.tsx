import type { ComponentProps, FC } from "react";
import { cn } from "@lib/utils";

const Table_: FC<ComponentProps<"table">> = (props) => (
  <div className="my-10 w-full max-w-4xl overflow-x-auto rounded-lg border border-border bg-card shadow-sm">
    <table
      {...props}
      className={cn("w-full border-collapse text-left text-sm text-foreground", props.className)}
    />
  </div>
);

const Thead: FC<ComponentProps<"thead">> = (props) => (
  <thead {...props} className={cn("bg-accent", props.className)} />
);

const Tbody: FC<ComponentProps<"tbody">> = (props) => (
  <tbody {...props} className={cn("font-serif text-base", props.className)} />
);

const Th: FC<ComponentProps<"th">> = (props) => {
  return (
    <th
      {...props}
      className={cn(
        "border-b border-border px-6 py-4 font-sans text-xs font-bold tracking-wider text-foreground uppercase",
        props.className,
      )}
    />
  );
};

const Tr: FC<ComponentProps<"tr">> = (props) => {
  return (
    <tr
      {...props}
      className={cn(
        "border-b border-border transition-colors even:bg-muted/20 hover:bg-transparent even:hover:bg-muted/20",
        props.className,
      )}
    />
  );
};

const Td: FC<ComponentProps<"td">> = (props) => {
  return (
    <td
      {...props}
      className={cn(
        "px-6 py-4 font-serif text-base leading-relaxed text-muted-foreground",
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
