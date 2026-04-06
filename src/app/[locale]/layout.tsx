import { notFound } from "next/navigation";

import { isSiteLocale } from "@lib/i18n";
import { SITE_LOCALES } from "@lib/i18n";

type Props = import("react").PropsWithChildren<{
  params: Promise<{
    locale: string;
  }>;
}>;

export function generateStaticParams() {
  return SITE_LOCALES.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!isSiteLocale(locale)) {
    notFound();
  }

  return <>{children}</>;
}
