"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Checkbox, Input } from "@heroui/react";
import { ArrowRight, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { AuthCard, AuthLayout } from "../_components/AuthShell";
import { SuccessCard } from "../_components/SuccessCard";
import {
  ORANGE,
  WARM_400,
  authFieldInput,
  authFieldLabel,
  authFieldWrap,
  bottomLinkCx,
} from "../_components/primitives";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [remember, setRemember] = useState(true);
  const [show, setShow] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const dash = () => router.push("/inventory/stock-items");

  return (
    <AuthLayout>
      {signedIn ? (
        <SuccessCard
          title="You're signed in"
          sub="Welcome back to plato. Let's get your service running."
          ctaLabel="Continue to dashboard"
          onCta={dash}
        />
      ) : (
        <>
          <AuthCard
            cardKey="signin"
            title="Welcome"
            sub="Log in to plato to continue to your dashboard."
          >
            <Input
              label="Email"
              labelPlacement="outside"
              type="email"
              placeholder="you@restaurant.com"
              value={email}
              onValueChange={setEmail}
              variant="flat"
              startContent={<Mail size={18} color={WARM_400} strokeWidth={1.9} />}
              classNames={{
                label: authFieldLabel,
                inputWrapper: authFieldWrap,
                input: authFieldInput,
              }}
            />

            <Input
              label="Password"
              labelPlacement="outside"
              type={show ? "text" : "password"}
              placeholder="Enter your password"
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
              classNames={{
                label: authFieldLabel,
                inputWrapper: authFieldWrap,
                input: authFieldInput,
              }}
            />

            <div className="flex items-center justify-between">
              <Checkbox
                isSelected={remember}
                onValueChange={setRemember}
                size="sm"
                radius="sm"
                classNames={{
                  label: "text-[13px] font-medium text-[#6B5F55]",
                  wrapper:
                    "before:border-2 before:border-[#ECE3DC] after:bg-[#F15022] " +
                    "group-data-[selected=true]:after:bg-[#F15022]",
                }}
              >
                Remember me
              </Checkbox>
              <Link
                href="/forgot-password"
                className="text-[13.5px] font-semibold no-underline"
                style={{ color: ORANGE }}
              >
                Forgot password?
              </Link>
            </div>

            <Button
              onPress={() => setSignedIn(true)}
              radius="full"
              className="h-[50px] w-full text-[15.5px] font-semibold text-white shadow-[0_10px_22px_-8px_rgba(241,80,34,0.6)]"
              style={{ background: "linear-gradient(155deg, #F15022, #FF8A5B)" }}
              endContent={<ArrowRight size={18} color="#fff" strokeWidth={2.2} />}
            >
              Sign in
            </Button>
          </AuthCard>
          <Link href="/signup" className={bottomLinkCx}>
            Not a customer? Get started today!
          </Link>
        </>
      )}
    </AuthLayout>
  );
}

