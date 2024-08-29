import { SignUp } from "@clerk/clerk-react";

export function SignUpPage() {
  return (
    <div className="flex justify-center my-14">
      <SignUp path="/sign-up" />
    </div>
  );
}
