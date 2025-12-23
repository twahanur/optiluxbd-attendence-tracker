/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUser } from "@/provider/AuthContext";
import { loginUser } from "@/service/auth";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type TLoginData = {
  identifier: string;
  password: string;
};
const Login = () => {
  const [open, setOpen] = useState(false);
  const { refetchUser, setIsLoading } = useUser();
  const router = useRouter();
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TLoginData>();

  const onSubmit = async (data: TLoginData) => {
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.identifier);
    const payload = {
      ...(isEmail ? { email: data.identifier } : { userId: data.identifier }),
      password: data.password,
    };
    const toastId = toast.loading("Logging in...");
    try {
      const res = await loginUser(payload);
      if (res?.success) {
        toast.success(res?.message, { id: toastId, duration: 3000 });
        setIsLoading(false);
        await refetchUser();
        reset();
        router.push("/");
      }
    } catch (error: any) {
      const errorInfo =
        error?.error ||
        error?.data?.errors[0]?.message ||
        error?.data?.message ||
        "Something went wrong!";
      toast.error(errorInfo, { id: toastId, duration: 3000 });
    }
  };

  return (
    <div className="flex items-center justify-center h-full">
      <Card className="w-full max-w-md bg-white/5 text-white">
        <CardHeader>
          <CardTitle>Employee Login</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email or user id*/}
            <div className="space-y-1">
              <Label>Email or use ID</Label>
              <Input
                type="text"
                placeholder="Enter email or user ID"
                {...register("identifier", {
                  required: "Email is required",
                })}
              />
              {errors.identifier && (
                <p className="text-sm text-red-500">
                  {errors.identifier.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1 relative">
              <Label>Password</Label>
              <Input
                type={open ? "text" : "password"}
                placeholder="Enter password"
                {...register("password", {
                  required: "Password is required",
                })}
              />
              <button
                type="button"
                onClick={() => setOpen(!open)}
                className="absolute right-2 top-7 text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100"
              >
                {open ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-white/5 cursor-pointer"
            >
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
