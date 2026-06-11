"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input } from "@heroui/react";
import { ArrowRight, Eye, EyeOff, Lock, Mail } from "lucide-react";
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
} from "../_components/primitives";

type Step = "email" | "pin" | "reset" | "success";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [npw, setNpw] = useState("");
  const [cpw, setCpw] = useState("");
  const [show, setShow] = useState(false);
  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const pinComplete = digits.every((d) => d);

  if (step === "success") {
    return (
      <AuthLayout>
        <SuccessCard
          title="Password updated"
          sub="Your password has been changed. Sign in with your new credentials."
          ctaLabel="Back to sign in"
          onCta={() => router.push("/login")}
        />
      </AuthLayout>
    );
  }

  if (step === "reset") {
    return (
      <AuthLayout>
        <AuthCard
          cardKey="reset"
          title="Set a new password"
          sub="Choose a strong password you'll remember."
        >
          <Input
            label="New password"
            labelPlacement="outside"
            type={show ? "text" : "password"}
            placeholder="Create a new password"
            value={npw}
            onValueChange={setNpw}
            variant="flat"
            autoFocus
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
            classNames={{
              label: authFieldLabel,
              inputWrapper: authFieldWrap,
              input: authFieldInput,
            }}
          />
          <Input
            label="Confirm password"
            labelPlacement="outside"
            type={show ? "text" : "password"}
            placeholder="Re-enter your password"
            value={cpw}
            onValueChange={setCpw}
            variant="flat"
            startContent={<Lock size={18} color={WARM_400} strokeWidth={1.9} />}
            classNames={{
              label: authFieldLabel,
              inputWrapper: authFieldWrap,
              input: authFieldInput,
            }}
          />
          <Button
            onPress={() => setStep("success")}
            isDisabled={!npw || npw !== cpw}
            radius="full"
            className="h-[50px] w-full text-[15.5px] font-semibold text-white shadow-[0_10px_22px_-8px_rgba(241,80,34,0.6)] disabled:shadow-none disabled:opacity-50"
            style={{ background: "linear-gradient(155deg, #F15022, #FF8A5B)" }}
            endContent={<ArrowRight size={18} color="#fff" strokeWidth={2.2} />}
          >
            Reset password
          </Button>
          <BackLink onPress={() => router.push("/login")} />
        </AuthCard>
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
            onPress={() => setStep("reset")}
            isDisabled={!pinComplete}
            radius="full"
            className="h-[50px] w-full text-[15.5px] font-semibold text-white shadow-[0_10px_22px_-8px_rgba(241,80,34,0.6)] disabled:shadow-none disabled:opacity-50"
            style={{ background: "linear-gradient(155deg, #F15022, #FF8A5B)" }}
            endContent={<ArrowRight size={18} color="#fff" strokeWidth={2.2} />}
          >
            Verify
          </Button>
          <BackLink onPress={() => setStep("email")} label="Back" />
        </AuthCard>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <AuthCard
        cardKey="forgot"
        title="Reset your password"
        sub="Enter your email and we'll send you a 6-digit code."
      >
        <Input
          label="Email"
          labelPlacement="outside"
          type="email"
          placeholder="you@restaurant.com"
          value={email}
          onValueChange={setEmail}
          variant="flat"
          autoFocus
          startContent={<Mail size={18} color={WARM_400} strokeWidth={1.9} />}
          classNames={{
            label: authFieldLabel,
            inputWrapper: authFieldWrap,
            input: authFieldInput,
          }}
        />
        <Button
          onPress={() => {
            setDigits(["", "", "", "", "", ""]);
            setStep("pin");
          }}
          radius="full"
          className="h-[50px] w-full text-[15.5px] font-semibold text-white shadow-[0_10px_22px_-8px_rgba(241,80,34,0.6)]"
          style={{ background: "linear-gradient(155deg, #F15022, #FF8A5B)" }}
          endContent={<ArrowRight size={18} color="#fff" strokeWidth={2.2} />}
        >
          Send reset code
        </Button>
        <BackLink onPress={() => router.push("/login")} />
      </AuthCard>
    </AuthLayout>
  );
}
