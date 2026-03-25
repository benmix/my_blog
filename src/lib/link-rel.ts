export function getSecureRel(target?: string, rel?: string) {
  if (target !== "_blank") {
    return rel;
  }

  const values = new Set((rel ?? "").split(/\s+/).filter(Boolean));
  values.add("noopener");
  values.add("noreferrer");
  return Array.from(values).join(" ");
}
