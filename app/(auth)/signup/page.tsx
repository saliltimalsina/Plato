"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Checkbox, Input } from "@heroui/react";
import { ArrowRight, Eye, EyeOff, Lock, Mail, Users, Utensils } from "lucide-react";
import { AuthCard, AuthLayout } from "../_components/AuthShell";
import { PinInput } from "../_components/PinInput";
import { SuccessCard } from "../_components/SuccessCard";
import {
  BackLink,
  INK,
  ORANGE,
  WARM_400,
  WARM_500,
  authFieldInput,
  authFieldLabel,
  authFieldWrap,
  bottomLinkCx,
  termLinkCx,
} from "../_components/primitives";

type Step = "form" | "pin" | "success";

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("form");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [name, setName] = useState("");
  const [biz, setBiz] = useState("");
  const [agree, setAgree] = useState(false);
  const [show, setShow] = useState(false);
  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const pinComplete = digits.every((d) => d);
  const dash = () => router.push("/inventory/stock-items");

  if (step === "success") {
    return (
      <AuthLayout>
        <SuccessCard
          title="Account created"
          sub="Your plato workspace is ready. Jump in and set up your menu."
          ctaLabel="Continue to dashboard"
          onCta={dash}
        />
      </AuthLayout>
    );
  }

  if (step === "pin") {
    return (
      <AuthLayout>
        <AuthCard
          cardKey="pin"
          title="Enter the code"
          sub={
            <span>
              We sent a 6-digit code to{" "}
              <strong style={{ color: INK }}>{email || "you@restaurant.com"}</strong>.
            </span>
          }
        >
          <PinInput digits={digits} setDigits={setDigits} />
          <div style={{ textAlign: "center", fontSize: 13, color: WARM_500 }}>
            Didn&apos;t get it?{" "}
            <button
              type="button"
              onClick={() => setDigits(["", "", "", "", "", ""])}
              className="bg-transparent border-0 cursor-pointer p-0"
              style={{ color: ORANGE, fontWeight: 600 }}
            >
              Resend code
            </button>
          </div>
          <Button
            onPress={() => setStep("success")}
            isDisabled={!pinComplete}
            radius="full"
            className="h-[50px] w-full text-[15.5px] font-semibold text-white shadow-[0_10px_22px_-8px_rgba(241,80,34,0.6)] disabled:shadow-none disabled:opacity-50"
            style={{ background: "linear-gradient(155deg, #F15022, #FF8A5B)" }}
            endContent={<ArrowRight size={18} color="#fff" strokeWidth={2.2} />}
          >
            Verify
          </Button>
          <BackLink onPress={() => setStep("form")} label="Back" />
        </AuthCard>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <AuthCard
        cardKey="signup"
        title="Create your account"
        sub="Start running your restaurant on plato in minutes."
      >
        <Input
          label="Full name"
          labelPlacement="outside"
          placeholder="Jane Doe"
          value={name}
          onValueChange={setName}
          variant="flat"
          startContent={<Users size={18} color={WARM_400} strokeWidth={1.9} />}
          classNames={{ label: authFieldLabel, inputWrapper: authFieldWrap, input: authFieldInput }}
        />
        <Input
          label="Restaurant name"
          labelPlacement="outside"
          placeholder="Mantra Restro"
          value={biz}
          onValueChange={setBiz}
          variant="flat"
          startContent={<Utensils size={18} color={WARM_400} strokeWidth={1.9} />}
          classNames={{ label: authFieldLabel, inputWrapper: authFieldWrap, input: authFieldInput }}
        />
        <Input
          label="Email"
          labelPlacement="outside"
          type="email"
          placeholder="you@restaurant.com"
          value={email}
          onValueChange={setEmail}
          variant="flat"
          startContent={<Mail size={18} color={WARM_400} strokeWidth={1.9} />}
          classNames={{ label: authFieldLabel, inputWrapper: authFieldWrap, input: authFieldInput }}
        />
        <Input
          label="Password"
          labelPlacement="outside"
          type={show ? "text" : "password"}
          placeholder="Create a password"
          value={pw}
          onValueChange={setPw}
          variant="flat"
          startContent={<Lock size={18} color={WARM_400} strokeWidth={1.9} />}
          endContent={
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              aria-label="Toggle password"
              className="bg-transparent border-0 p-1 cursor-pointer"
            >
              {show ? (
                <EyeOff size={18} color={WARM_400} strokeWidth={1.9} />
              ) : (
                <Eye size={18} color={WARM_400} strokeWidth={1.9} />
              )}
            </button>
          }
          classNames={{ label: authFieldLabel, inputWrapper: authFieldWrap, input: authFieldInput }}
        />

        <Checkbox
          isSelected={agree}
          onValueChange={setAgree}
          size="sm"
          radius="sm"
          classNames={{
            label: "text-[13px] font-medium text-[#6B5F55] leading-snug",
            wrapper:
              "before:border-2 before:border-[#ECE3DC] after:bg-[#F15022] " +
              "group-data-[selected=true]:after:bg-[#F15022]",
          }}
        >
          I agree to the{" "}
          <Link href="#" className={termLinkCx}>
            Terms
          </Link>{" "}
          &{" "}
          <Link href="#" className={termLinkCx}>
            Privacy Policy
          </Link>
        </Checkbox>

        <Button
          onPress={() => {
            setDigits(["", "", "", "", "", ""]);
            setStep("pin");
          }}
          isDisabled={!agree}
          radius="full"
          className="h-[50px] w-full text-[15.5px] font-semibold text-white shadow-[0_10px_22px_-8px_rgba(241,80,34,0.6)] disabled:shadow-none disabled:opacity-50"
          style={{ background: "linear-gradient(155deg, #F15022, #FF8A5B)" }}
          endContent={<ArrowRight size={18} color="#fff" strokeWidth={2.2} />}
        >
          Create account
        </Button>
      </AuthCard>
      <Link href="/login" className={bottomLinkCx}>
        Already a customer? Sign in
      </Link>
    </AuthLayout>
  );
}
