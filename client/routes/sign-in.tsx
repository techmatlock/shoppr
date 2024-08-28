import { SignIn } from "@clerk/clerk-react";

export default function SignInPage() {
  return (
    <div className="flex justify-center my-14">
      <SignIn path="/sign-in" />
    </div>
  );
}
