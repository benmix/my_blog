import { FC, ComponentProps } from "react";

const createHeading = (
  Tag: `h${2 | 3 | 4 | 5 | 6}`,
): FC<ComponentProps<typeof Tag>> =>
  function HeadingLink({ children, id, className, ...props }) {
    return (
      <Tag id={id} className={className} {...props}>
        {children}
        {id && (
          <a
            href={`#${id}`}
            className="not-prose subheading-anchor"
            aria-label="Permalink for this section"
            rel="noopener noreferrer"
          />
        )}
      </Tag>
    );
  };

export const H2 = createHeading("h2");
export const H3 = createHeading("h3");
export const H4 = createHeading("h4");
export const H5 = createHeading("h5");
export const H6 = createHeading("h6");
