import { RegistrationForm } from "../components/RegistrationForm";
import { SignInForm } from "../components/SignInForm";

type Props = {
  mode: "sign-up" | "sign-in";
  isMobile: boolean;
};
export function AuthPage({ mode, isMobile }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[2fr_1fr] h-screen">
      {mode === "sign-up" && <RegistrationForm isMobile={isMobile} />}
      {mode === "sign-in" && <SignInForm isMobile={isMobile} />}
    </div>
  );
}
