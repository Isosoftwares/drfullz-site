import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiUser } from "react-icons/hi";
import { RiLockPasswordFill } from "react-icons/ri";
import { MdEmail } from "react-icons/md";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import axios from "../api/axios";
import { toast } from "react-toastify";
import PulseLoader from "react-spinners/PulseLoader";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FaTelegramPlane } from "react-icons/fa";
import hacker from "../assets/graphics/fafullz.jpg";
import logo from "../assets/graphics/fafullz-logo.jpg";

function Register() {
  const navigate = useNavigate();
  const [errMsg, setErrMsg] = useState("");
  const [visiblePassword, setVisiblePassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  // Signup function
  const registerUser = (registerData) => {
    return axios.post("/users", registerData);
  };

  const { mutate: registerMutate, isLoading: registerLoading } = useMutation(
    registerUser,
    {
      onSuccess: (response) => {
        reset();
        const text = response?.data?.message || "Registration Successful";
        toast.success(text);
        navigate("/");
      },
      onError: (err) => {
        const text = err?.response?.data?.message || "Registration Failed";
        setErrMsg(text);
        setTimeout(() => {
          setErrMsg("");
        }, 10000);

        if (!err.response?.data?.message) {
          toast.error("Something went wrong");
        }
      },
    }
  );

  const onSubmitting = (data) => {
    data.roles = "Buyer";
    data.accountType = "rarevision";
    registerMutate(data);
  };

  return (
    // MAIN BACKGROUND
    <div className="min-h-screen w-full bg-slate-950 flex flex-col justify-center items-center p-4 md:p-6">
      {/* CARD CONTAINER */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col lg:flex-row min-h-[600px]">
        {/* LEFT SIDE: IMAGE/BRANDING */}
        <div className="relative w-full lg:w-1/2 bg-slate-800 hidden lg:block">
          <img
            src={hacker}
            alt="Background"
            className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-slate-900/50"></div>

          <div className="absolute bottom-10 left-10 right-10 z-10">
            <h2 className="text-3xl font-bold text-white mb-2">
              Join the Community
            </h2>
            <p className="text-slate-400">
              Create your account to access DrFullz
              securely.
            </p>
          </div>
        </div>

        {/* RIGHT SIDE: FORM */}
        <div className="w-full lg:w-1/2 p-8 md:p-12 flex flex-col justify-center relative">
          {/* Telegram Floating Button (Top Right) */}
          <a
            href="https://t.me/DrFullzBot"
            target="_blank"
            rel="noreferrer"
            className="absolute top-4 right-4 text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-2 text-sm font-medium"
          >
            <FaTelegramPlane size={18} />
            <span className="hidden sm:inline">Support</span>
          </a>

          {/* Logo & Header */}
          <div className="flex flex-col items-center mb-6">
            <img
              src={logo}
              alt="Logo"
              className="h-12 w-auto mb-3 rounded-md"
            />
            <h1 className="text-3xl font-bold text-white tracking-wide">
              DrFullz
            </h1>
            <p className="text-slate-500 text-sm mt-1">Create a new account</p>
          </div>

          <form onSubmit={handleSubmit(onSubmitting)} className="space-y-5">
            {/* Error Message */}
            {errMsg && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-sm text-center">
                {errMsg}
              </div>
            )}

            {/* Username Input */}
            <div className="space-y-1">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                  <HiUser size={20} />
                </div>
                <input
                  type="text"
                  placeholder="Username "
                  className="w-full bg-slate-800 text-white pl-10 pr-4 py-3 rounded-lg border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder-slate-500"
                  {...register("userName", { required: true })}
                />
              </div>
              {errors.userName?.type === "required" && (
                <span className="text-red-500 text-xs pl-1">
                  Username is required
                </span>
              )}
            </div>

            {/* Jabber/Email Input */}
            <div className="space-y-1">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                  <MdEmail size={20} />
                </div>
                <input
                  type="text"
                  placeholder="Email or Jabber ID"
                  className="w-full bg-slate-800 text-white pl-10 pr-4 py-3 rounded-lg border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder-slate-500"
                  {...register("jabberId", { required: true })}
                />
              </div>
              {errors.jabberId?.type === "required" && (
                <span className="text-red-500 text-xs pl-1">
                  Jabber ID/Email is required
                </span>
              )}
            </div>

            {/* Password Input */}
            <div className="space-y-1">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                  <RiLockPasswordFill size={20} />
                </div>
                <input
                  type={visiblePassword ? "text" : "password"}
                  placeholder="Password"
                  className="w-full bg-slate-800 text-white pl-10 pr-10 py-3 rounded-lg border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder-slate-500"
                  {...register("password", { required: true })}
                />
                <div
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-slate-400 hover:text-white transition-colors"
                  onClick={() => setVisiblePassword(!visiblePassword)}
                >
                  {visiblePassword ? (
                    <AiOutlineEyeInvisible size={20} />
                  ) : (
                    <AiOutlineEye size={20} />
                  )}
                </div>
              </div>
              {errors.password?.type === "required" && (
                <span className="text-red-500 text-xs pl-1">
                  Password is required
                </span>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              {registerLoading ? (
                <div className="flex justify-center py-2">
                  <PulseLoader color="#3b82f6" size={10} />
                </div>
              ) : (
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.01] shadow-lg shadow-blue-900/20">
                  Register
                </button>
              )}
            </div>

            {/* Back to Login Link */}
            <div className="text-center mt-4">
              <p className="text-slate-400 text-sm">
                Already have an account?{" "}
                <Link
                  to="/"
                  className="text-blue-500 hover:text-blue-400 font-medium hover:underline"
                >
                  Back to Login
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Mobile Telegram Footer (Visible only on small screens) */}
      <a
        href="https://t.me/DrFullzBot"
        target="_blank"
        className="mt-6 lg:hidden flex items-center gap-2 text-slate-400 hover:text-blue-400 transition-colors"
      >
        <FaTelegramPlane />
        <span>Join us on Telegram</span>
      </a>
    </div>
  );
}

export default Register;
