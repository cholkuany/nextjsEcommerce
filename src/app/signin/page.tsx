"use client";

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
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-md p-8 space-y-6">
        {/* Logo / Branding */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome to <span className="text-blue-600">ShopMate</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Sign in to your account
          </p>
        </div>

        {/* Error */}
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
                  className="w-full flex items-center justify-center gap-3 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 transition"
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

        {/* Optional: Divider */}
        <div className="relative text-center mt-4">
          <span className="text-xs text-gray-400">
            More sign-in options coming soon
          </span>
        </div>
      </div>
    </div>
  );
}
