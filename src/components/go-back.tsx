"use client";
import { RiArrowLeftLine, RiHome2Line } from "@remixicon/react";
import { Button } from "@components/ui/button";
import { cn } from "@lib/utils";
import type { FC } from "react";
import { Link } from "next-view-transitions";
import { useTransitionRouter } from "next-view-transitions";

export const GoBack: FC<{ className?: string }> = ({ className }) => {
  const router = useTransitionRouter();

  return (
    <Button
      onClick={router.back}
      className={cn(className, "flex cursor-pointer justify-start")}
      variant="link"
    >
      <RiArrowLeftLine />
    </Button>
  );
};

export const GoHome: FC<{ className?: string }> = ({ className }) => {
  return (
    <Button asChild className={cn(className, "flex cursor-pointer justify-start")} variant="link">
      <Link href="/">
        <RiHome2Line />
      </Link>
    </Button>
  );
};

export const GoBackHome: FC<{ className?: string }> = ({ className }) => {
  return (
    <Button
      asChild
      className={cn(className, "flex cursor-pointer justify-start p-0!")}
      variant="link"
    >
      <Link href="/">
        <RiArrowLeftLine />
      </Link>
    </Button>
  );
};
