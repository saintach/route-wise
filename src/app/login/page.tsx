import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { UserAuthForm } from "./components/UserAuthForm";

export const metadata: Metadata = {
  title: "Authentication",
  description: "Authentication forms built using the components.",
};

export default function AuthenticationPage() {
  return (
    <>
      <div className="container relative hidden h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <Link
          href="/examples/authentication"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "absolute right-4 top-4 md:right-8 md:top-8"
          )}
        >
          Login
        </Link>
        <div className="relative hidden h-full flex-col p-10 text-white dark:border-r lg:flex">
          <div className="absolute inset-0 bg-[url('/unsplash.jpg')] bg-cover" />
          <div className="relative z-20 flex items-center text-3xl font-bold">
            <Image
              className="mr-2"
              src="/logo.png"
              alt="logo"
              width={50}
              height={50}
            />
            <div> Route Wise</div>
          </div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <footer className="text-sm">
                Photo by{" "}
                <a href="https://unsplash.com/@ross_sokolovski?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">
                  Ross Sokolovski
                </a>{" "}
                on{" "}
                <a href="https://unsplash.com/photos/winding-asphalt-road-surrounded-by-tall-trees-aerial-photography-cWu504_3z7A?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">
                  Unsplash
                </a>
              </footer>
            </blockquote>
          </div>
        </div>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Create an account
              </h1>
              <p className="text-sm text-muted-foreground">
                Enter your email below to create your account
              </p>
            </div>
            <UserAuthForm />
            <p className="px-8 text-center text-sm text-muted-foreground">
              By clicking continue, you agree to our{" "}
              <Link
                href="/terms"
                className="underline underline-offset-4 hover:text-primary"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="underline underline-offset-4 hover:text-primary"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
