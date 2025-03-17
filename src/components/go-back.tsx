"use client";

import { useTransitionRouter } from "next-view-transitions";
import type { FC } from "react";
import { Button } from "./ui/button";
import { RiArrowLeftLine, RiHome2Line } from "@remixicon/react";
import { cn } from "@/lib/utils";

export const GoBack: FC<{ className?: string }> = ({ className }) => {
  const router = useTransitionRouter();

  return (
    <Button
      onClick={router.back}
      className={cn(className, "flex, justify-start")}
      variant={"link"}
    >
      <RiArrowLeftLine />
      <span>Back</span>
    </Button>
  );
};

export const GoHome: FC = ({ className }: { className?: string }) => {
  const router = useTransitionRouter();

  return (
    <Button
      onClick={() => router.push("/")}
      className={cn(className, "flex, justify-start")}
      variant={"link"}
    >
      <RiHome2Line />
      <span>Home</span>
    </Button>
  );
};
