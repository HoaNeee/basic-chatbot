/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const RegisterForm = () => {
  const [formData, setFormData] = useState<{
    email: string;
    password: string;
    confirmPassword: string;
  }>({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { register } = useAuth();
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      toast.error("All fields are required");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      await register(formData.email, formData.password);
      toast.success("Registration successful");
      router.push("/login");
      router.refresh();
    } catch (error: any) {
      toast.error(error || "Registration failed");
    }
  };

  return (
    <div className="w-full mt-4">
      <form
        className="flex flex-col gap-4"
        onSubmit={handleRegister}
        autoComplete="off"
      >
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            placeholder="Enter your email"
            required
            className="py-5"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            autoComplete="new-email"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            placeholder="Enter your password"
            type="password"
            required
            className="autofill:bg-gray-200 py-5"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            autoComplete="new-password"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            placeholder="Confirm your password"
            type="password"
            required
            className="autofill:bg-gray-200 py-5"
            value={formData.confirmPassword}
            onChange={(e) =>
              setFormData({ ...formData, confirmPassword: e.target.value })
            }
            autoComplete="new-confirmPassword"
          />
        </div>
        <Button className="py-5 mt-4">Register</Button>
        <p className="dark:text-white/60 mt-4 text-sm text-center text-gray-600">
          {"Already have an account?"}{" "}
          <a href="/login" className="text-primary font-semibold">
            Sign in
          </a>
        </p>
      </form>
    </div>
  );
};

export default RegisterForm;
