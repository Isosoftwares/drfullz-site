import React from "react";
import { FaTelegramPlane, FaRobot } from "react-icons/fa";
import { BiSupport } from "react-icons/bi";

function Support() {
  const supportLinks = [
    {
      id: 1,
      title: "Telegram Bot",
      description:
        "Get instant automated help, check order status, or manage your account 24/7.",
      icon: <FaRobot size={40} />,
      link: "https://t.me/DrFullzBot",
      color: "from-blue-600 to-cyan-500",
      btnText: "Start Bot",
    },
    {
      id: 2,
      title: "Official Channel",
      description:
        "Join our community for daily restock updates, news, and maintenance alerts.",
      icon: <FaTelegramPlane size={40} />,
      link: "https://t.me/fullzducks",
      color: "from-sky-500 to-blue-600",
      btnText: "Join Channel",
    },
  ];

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 animate-in fade-in zoom-in duration-500">
      {/* Header Section */}
      <div className="text-center mb-12 max-w-2xl">
        <div className="inline-flex justify-center items-center p-4 bg-slate-800 rounded-full mb-6 shadow-xl shadow-green-900/10">
          <BiSupport size={40} className="text-green-500" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
          How can we help you?
        </h1>
        <p className="text-slate-400 text-lg">
          We use Telegram for all our communications to ensure privacy and
          speed. Join our channel to stay updated with Fullducks.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-6 w-full max-w-lg">
        {/* Telegram Bot Card Commented Out as requested */}
        {/* <a
          href="https://t.me/DrFullzBot"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative bg-slate-900 border border-slate-800 hover:border-green-500/50 rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-green-500/10 flex flex-col items-center text-center overflow-hidden"
        >
          <div className="mb-6 p-4 rounded-2xl bg-gradient-to-br from-green-600 to-teal-500 text-white shadow-lg shadow-green-500/20 group-hover:scale-110 transition-transform duration-300">
            <FaRobot size={40} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Telegram Bot</h2>
          <p className="text-slate-400 mb-8 leading-relaxed">
            Get instant automated help, check order status, or manage your account 24/7.
          </p>
          <span className="mt-auto inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-white transition-all duration-200 bg-slate-800 border border-slate-700 rounded-lg group-hover:bg-green-600 group-hover:border-green-600 w-full">
            Start Bot
          </span>
        </a> */}

        <a
          href="https://t.me/fullzducks"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative bg-slate-900 border border-slate-800 hover:border-green-500/50 rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-green-500/10 flex flex-col items-center text-center overflow-hidden"
        >
          {/* Background Glow Effect on Hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-teal-600 opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>

          {/* Icon */}
          <div className="mb-6 p-4 rounded-2xl bg-gradient-to-br from-green-500 to-teal-600 text-white shadow-lg shadow-green-500/20 group-hover:scale-110 transition-transform duration-300">
            <FaTelegramPlane size={40} />
          </div>

          {/* Content */}
          <h2 className="text-2xl font-bold text-white mb-3">
            Official Channel
          </h2>
          <p className="text-slate-400 mb-8 leading-relaxed">
            Join our community for daily restock updates, news, and maintenance
            alerts.
          </p>

          {/* Fake Button Visual */}
          <span className="mt-auto inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-white transition-all duration-200 bg-slate-800 border border-slate-700 rounded-lg group-hover:bg-green-600 group-hover:border-green-600 w-full">
            Join Channel
          </span>
        </a>
      </div>
    </div>
  );
}

export default Support;
