import { Children, type ComponentProps, type FC, isValidElement } from "react";
import { cn } from "@lib/utils";

function getTaskItemData(children: React.ReactNode) {
  const items = Children.toArray(children);
  const first = items[0];
  const isCheckbox =
    isValidElement<ComponentProps<"input">>(first) &&
    typeof first.type === "string" &&
    first.type === "input";

  return {
    checked: isCheckbox ? Boolean(first.props.checked) : false,
    content: isCheckbox ? items.slice(1) : items,
  };
}

function TaskListMarker({ checked }: { checked: boolean }) {
  return (
    <input
      type="checkbox"
      checked={checked}
      readOnly
      aria-hidden="true"
      tabIndex={-1}
      className="mt-[0.22em] h-[1em] w-[1em] shrink-0 rounded-[0.12em] border border-input bg-background align-top accent-primary"
    />
  );
}

export const ListItem: FC<ComponentProps<"li">> = ({ className, children, ...props }) => {
  if (!className?.includes("task-list-item")) {
    return (
      <li className={cn("leading-relaxed", className)} {...props}>
        {children}
      </li>
    );
  }

  const { checked, content } = getTaskItemData(children);

  return (
    <li
      className={cn(
        "flex items-start gap-3 font-serif text-lg leading-relaxed text-foreground",
        className,
      )}
      {...props}
    >
      <TaskListMarker checked={checked} />
      <span
        className={cn(
          "flex-1",
          checked
            ? "text-muted-foreground line-through decoration-muted-foreground decoration-[0.06em]"
            : undefined,
        )}
      >
        {content}
      </span>
    </li>
  );
};
