import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { HiUser } from "react-icons/hi";
import { RiLockPasswordFill } from "react-icons/ri";
import hacker from "../assets/graphics/fafullz.jpg";
import logo from "../assets/graphics/fafullz-logo.jpg";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import axios from "../api/axios";
import { toast } from "react-toastify";
import PulseLoader from "react-spinners/PulseLoader";
import useAuth from "../hooks/useAuth";
import { Alert } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import { FaTelegramPlane } from "react-icons/fa";
import { GiStarKey } from "react-icons/gi";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import {
  loadCaptchaEnginge,
  LoadCanvasTemplate,
  validateCaptcha,
} from "react-simple-captcha";

function LoginPage() {
  const navigate = useNavigate();
  const [errMsg, setErrMsg] = useState("");
  const { setAuth } = useAuth();
  const location = useLocation();
  const toDash = location.state?.from?.pathname || "/dash";
  const toSellerDash = location.state?.from?.pathname || "/seller-dash";
  const toAdminDash = location.state?.from?.pathname || "/admin-dash";
  const [inActive, setInActive] = useState(false);
  const [captchaValue, setCaptchaValue] = useState("");
  const [visiblePassword, setVisiblePassword] = useState(false);

  useEffect(() => {
    loadCaptchaEnginge(8);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const login = (loginData) => {
    return axios.post("/auth", loginData);
  };

  const { mutate: loginMutate, isLoading: loginLoading } = useMutation(login, {
    onSuccess: (response) => {
      reset();
      const accessToken = response?.data?.accessToken;
      const roles = response?.data?.roles;
      const userId = response?.data?.user_Id;
      const userName = response?.data?.userName;
      const jabberId = response?.data?.jabberId;
      const status = response?.data?.status;
      const categories = response?.data?.categories || [];

      const text = `Welcome back ${userName}` || "Welcome back";
      if (roles?.includes("Buyer")) {
        navigate(toDash, { replace: true });
      } else if (roles?.includes("Seller")) {
        navigate(toSellerDash, { replace: true });
      } else if (roles?.includes("Admin") || roles?.includes("Manager")) {
        navigate(toAdminDash, { replace: true });
      } else {
        navigate("/login");
        toast.success("Unauthorized");
      }
      toast.success(text);
      localStorage.setItem("userId", JSON.stringify(userId));
      setAuth({
        roles,
        accessToken,
        userId,
        userName,
        jabberId,
        status,
        categories,
      });
    },
    onError: (err) => {
      console.log(err?.response?.data?.message);
      const text = err?.response?.data?.message || "Login Failed";
      if (text === "Inactive") {
        setInActive(true);
      }
      setErrMsg(text);
      setTimeout(() => {
        setErrMsg("");
      }, 20000);
      if (!err.response.data.message) {
        toast.error("something went wrong");
      }
    },
  });

  const onSubmitting = (data) => {
    data.accountType = "rarevision";

    if (validateCaptcha(captchaValue) === true) {
      loginMutate(data);
    } else {
      toast.error("Captcha Does Not Match");
      setCaptchaValue("");
    }
  };

  return (
    // MAIN BACKGROUND
    <div className="min-h-screen w-full bg-slate-950 flex flex-col justify-center items-center p-4 md:p-6">
      {/* ALERT SECTION */}
      <div className={`w-full max-w-4xl mb-4 ${inActive ? "block" : "hidden"}`}>
        <Alert
          icon={<IconAlertCircle size="1rem" />}
          title="Inactive User"
          color="lime"
          variant="filled"
          radius="md"
        >
          Contact admin to activate your account. Admin Jabber Id:
        </Alert>
      </div>

      {/* LOGIN CARD CONTAINER */}
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
            <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-slate-400">Securely access DrFullz.</p>
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
          <div className="flex flex-col items-center mb-8">
            <img
              src={logo}
              alt="Logo"
              className="h-12 w-auto mb-3 rounded-md"
            />
            <h1 className="text-3xl font-bold text-white tracking-wide">
              DrFullz
            </h1>
            <p className="text-slate-500 text-sm mt-1">Sign in to continue</p>
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
                  placeholder="Username"
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

            {/* Captcha Section */}
            <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 space-y-3">
              <div className="flex justify-center bg-slate-700 py-2 rounded">
                {/* Note: reloadColor handles the refresh icon color in react-simple-captcha */}
                <LoadCanvasTemplate reloadColor="white" />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <GiStarKey size={18} />
                </div>
                <input
                  type="text"
                  placeholder="Enter Captcha"
                  className="w-full bg-slate-900 text-white pl-10 pr-4 py-2 rounded border border-slate-600 focus:border-blue-500 outline-none text-sm placeholder-slate-500"
                  value={captchaValue}
                  onChange={(e) => setCaptchaValue(e.target.value)}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2">
              {loginLoading ? (
                <div className="flex justify-center py-2">
                  <PulseLoader color="#3b82f6" size={10} />
                </div>
              ) : (
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.01] shadow-lg shadow-blue-900/20">
                  Login
                </button>
              )}
            </div>

            {/* Register Link */}
            <div className="text-center">
              <p className="text-slate-400 text-sm">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-blue-500 hover:text-blue-400 font-medium hover:underline"
                >
                  Create one here
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

export default LoginPage;
