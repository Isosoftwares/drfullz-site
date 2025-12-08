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
      link: "https://t.me/dr_fullz",
      color: "from-sky-500 to-blue-600",
      btnText: "Join Channel",
    },
  ];

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 animate-in fade-in zoom-in duration-500">
      {/* Header Section */}
      <div className="text-center mb-12 max-w-2xl">
        <div className="inline-flex justify-center items-center p-4 bg-slate-800 rounded-full mb-6 shadow-xl shadow-blue-900/10">
          <BiSupport size={40} className="text-blue-500" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
          How can we help you?
        </h1>
        <p className="text-slate-400 text-lg">
          We use Telegram for all our communications to ensure privacy and
          speed. Select an option below to connect with us.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        {supportLinks.map((item) => (
          <a
            key={item.id}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative bg-slate-900 border border-slate-800 hover:border-blue-500/50 rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/10 flex flex-col items-center text-center overflow-hidden"
          >
            {/* Background Glow Effect on Hover */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
            ></div>

            {/* Icon */}
            <div
              className={`mb-6 p-4 rounded-2xl bg-gradient-to-br ${item.color} text-white shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform duration-300`}
            >
              {item.icon}
            </div>

            {/* Content */}
            <h2 className="text-2xl font-bold text-white mb-3">{item.title}</h2>
            <p className="text-slate-400 mb-8 leading-relaxed">
              {item.description}
            </p>

            {/* Fake Button Visual */}
            <span className="mt-auto inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-white transition-all duration-200 bg-slate-800 border border-slate-700 rounded-lg group-hover:bg-blue-600 group-hover:border-blue-600 w-full">
              {item.btnText}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}

export default Support;
