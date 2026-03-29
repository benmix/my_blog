import { Figcaption } from "@/components/mdx/figcaption";
import { Figure } from "@/components/mdx/figure";
import { Image } from "@/components/mdx/image";

export function FigureWithCaption({
  alt,
  caption,
  className,
  src,
}: {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
}) {
  return (
    <Figure className={className}>
      <Image alt={alt} src={src} className="my-0" />
      {caption ? <Figcaption>{caption}</Figcaption> : null}
    </Figure>
  );
}
