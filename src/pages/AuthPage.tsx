import { RegistrationForm } from "../components/RegistrationForm";
import { SignInForm } from "../components/SignInForm";

type Props = {
  mode: "sign-up" | "sign-in";
  isMobile: boolean | null;
};
export function AuthPage({ mode, isMobile }: Props) {
  return (
    <div className={isMobile ? "flex justify-center rounded-md mx-10 py-8" : "flex justify-center rounded-md mx-72 py-8"}>
      {mode === "sign-up" && <RegistrationForm />}
      {mode === "sign-in" && <SignInForm />}
    </div>
  );
}
