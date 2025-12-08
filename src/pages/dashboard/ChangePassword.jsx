import React from "react";
import { RiLockPasswordFill, RiEyeLine, RiEyeOffLine } from "react-icons/ri";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import useAuth from "../../hooks/useAuth";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { toast } from "react-toastify";
import PulseLoader from "react-spinners/PulseLoader";
import { FaShieldAlt } from "react-icons/fa";

function ChangePassword() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const axios = useAxiosPrivate();
  const { auth } = useAuth();

  // --- Logic remains unchanged ---
  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters"),
    confirmPassword: Yup.string()
      .required("Confirm Password is required")
      .oneOf([Yup.ref("password")], "Passwords must match"),
  });
  const formOptions = { resolver: yupResolver(validationSchema) };

  const { register, handleSubmit, reset, formState } = useForm(formOptions);
  const { errors } = formState;

  const changePassword = (data) => {
    return axios.patch(`/users/${auth?.userId}`, data);
  };

  const { mutate: changePassMutate, isLoading: loadingChangePass } =
    useMutation(changePassword, {
      onSuccess: (response) => {
        const text = response?.data?.message;
        toast.success(text);
        reset();
      },
      onError: (err) => {
        const text = err?.response?.data?.message || "Something went wrong";
        toast.error(text);
      },
    });

  const handlePasswordChange = (data) => {
    changePassMutate(data);
  };

  return (
    <div className="min-h-[80vh] bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Main Card */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-slate-950/50 px-8 py-8 border-b border-slate-700 text-center">
            <div className="inline-flex items-center justify-center p-4 bg-slate-800 rounded-full shadow-lg shadow-blue-900/20 mb-4 border border-slate-700">
              <RiLockPasswordFill className="text-blue-500 text-3xl" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Change Password
            </h1>
            <p className="text-slate-400 text-sm mt-2">
              Update your credentials to keep your account secure.
            </p>
          </div>

          {/* Form */}
          <div className="px-8 py-8">
            <div className="space-y-6">
              {/* New Password Field */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
                  New Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <RiLockPasswordFill className="text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    name="password"
                    autoComplete="off"
                    placeholder="Enter new password"
                    className="w-full bg-slate-950 text-white pl-11 pr-12 py-3.5 rounded-xl border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder-slate-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-blue-400 transition-colors cursor-pointer"
                  >
                    {showPassword ? (
                      <RiEyeOffLine size={20} />
                    ) : (
                      <RiEyeLine size={20} />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-400 text-xs pl-1 flex items-center gap-1.5 animate-pulse">
                    <span className="w-1.5 h-1.5 bg-red-400 rounded-full"></span>
                    {errors.password?.message}
                  </p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
                  Confirm Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <RiLockPasswordFill className="text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    {...register("confirmPassword")}
                    autoComplete="off"
                    placeholder="Confirm new password"
                    className="w-full bg-slate-950 text-white pl-11 pr-12 py-3.5 rounded-xl border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder-slate-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-blue-400 transition-colors cursor-pointer"
                  >
                    {showConfirmPassword ? (
                      <RiEyeOffLine size={20} />
                    ) : (
                      <RiEyeLine size={20} />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-400 text-xs pl-1 flex items-center gap-1.5 animate-pulse">
                    <span className="w-1.5 h-1.5 bg-red-400 rounded-full"></span>
                    {errors.confirmPassword?.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                {loadingChangePass ? (
                  <div className="w-full bg-slate-700 rounded-xl py-3.5 flex justify-center items-center cursor-not-allowed border border-slate-600">
                    <PulseLoader color="#94a3b8" size={8} />
                  </div>
                ) : (
                  <button
                    onClick={handleSubmit(handlePasswordChange)}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3.5 rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg shadow-blue-900/20 active:scale-[0.98]"
                  >
                    Update Password
                  </button>
                )}
              </div>
            </div>

            {/* Security Tips */}
            <div className="mt-8 p-5 bg-slate-900/50 rounded-xl border border-slate-700/50">
              <div className="flex items-center gap-2 mb-3 text-slate-300">
                <FaShieldAlt className="text-green-500" />
                <h3 className="text-sm font-bold uppercase tracking-wide">
                  Security Requirements
                </h3>
              </div>
              <ul className="text-xs text-slate-400 space-y-2 pl-1">
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-slate-500 rounded-full"></span>
                  Minimum 8 characters long
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-slate-500 rounded-full"></span>
                  Must contain uppercase & lowercase
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-slate-500 rounded-full"></span>
                  Include numbers & symbols (e.g. !@#$)
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChangePassword;
