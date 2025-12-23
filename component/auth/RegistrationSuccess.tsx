import { CheckCircle } from "lucide-react";
import Link from "next/link";

const RegistrationSuccess = () => {
  return (
    <div className="bg-white/5 p-8 w-full md:w-[28vw] space-y-6 rounded-xl shadow-md dark:shadow-none mx-auto">
      {/* Intro message */}
      <h1 className="text-center text-xl font-semibold text-gray-700 dark:text-gray-200">
        Registration Successful 🎉
      </h1>

      {/* Explanation */}
      <p className="text-center text-sm text-[#a2b1ca] px-4">
        Great job! Your account has been created successfully. To continue,
        please verify your email address. We’ve sent a confirmation link to your
        inbox.
      </p>

      {/* Icon */}
      <div className="flex justify-center">
        <CheckCircle className="text-green-500 w-16 h-16" />
      </div>

      {/* Warning message */}
      <p className="text-center text-xs text-red-500 font-medium px-6">
        ⚠️ You will not be able to login until your email is verified.
      </p>

      {/* Actions */}
      <div className="flex flex-col gap-3">
        <Link
          href="/login"
          className="w-full p-2 rounded-lg transition bg-yellow-500 text-white hover:bg-[#ffc500] duration-300 text-center"
        >
          Back to Login
        </Link>

        <p className="text-center text-xs text-gray-500 dark:text-gray-400">
          Didn’t receive the verification email?
          <Link
            href="/verify-email"
            className="text-blue-500 cursor-pointer hover:underline"
          >
            Resend email
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegistrationSuccess;
