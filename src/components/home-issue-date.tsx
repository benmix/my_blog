"use client";

import { format } from "date-fns";
import { useEffect, useState } from "react";

import { getDateLocale } from "@lib/i18n";

type HomeIssueDateProps = {
  locale: import("@lib/i18n").SiteLocale;
};

export function HomeIssueDate({ locale }: HomeIssueDateProps) {
  const [issueDate, setIssueDate] = useState("");

  useEffect(() => {
    setIssueDate(format(new Date(), "PPPP", { locale: getDateLocale(locale) }));
  }, [locale]);

  return (
    <div
      className="min-h-[1lh] font-mono text-[0.72rem] tracking-[0.08em] text-muted-foreground"
      suppressHydrationWarning
    >
      {issueDate}
    </div>
  );
}
