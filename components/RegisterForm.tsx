"use client";

import {
  Field,
  FieldDescription,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
} from "@/components/ui/input-group";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { MailIcon, LockKeyholeIcon, EyeIcon, EyeOffIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Github, Facebook, Globe, Apple } from "lucide-react"; // Google replaced with Globe

export default function RegisterForm({ onSuccess }: { onSuccess?: () => void }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const formSchema = z
    .object({
      "text-input-0": z.string().nonempty("Name is required"),
      "email-input-0": z
        .string()
        .nonempty("Email is required")
        .email("Please enter a valid email address"),
      "password-input-0": z
        .string()
        .min(6, "Password must be at least 6 characters"),
      "password-input-1": z.string().nonempty("Please confirm your password"),
    })
    .refine((data) => data["password-input-0"] === data["password-input-1"], {
      message: "Passwords do not match",
      path: ["password-input-1"],
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      "text-input-0": "",
      "email-input-0": "",
      "password-input-0": "",
      "password-input-1": "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Submitted Values:", values);
    if (onSuccess) onSuccess();
    form.reset();
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-12 gap-4">
        {/* Name */}
        <Controller
          control={form.control}
          name="text-input-0"
          render={({ field, fieldState }) => (
            <Field className="col-span-12 flex flex-col gap-1" data-invalid={fieldState.invalid}>
              <FieldLabel>Name</FieldLabel>
              <Input {...field} placeholder="Enter your full name" />
      
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Email */}
        <Controller
          control={form.control}
          name="email-input-0"
          render={({ field, fieldState }) => (
            <Field className="col-span-12 flex flex-col gap-1" data-invalid={fieldState.invalid}>
              <FieldLabel>Email</FieldLabel>
              <InputGroup>
                <InputGroupInput {...field} type="email" placeholder="your@email.com" />
                <InputGroupAddon align="inline-start">
                  <MailIcon className="size-4" strokeWidth={2} />
                </InputGroupAddon>
              </InputGroup>
           
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Password */}
        <Controller
          control={form.control}
          name="password-input-0"
          render={({ field, fieldState }) => (
            <Field className="col-span-12 flex flex-col gap-1" data-invalid={fieldState.invalid}>
              <FieldLabel>Password</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  {...field}
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                />
                <InputGroupAddon align="inline-start">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-1"
                  >
                    {showPassword ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
                  </button>
                </InputGroupAddon>
              </InputGroup>
              <FieldDescription>Must be at least 6 characters</FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Confirm Password */}
        <Controller
          control={form.control}
          name="password-input-1"
          render={({ field, fieldState }) => (
            <Field className="col-span-12 flex flex-col gap-1" data-invalid={fieldState.invalid}>
              <FieldLabel>Confirm Password</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  {...field}
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm password"
                />
                <InputGroupAddon align="inline-start">
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="p-1"
                  >
                    {showConfirmPassword ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
                  </button>
                </InputGroupAddon>
              </InputGroup>
              <FieldDescription>Must match the password entered above</FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Submit */}
        <div className="col-span-12">
          <Button type="submit" className="w-full bg-green-700 hover:bg-green-800 text-white">
            Create Account
          </Button>
        </div>

        {/* Already have account */}
        <div className="col-span-12 text-center text-sm text-gray-600 mt-2">
          Already have an account? <a href="/login" className="text-green-700 font-semibold">Sign in here</a>
        </div>

        {/* Or continue with */}
        <div className="col-span-12 text-center text-sm text-gray-500 mt-2">
          Or continue with
        </div>

        {/* Social Buttons */}
        <div className="col-span-12 flex justify-center gap-4 mt-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Facebook className="size-4" /> Facebook
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Globe className="size-4" /> Google
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Apple className="size-4" /> Apple
          </Button>
        </div>
      </div>
    </form>
  );
}
