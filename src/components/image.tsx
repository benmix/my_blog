import NextImage from "next/image";
import type { ComponentProps } from "react";

import { cn } from "@lib/utils";

type ImageProps = Omit<ComponentProps<typeof NextImage>, "fill" | "className"> & {
  wrapperClassName?: string;
  imageClassName?: string;
};

export function Image(props: ImageProps) {
  const { wrapperClassName, imageClassName, sizes = "100vw", src, alt, ...rest } = props;
  const wrapperClasses = cn("relative overflow-hidden", wrapperClassName);
  const imageClasses = cn("object-cover object-center", imageClassName);

  return (
    <div className={wrapperClasses}>
      <NextImage src={src} alt={alt} fill sizes={sizes} className={imageClasses} {...rest} />
    </div>
  );
}
