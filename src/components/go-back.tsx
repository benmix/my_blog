"use client";

import { Button } from "@components/ui/button";
import { cn } from "@lib/utils";
import { RiArrowLeftLine, RiHome2Line } from "@remixicon/react";
import { useTransitionRouter } from "next-view-transitions";
import type { FC } from "react";

export const GoBack: FC<{ className?: string }> = ({ className }) => {
  const router = useTransitionRouter();

  return (
    <Button
      onClick={router.back}
      className={cn(className, "flex, cursor-pointer justify-start")}
      variant="link"
    >
      <RiArrowLeftLine />
    </Button>
  );
};

export const GoHome: FC<{ className?: string }> = ({ className }) => {
  const router = useTransitionRouter();

  return (
    <Button
      onClick={() => router.push("/")}
      className={cn(className, "flex, cursor-pointer justify-start")}
      variant="link"
    >
      <RiHome2Line />
    </Button>
  );
};

export const GoBackHome: FC<{ className?: string }> = ({ className }) => {
  const router = useTransitionRouter();

  return (
    <Button
      onClick={() => router.push("/")}
      className={cn(className, "flex, justify-start, cursor-pointer p-0!")}
      variant="link"
    >
      <RiArrowLeftLine />
    </Button>
  );
};
