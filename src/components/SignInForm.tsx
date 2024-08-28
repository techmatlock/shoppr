"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Link } from "react-router-dom";

const formSchema = z.object({
  username: z.string().min(4, {
    message: "Username must be at least 4 characters.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

type Props = {
  isMobile: boolean;
};

export function SignInForm({ isMobile }: Props) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }
  return (
    <>
      {!isMobile && (
        <>
          <div className="bg-gradient-to-r from-cyan-500 to-blue-500"></div>
          <div className="flex flex-col items-center mt-12">
            <h1 className="text-2xl mb-4">Welcome back!</h1>
            <FormProvider {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-black">Username</FormLabel>
                      <FormControl>
                        <Input placeholder="rsmith83" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-black">Password</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex flex-col justify-center space-y-4">
                  <Button type="submit" className="px-24">
                    Submit
                  </Button>
                  <Button type="submit" className="px-24">
                    Continue with Google
                  </Button>
                </div>
              </form>
            </FormProvider>
            <p className="mt-4">
              Don't have an account?{" "}
              <Link to="/sign-up" className="text-blue-500">
                Register here
              </Link>
            </p>
          </div>
        </>
      )}
      {isMobile && (
        <>
          <div className="flex flex-col items-center mt-12">
            <h1 className="text-2xl mb-4">Welcome back!</h1>
            <FormProvider {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-black">Username</FormLabel>
                      <FormControl>
                        <Input placeholder="rsmith83" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-black">Password</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex flex-col justify-center space-y-4">
                  <Button type="submit" className="px-24">
                    Submit
                  </Button>
                  <Button type="submit" className="px-24">
                    Continue with Google
                  </Button>
                </div>
              </form>
            </FormProvider>
            <p className="mt-4">
              Don't have an account?{" "}
              <Link to="/sign-up" className="text-blue-500">
                Register here
              </Link>
            </p>
          </div>
        </>
      )}
    </>
  );
}
