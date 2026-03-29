import { redirect } from "next/navigation";

import { DEFAULT_LOCALE } from "@lib/i18n";

export default function MarkdownDesignSystemPage() {
  redirect(`/${DEFAULT_LOCALE}/markdown-design-system`);
}
