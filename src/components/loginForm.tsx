/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const LoginForm = () => {
  const [formData, setFormData] = useState<{ email: string; password: string }>(
    {
      email: "",
      password: "",
    }
  );

  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      console.log("All fields are required");
      return;
    }
    try {
      await login(formData.email, formData.password);
      toast.success("Login successful");
      router.push("/");
      router.refresh();
    } catch (error: any) {
      toast.error(error || "Login failed");
    }
  };

  return (
    <div className="w-full mt-4">
      <form className="flex flex-col gap-4" onSubmit={handleLogin}>
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
          />
        </div>
        <Button className="py-5 mt-4">Login</Button>
        <p className="dark:text-white/60 mt-4 text-sm text-center text-gray-600">
          {"Don't"} have an account?{" "}
          <a href="/register" className="text-primary font-semibold">
            Sign up
          </a>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;
