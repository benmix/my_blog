import {
  Children,
  type ComponentProps,
  type FC,
  isValidElement,
  type PropsWithChildren,
  type ReactNode,
} from "react";

import { cn } from "@lib/utils";

function getTaskItemData(children: ReactNode) {
  const items = Children.toArray(children);
  const first = items[0];
  const isCheckbox =
    isValidElement<ComponentProps<"input">>(first) && first.props.type === "checkbox";

  return {
    checked: isCheckbox ? Boolean(first.props.checked) : false,
    content: isCheckbox ? items.slice(1) : items,
  };
}

function TaskListMarker({ checked }: { checked: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 flex items-center justify-center text-foreground transition-opacity",
        checked ? "opacity-100" : "opacity-0",
      )}
    >
      <span className="block h-[0.32em] w-[0.58em] rotate-[-45deg] border-b-[1.5px] border-l-[1.5px] border-current" />
    </span>
  );
}

export const Checkbox: FC<ComponentProps<"input">> = ({
  checked,
  className,
  disabled,
  readOnly,
  type = "checkbox",
  ...props
}) => {
  if (type !== "checkbox") {
    return <input type={type} checked={checked} className={className} {...props} />;
  }

  return (
    <span className="relative mt-[0.22em] h-[1.05em] w-[1.05em] shrink-0">
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled ?? true}
        readOnly={readOnly ?? true}
        aria-disabled={disabled ?? true}
        className={cn(
          "m-0 h-full w-full shrink-0 appearance-none rounded-[2px] border border-border bg-background align-top transition-colors",
          checked ? "border-muted-foreground bg-muted/70" : undefined,
          className,
        )}
        {...props}
      />
      <TaskListMarker checked={Boolean(checked)} />
    </span>
  );
};

export const ListItem: FC<ComponentProps<"li">> = ({ className, children, ...props }) => {
  if (!className?.includes("task-list-item")) {
    return (
      <li className={cn("leading-[1.85]", className)} {...props}>
        {children}
      </li>
    );
  }

  const { checked, content } = getTaskItemData(children);

  return (
    <li
      className={cn(
        "border-b border-border/60 py-3 font-sans text-[1.02rem] leading-[1.85] text-foreground first:pt-0 last:border-b-0 last:pb-0",
        className,
      )}
      {...props}
    >
      <label className="flex items-start gap-3">
        <Checkbox checked={checked} type="checkbox" />
        <span
          className={cn(
            "flex-1 [text-wrap:pretty]",
            checked
              ? "text-muted-foreground line-through decoration-muted-foreground decoration-[0.06em] decoration-from-font"
              : undefined,
          )}
        >
          {content}
        </span>
      </label>
    </li>
  );
};

export const OrderedList: FC<PropsWithChildren<ComponentProps<"ol">>> = ({
  className,
  children,
  ...props
}) => (
  <ol
    className={cn(
      "mb-10 ml-5 max-w-[64ch] list-outside list-decimal space-y-3 font-sans text-[1.02rem] leading-[1.85] text-foreground marker:font-mono marker:text-[0.78rem] marker:font-medium marker:text-muted-foreground [&_ol]:mt-2 [&_ol]:ml-5 [&_ol]:space-y-2 [&_ul]:mt-2 [&_ul]:ml-5 [&_ul]:list-disc [&_ul]:space-y-2",
      className,
    )}
    {...props}
  >
    {children}
  </ol>
);

export const UnorderedList: FC<PropsWithChildren<ComponentProps<"ul">>> = ({
  className,
  children,
  ...props
}) => {
  if (className?.includes("contains-task-list")) {
    return (
      <ul className={cn("m-0 max-w-[64ch] list-none px-0 py-2", className)} {...props}>
        {children}
      </ul>
    );
  }

  return (
    <ul
      className={cn(
        "mb-10 ml-5 max-w-[64ch] list-outside list-disc space-y-3 font-sans text-[1.02rem] leading-[1.85] text-foreground marker:text-muted-foreground [&_ol]:mt-2 [&_ol]:ml-5 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ul]:mt-2 [&_ul]:ml-5 [&_ul]:list-[circle] [&_ul]:space-y-2 [&_ul_ul]:list-[square]",
        className,
      )}
      {...props}
    >
      {children}
    </ul>
  );
};
