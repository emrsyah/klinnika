"use client";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AppIcon from "@/components/AppIcon";
import { signIn } from "next-auth/react";

const formSchema = z.object({
  email: z.string().email({message: "Input valid email"}),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

const Login = () => {

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    const email = values.email;
    const password = values.password;
    const res = await signIn("credentials", {
      email,
      password,
      callbackUrl: "/clinic"
    });
    if(!res?.ok){
      // console.log("salahnya")
      // toast.error("Email atau password salah", {autoClose: 1500})
    }
  }

  return (
    <div className="max-w-lg flex items-center mx-auto my-32">
      <div className="w-full flex items-center flex-col gap-4">
        <AppIcon />
        <h1 className="text-blue-900 mrt font-extrabold text-2xl mt-4">Selamat Datang Kembali</h1>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex items-center gap-2 flex-col w-full"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="something@email.com" {...field} />
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
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="something secret" {...field} type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="mt-4 w-full">Masuk</Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Login;
