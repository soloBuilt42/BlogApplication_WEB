import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google";
import { toast } from "sonner";
import Button from "./Button";
import { googleSignup } from "../utils/apiCalls";

/**
 * Rendered only when VITE_GOOGLE_CLIENT_ID is configured, because
 * useGoogleLogin requires the surrounding GoogleOAuthProvider.
 */
const GoogleAuthButton = ({ label = "Continue with Google", onSuccess }) => {
  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const profileRes = await fetch(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } }
        );

        if (!profileRes.ok) throw new Error("Could not read your Google profile");

        const profile = await profileRes.json();

        const result = await googleSignup({
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          emailVerified: profile.email_verified,
        });

        onSuccess?.(result);
      } catch (error) {
        toast.error(error.message);
      }
    },
    onError: () => toast.error("Google sign in failed"),
  });

  return (
    <Button
      label={label}
      icon={<FcGoogle />}
      onClick={() => login()}
      styles='w-full flex flex-row-reverse gap-4 bg-white dark:bg-transparent text-black dark:text-white px-5 py-2.5 rounded-full border border-gray-300 dark:border-gray-600'
    />
  );
};

export default GoogleAuthButton;
