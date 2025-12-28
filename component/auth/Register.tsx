"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import RegistrationSuccess from "./RegistrationSuccess";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { Label } from "@/components/ui/label";

type TSection =
  | "Office Staff"
  | "Group Leader"
  | "Customer Service"
  | "Instructor"
  | "Web Developer"
  | "Digital Marketer"
  | "Graphics Designer"
  | "WordpPress Designer"
  | "Video Editor (Remote)";

const sections: TSection[] = [
  "Office Staff",
  "Group Leader",
  "Customer Service",
  "Instructor",
  "Web Developer",
  "Digital Marketer",
  "Graphics Designer",
  "WordpPress Designer",
  "Video Editor (Remote)",
];

type TRegistrationData = {
  name: string;
  email: string;
  password: string;
  employeeID: string;
  section: TSection;
  shift: "Day" | "Night";
};

const Registration = () => {
  const [open] = useState(false);
  const [show, setShow] = useState(false);
  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm<TRegistrationData>();

  const onSubmit = async (data: TRegistrationData) => {
    console.log(data);

    // try {
    //   const res = await registration(payload).unwrap();
    //   if (res?.success) {
    //     toast.success(res?.message, { duration: 3000 });
    //     setOpen(true);
    //     reset();
    //   }
    // } catch (error: any) {
    //   const errorInfo =
    //     error?.error ||
    //     error?.data?.errors[0]?.message ||
    //     error?.data?.message ||
    //     "Something went wrong!";
    //   toast.error(errorInfo, { duration: 3000 });
    // }
  };

  return (
    <div className="h-full">
      {open ? (
        <RegistrationSuccess />
      ) : (
        <div className="flex items-center justify-center h-full">
          <Card className="w-full max-w-md bg-white/5 text-white">
            <CardHeader>
              <CardTitle>Employee Registration</CardTitle>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Name */}
                <div className="space-y-1">
                  <Label>Name</Label>
                  <Input
                    {...register("name", { required: "Name is required" })}
                    placeholder="Enter name"
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    placeholder="Enter email"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: "Invalid email address",
                      },
                    })}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Employee ID */}
                <div className="space-y-1">
                  <Label>Employee ID</Label>
                  <Input
                    placeholder="Enter Employee ID"
                    {...register("employeeID", {
                      required: "Employee ID is required",
                    })}
                  />
                  {errors.employeeID && (
                    <p className="text-sm text-red-500">
                      {errors.employeeID.message}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  {/* Section */}
                  <div className="space-y-1">
                    <Label>Section</Label>
                    <Select
                      onValueChange={(value) =>
                        setValue("section", value as TSection)
                      }>
                      <SelectTrigger className="cursor-pointer">
                        <SelectValue placeholder="Select section" />
                      </SelectTrigger>
                      <SelectContent>
                        {sections.map((section) => (
                          <SelectItem key={section} value={section}>
                            {section}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.section && (
                      <p className="text-sm text-red-500">
                        Section is required
                      </p>
                    )}
                  </div>

                  {/* Shift */}
                  <div className="space-y-1">
                    <Label>Shift</Label>
                    <Select
                      onValueChange={(value) =>
                        setValue("shift", value as "Day" | "Night")
                      }>
                      <SelectTrigger className="cursor-pointer">
                        <SelectValue placeholder="Select shift" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Day">Day</SelectItem>
                        <SelectItem value="Night">Night</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.shift && (
                      <p className="text-sm text-red-500">Shift is required</p>
                    )}
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1 relative">
                  <Label>Password</Label>
                  <Input
                    type={show ? "text" : "password"}
                    placeholder="Enter password"
                    {...register("password", {
                      required: "Password is required",
                      validate: (value) => {
                        if (value.length < 8)
                          return "Password must be at least 8 characters";
                        if (!/[A-Z]/.test(value))
                          return "Must contain one uppercase letter";
                        if (!/[a-z]/.test(value))
                          return "Must contain one lowercase letter";
                        if (!/[0-9]/.test(value))
                          return "Must contain one number";
                        if (!/[!@#$%^&*]/.test(value))
                          return "Must contain one special character";
                        return true;
                      },
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShow(!show)}
                    className="absolute right-2 top-7 text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100">
                    {show ? <EyeOff size={18} /> : <Eye size={18} />}
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
                  className="w-full bg-white/5 cursor-pointer">
                  Register
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Registration;
