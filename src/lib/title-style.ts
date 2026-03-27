import type { CSSProperties } from "react";

const LEADING_PUNCTUATION_RE =
  /^[\u3001\u3002\uFF0C\uFF1B\uFF1A\uFF01\uFF1F\u201C\u201D\u2018\u2019\u300C\u300D\u300E\u300F\u3008\u3009\u300A\u300B\u3010\u3011\u3014\u3015\u3016\u3017\u3018\u3019\uFF08\uFF09\uFF3B\uFF3D\uFF5B\uFF5D]/;

export function getTitleStyle(title: string): CSSProperties | undefined {
  return LEADING_PUNCTUATION_RE.test(title)
    ? {
        display: "block",
        paddingInlineStart: "0.5em",
        textIndent: "-1em",
      }
    : undefined;
}
