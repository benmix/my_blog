import { type ComponentProps, type FC } from "react";

export const Checkbox: FC<ComponentProps<"input">> = (props) => <input {...props} />;
