"use server";

import { signIn } from "@/auth";
import { redirect } from "next/navigation";
import { AuthError } from "next-auth";

const SIGNIN_ERROR_URL = "/signin";

export async function signInWithProvider(
  providerId: string,
  callbackUrl: string = "/"
) {
  try {
    await signIn(providerId, {
      redirectTo: callbackUrl,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return redirect(`${SIGNIN_ERROR_URL}?error=${error.type}`);
    }
    throw error;
  }
}
