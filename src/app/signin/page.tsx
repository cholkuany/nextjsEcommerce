"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { signInWithProvider } from "./authAction";
import { providerMap } from "@/auth.config";

export default function SignInPage() {
  const searchParams = useSearchParams();
  const errorType = searchParams.get("error");
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";

  const errorMessages = {
    CredentialsSignin: "Invalid email or password.",
    OAuthSignin: "OAuth sign-in failed. Please try another method.",
    OAuthCallback: "OAuth callback failed. Please try again.",
    OAuthCreateAccount: "Could not create account with OAuth provider.",
    EmailSignin: "Email sign-in link could not be sent. Try again.",
    Callback: "A callback handler failed. Please try again.",
    Configuration: "Authentication configuration error.",
    AccessDenied: "Access denied. You might not have permission.",
    Verification: "The sign-in link is invalid or has expired.",
    default: "An unknown error occurred. Please try again.",
  };

  const errorMessage =
    errorType && errorMessages[errorType as keyof typeof errorMessages]
      ? errorMessages[errorType as keyof typeof errorMessages]
      : null;

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.05)] p-8 space-y-6">
        {/* Logo and Branding */}
        <div className="text-center">
          <div className="mx-auto mb-4 flex justify-center rounded-full">
            <Image
              src="/logo.png"
              alt="ShopMate Logo"
              width={124}
              height={124}
              priority
              className="h-32 w-32 rounded-full"
            />
          </div>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Sign in to continue
          </p>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm">
            <p>{errorMessage}</p>
          </div>
        )}

        {/* OAuth Buttons */}
        <div className="space-y-3">
          {providerMap.map((provider) => {
            const Icon = provider.icon;
            return (
              <form
                key={provider.id}
                action={signInWithProvider.bind(null, provider.id, callbackUrl)}
              >
                <button
                  type="submit"
                  className="w-60 mx-auto flex items-center justify-center gap-3 px-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-800 hover:bg-gray-200 transition-all duration-300"
                >
                  {Icon && <Icon size={20} />}
                  <span className="text-sm font-medium">
                    Sign in with {provider.name}
                  </span>
                </button>
              </form>
            );
          })}
        </div>
      </div>
    </div>
  );
}
