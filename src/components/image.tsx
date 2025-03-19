import type { ImageProps } from "next/image";
import NextImage from "next/image";
import { forwardRef } from "react";

export const Image = forwardRef<HTMLImageElement, ImageProps>((props, ref) => {
  const ComponentToUse = typeof props.src === "object" ? NextImage : "img";
  return (
    // @ts-expect-error -- fixme
    <ComponentToUse {...props} ref={ref} />
  );
});

Image.displayName = "Image";
