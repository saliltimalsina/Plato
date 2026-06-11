"use client";

import type { ReactNode } from "react";
import { Button } from "@heroui/react";
import { ArrowRight, ChevronLeft } from "lucide-react";

export const ORANGE = "#F15022";
export const FIELD = "#FBF6F1";
export const BORDER = "#EFEAE6";
export const TINT = "#FFF1EB";
export const WARM_400 = "#B0A69E";
export const WARM_500 = "#8A7D72";
export const WARM_600 = "#6B5F55";
export const INK = "#11181C";

/* HeroUI Input classNames — taller, cream-fill, orange focus. */
export const authFieldLabel = "!text-[13px] !font-semibold !text-[#8A7D72] group-data-[focus=true]:!text-[#F15022]";
export const authFieldWrap =
  "h-12 min-h-12 rounded-[12px] bg-[#FBF6F1] border-0 shadow-none " +
  "ring-2 ring-transparent ring-offset-2 ring-offset-white " +
  "data-[hover=true]:bg-[#F6EFE7] " +
  "group-data-[focus=true]:!ring-[#F15022] group-data-[focus=true]:!bg-[#FBF6F1] " +
  "data-[focus=true]:!ring-[#F15022]";
export const authFieldInput = "text-[15px] text-ink placeholder:text-[#B0A69E]";

/* Primary pill CTA — gradient orange. */
export function CTA({
  children,
  onPress,
  isDisabled,
  withArrow = true,
}: {
  children: ReactNode;
  onPress?: () => void;
  isDisabled?: boolean;
  withArrow?: boolean;
}) {
  return (
    <Button
      onPress={onPress}
      isDisabled={isDisabled}
      radius="full"
      className="h-[50px] w-full text-[15.5px] font-semibold text-white shadow-[0_10px_22px_-8px_rgba(241,80,34,0.6)] disabled:shadow-none disabled:opacity-50"
      style={{ background: "linear-gradient(155deg, #F15022, #FF8A5B)" }}
      endContent={withArrow ? <ArrowRight size={18} color="#fff" strokeWidth={2.2} /> : undefined}
    >
      {children}
    </Button>
  );
}

export function BackLink({ onPress, label = "Back to sign in" }: { onPress: () => void; label?: string }) {
  return (
    <Button
      onPress={onPress}
      variant="light"
      radius="md"
      className="self-center h-auto px-2 py-1 text-[13.5px] font-semibold text-[#8A7D72] hover:!bg-transparent"
      startContent={<ChevronLeft size={15} color={WARM_500} strokeWidth={2.2} />}
    >
      {label}
    </Button>
  );
}

export const bottomLinkCx = "text-[14.5px] font-bold text-[#F15022] no-underline hover:opacity-80";
export const termLinkCx = "text-[#F15022] font-semibold no-underline";
