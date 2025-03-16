"use client";

import { useTransitionRouter } from "next-view-transitions";
import type { FC } from "react";
import { Button } from "./ui/button";
import { RiArrowLeftLine, RiHome2Line } from "@remixicon/react";

export const GoBack: FC<{ className?: string }> = ({ className }) => {
  const router = useTransitionRouter();

  return (
    <Button onClick={router.back} className={className} variant={"link"}>
      <RiArrowLeftLine />
      <span>Go Back</span>
    </Button>
  );
};

export const GoHome: FC = ({ className }: { className?: string }) => {
  const router = useTransitionRouter();

  return (
    <Button
      onClick={() => router.push("/")}
      className={className}
      variant={"link"}
    >
      <RiHome2Line />
      <span>Go Home</span>
    </Button>
  );
};
