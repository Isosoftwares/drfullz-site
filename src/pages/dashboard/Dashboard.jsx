import React, { useState, useEffect } from "react";
import { FaBars, FaCartArrowDown, FaSearch } from "react-icons/fa";
import { FaTelegramPlane } from "react-icons/fa";
import { Link, NavLink, Outlet } from "react-router-dom";
import { CgShoppingCart } from "react-icons/cg";
import {
  AiOutlineClose,
  AiFillCreditCard,
  AiOutlineCaretDown,
} from "react-icons/ai";
import { FaRobot } from "react-icons/fa";
import { BiBitcoin, BiNews, BiSupport } from "react-icons/bi";
import { TbMessageCircle } from "react-icons/tb";
import ProfileDropDown from "../../components/ProfileDropDown";
import logo from "../../assets/graphics/fafullz-logo.jpg";
import useAuth from "../../hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { Indicator } from "@mantine/core";
import { MdMessage } from "react-icons/md";

function Dashboard() {
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();
  const userName = auth?.user?.username || "username";

  // -- Queries (Cart, Payment, Messages) --
  // Cart Query
  const { data: cartData } = useQuery(
    [`shoppingCart-${auth?.userId}`],
    async () => {
      const { data } = await axiosPrivate.get(`/cart`);
      return data;
    },
    { keepPreviousData: true }
  );
  const totalItems = cartData?.cart?.items?.length || 0;

  // Payments Query
  const { data: paymentsData } = useQuery(
    [`profile-${auth?.userId}`],
    () => axiosPrivate.get(`/users/profile/own`),
    { keepPreviousData: true, retry: 0 }
  );

  // -- UI State --
  const [isOpen, setIsOpen] = useState(true);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [dropdown, setDropdown] = useState(false);

  // Resize Logic
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 1024 && isOpen) setIsOpen(false);
    }
    window.addEventListener("resize", handleResize);
    handleResize(); // Check on mount
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Removed isOpen dependency to prevent loop, logic handles initial check

  const toggleSidebar = () => setIsOpen(!isOpen);

  const formatCurrency = (number) => {
    return Number.parseFloat(number || 0)
      .toFixed(2)
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const menuItem = [
    { path: "ssn", name: "SSN/DOB", icon: <AiFillCreditCard size={22} /> },
    { path: "news", name: "Updates", icon: <BiNews size={22} /> },
    { path: "addfunds", name: "Add Funds", icon: <BiBitcoin size={22} /> },
    {
      path: "my-orders",
      name: "My Orders",
      icon: <FaCartArrowDown size={22} />,
    },
    { path: "support", name: "Contact", icon: <MdMessage size={22} /> },
  ];

  // CTA Button Component
  const CTAButton = ({
    onClick,
    icon: Icon,
    label,
    variant = "primary",
    size = "default",
    className = "",
  }) => {
    const baseStyle =
      "flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 transform hover:-translate-y-0.5 shadow-lg active:translate-y-0";

    const variants = {
      primary:
        "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-500/20",
      secondary:
        "bg-slate-700 hover:bg-slate-600 text-white border border-slate-600",
      telegram:
        "bg-[#229ED9] hover:bg-[#1f8ubc] text-white shadow-[#229ED9]/20", // Official Telegram Color
    };

    const sizes = {
      small: "px-3 py-1.5 text-xs",
      default: "px-4 py-2 text-sm",
      icon: "p-2",
    };

    return (
      <button
        onClick={onClick}
        className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      >
        {Icon && <Icon size={size === "icon" ? 20 : 16} />}
        {size !== "icon" && <span>{label}</span>}
      </button>
    );
  };

  return (
    <div className="bg-slate-900 min-h-screen font-sans text-slate-200 selection:bg-blue-500/30">
      {/* --- TOP NAVBAR --- */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 transition-all duration-300">
        <div className="px-4 h-full flex items-center justify-between">
          {/* Left: Brand & Sidebar Toggle */}
          <div className="flex items-center gap-4">
            {/* Desktop Toggle */}
            <button
              onClick={toggleSidebar}
              className="hidden lg:flex p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
            >
              <FaBars size={20} />
            </button>

            {/* Mobile Toggle */}
            <button
              onClick={() => setMobileMenu(!mobileMenu)}
              className="lg:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
            >
              <FaBars size={20} />
            </button>

            {/* Logo */}
            <Link to="/dash" className="flex items-center gap-3 group">
              <img
                src={logo}
                alt="Logo"
                className="w-9 h-9 rounded-lg shadow-sm"
              />
              <span className="hidden sm:block text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 tracking-tight group-hover:to-white transition-all">
                DrFullz
              </span>
            </Link>
          </div>

          {/* Right: Actions & Profile */}
          <div className="flex items-center gap-3 sm:gap-6">
            {/* Desktop CTAs */}
            <div className="hidden md:flex items-center gap-3 mr-2">
              <CTAButton
                onClick={() => window.open("https://t.me/DrFullzBot", "_blank")}
                icon={FaRobot}
                label="Bot"
                variant="primary"
                size="small"
              />
              <CTAButton
                onClick={() => window.open("https://t.me/dr_fullz", "_blank")}
                icon={FaTelegramPlane}
                label="Channel"
                variant="telegram"
                size="small"
              />
            </div>

            <div className="h-6 w-px bg-slate-700 hidden md:block"></div>

            {/* Icons: Messages & Cart */}
            <div className="flex items-center gap-2">
              <Link
                to="/dash/support"
                className="p-2 text-slate-400 hover:text-blue-400 transition-colors relative"
              >
                <TbMessageCircle size={24} />
              </Link>

              <Link
                to="cart"
                className="p-2 text-slate-400 hover:text-blue-400 transition-colors relative"
              >
                <Indicator
                  inline
                  disabled={!totalItems}
                  label={totalItems}
                  size={16}
                  color="blue"
                  offset={4}
                >
                  <CgShoppingCart size={24} />
                </Indicator>
              </Link>
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropdown(!dropdown)}
                className="flex items-center gap-3 pl-3 pr-2 py-1.5 rounded-full hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-700"
              >
                <div className=" flex-col items-end hidden sm:flex">
                  <span className="text-sm font-bold text-green-400 font-mono">
                    ${formatCurrency(paymentsData?.data?.data?.balance)}
                  </span>
                </div>

                {/* Avatar Placeholder / Initial */}
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-900/20">
                  {userName.charAt(0).toUpperCase()}
                </div>

                <AiOutlineCaretDown
                  size={12}
                  className={`text-slate-500 transition-transform ${
                    dropdown ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {dropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-4 border-b border-slate-700 bg-slate-800/50">
                    <p className="text-white font-medium truncate">
                      {userName}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      User Account
                    </p>
                  </div>
                  <div className="py-1" onClick={() => setDropdown(false)}>
                    <ProfileDropDown />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="flex pt-16 h-[calc(100vh-64px)] overflow-hidden">
        {/* --- SIDEBAR (DESKTOP) --- */}
        <aside
          className={`hidden lg:flex flex-col bg-slate-950 border-r border-slate-800 transition-all duration-300 ease-in-out z-40
            ${isOpen ? "w-64" : "w-20"}
          `}
        >
          {/* Navigation Links */}
          <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto custom-scrollbar">
            {menuItem.map((item, index) => (
              <NavLink
                key={index}
                to={item.path}
                className={({ isActive }) => `
                   flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group relative overflow-hidden
                   ${
                     isActive
                       ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
                       : "text-slate-400 hover:bg-slate-900 hover:text-white"
                   }
                   ${!isOpen && "justify-center"}
                 `}
                title={!isOpen ? item.name : ""}
              >
                <span className={`text-xl ${!isOpen ? "mx-auto" : ""}`}>
                  {item.icon}
                </span>

                <span
                  className={`whitespace-nowrap font-medium transition-all duration-300 ${
                    isOpen
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 translate-x-10 hidden"
                  }`}
                >
                  {item.name}
                </span>

                {/* Active Indicator Bar (Left) */}
                <span
                  className={({ isActive }) =>
                    isActive
                      ? "absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-white rounded-r-full"
                      : "hidden"
                  }
                ></span>
              </NavLink>
            ))}
          </div>

          {/* Sidebar Footer (Only visible when open) */}
          <div
            className={`p-4 border-t border-slate-800 bg-slate-950 transition-opacity duration-300 ${
              isOpen ? "opacity-100" : "opacity-0 hidden"
            }`}
          >
            <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 text-center">
              <p className="text-xs text-slate-400 mb-2">Need Help?</p>
              <CTAButton
                onClick={() => window.open("https://t.me/DrFullzBot", "_blank")}
                icon={FaRobot}
                label="Telegram Bot"
                variant="primary"
                size="small"
                className="w-full"
              />
            </div>
          </div>
        </aside>

        {/* --- MOBILE SIDEBAR DRAWER --- */}
        <div
          className={`fixed inset-0 z-50 lg:hidden transition-all duration-300 ${
            mobileMenu ? "visible" : "invisible"
          }`}
        >
          {/* Backdrop */}
          <div
            className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
              mobileMenu ? "opacity-100" : "opacity-0"
            }`}
            onClick={() => setMobileMenu(false)}
          />

          {/* Drawer */}
          <div
            className={`absolute top-0 bottom-0 left-0 w-72 bg-slate-900 border-r border-slate-800 shadow-2xl transform transition-transform duration-300 ${
              mobileMenu ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <span className="font-bold text-xl text-white">Menu</span>
              <button
                onClick={() => setMobileMenu(false)}
                className="text-slate-400 hover:text-white"
              >
                <AiOutlineClose size={24} />
              </button>
            </div>

            <div className="p-4 space-y-2">
              {menuItem.map((item, index) => (
                <NavLink
                  key={index}
                  to={item.path}
                  onClick={() => setMobileMenu(false)}
                  className={({ isActive }) => `
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                    ${
                      isActive
                        ? "bg-blue-600 text-white"
                        : "text-slate-400 hover:bg-slate-800 hover:text-white"
                    }
                  `}
                >
                  {item.icon}
                  <span className="font-medium">{item.name}</span>
                </NavLink>
              ))}
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-800 bg-slate-900">
              <div className="grid grid-cols-2 gap-2">
                <CTAButton
                  onClick={() =>
                    window.open("https://t.me/DrFullzBot", "_blank")
                  }
                  icon={FaRobot}
                  label="Bot"
                  variant="primary"
                  size="small"
                  className="w-full"
                />
                <CTAButton
                  onClick={() => window.open("https://t.me/dr_fullz", "_blank")}
                  icon={FaTelegramPlane}
                  label="Join"
                  variant="telegram"
                  size="small"
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>

        {/* --- MAIN CONTENT AREA --- */}
        <main
          className="flex-1 overflow-y-auto bg-slate-900 scroll-smooth custom-scrollbar relative"
          onClick={() => setDropdown(false)}
        >
          <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
