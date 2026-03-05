import React, { useState, useEffect } from "react";
import { generateSync } from "otplib";
import { FaKey, FaCopy, FaCheck, FaTimes } from "react-icons/fa";

function TwoFaAuthPage() {
  const [secret, setSecret] = useState("");
  const [token, setToken] = useState("");
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let interval;

    const updateToken = () => {
      if (secret) {
        try {
          const newToken = generateSync({ secret });
          setToken(newToken);
          const epoch = Math.floor(Date.now() / 1000);
          const timeUsed = epoch % 30;
          setTimeRemaining(30 - timeUsed);
        } catch (error) {
          setToken("Invalid Secret");
          setTimeRemaining(0);
        }
      } else {
        setToken("");
        setTimeRemaining(30);
      }
    };

    updateToken();

    interval = setInterval(() => {
      updateToken();
    }, 1000);

    return () => clearInterval(interval);
  }, [secret]);

  const handleCopy = () => {
    if (token && token !== "Invalid Secret") {
      navigator.clipboard.writeText(token);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const calculateProgress = () => {
    return ((30 - timeRemaining) / 30) * 100;
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-4 p-4 md:p-8 animate__animated animate__fadeIn">
      <div className="bg-slate-800 rounded-2xl shadow-xl overflow-hidden border border-slate-700">
        <div className="p-6 md:p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-green-500/20 text-green-400 rounded-xl flex items-center justify-center">
              <FaKey size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">2FA Authenticator</h2>
              <p className="text-slate-400 text-sm mt-1">
                Enter your secret key below to generate your 2FA verification code.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Secret Key
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={secret}
                  onChange={(e) => setSecret(e.target.value.replace(/\s+/g, "").toUpperCase())}
                  placeholder="Enter 2FA Secret Key (e.g., JBSWY3DPEHPK3PXP)"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 pr-12 text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all font-mono"
                />
                {secret && (
                  <button
                    onClick={() => setSecret("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-slate-500 hover:text-red-400 transition-colors rounded-full hover:bg-slate-800"
                    title="Clear secret"
                  >
                    <FaTimes size={16} />
                  </button>
                )}
              </div>
            </div>

            {secret && (
              <div className="mt-8">
                <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 relative overflow-hidden group">
                  {/* Progress bar background line */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-slate-800">
                    <div
                      className="h-full bg-green-500 transition-all duration-1000 ease-linear"
                      style={{ width: `${calculateProgress()}%` }}
                     />
                  </div>
                  
                  <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex-1 text-center md:text-left">
                      <p className="text-slate-400 text-sm mb-1">Verification Code</p>
                      <h3 className="text-4xl md:text-5xl font-mono font-bold text-white tracking-[0.2em]">
                        {token ? (
                          token === "Invalid Secret" ? (
                            <span className="text-red-400 text-2xl tracking-normal">{token}</span>
                          ) : (
                            <>{token.slice(0, 3)} {token.slice(3)}</>
                          )
                        ) : (
                          "--- ---"
                        )}
                      </h3>
                    </div>

                    {token && token !== "Invalid Secret" && (
                      <div className="flex flex-col items-center gap-3 border-t md:border-t-0 md:border-l border-slate-700 pt-4 md:pt-0 md:pl-6 w-full md:w-auto">
                        <div className="relative inline-flex items-center justify-center">
                          <svg className="w-16 h-16 transform -rotate-90">
                            <circle
                              cx="32"
                              cy="32"
                              r="28"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="transparent"
                              className="text-slate-800"
                            />
                            <circle
                              cx="32"
                              cy="32"
                              r="28"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="transparent"
                              strokeDasharray="175"
                              strokeDashoffset={175 - (175 * calculateProgress()) / 100}
                              className={`transition-all duration-1000 ease-linear ${
                                timeRemaining <= 5 ? "text-red-500" : timeRemaining <= 10 ? "text-yellow-500" : "text-green-500"
                              }`}
                            />
                          </svg>
                          <span className={`absolute text-lg font-bold font-mono ${
                            timeRemaining <= 5 ? "text-red-500" : timeRemaining <= 10 ? "text-yellow-500" : "text-green-500"
                          }`}>
                            {timeRemaining}
                          </span>
                        </div>
                        
                        <button
                          onClick={handleCopy}
                          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors text-sm font-medium w-full justify-center"
                        >
                          {copied ? (
                            <>
                              <FaCheck className="text-green-400" /> Copied
                            </>
                          ) : (
                            <>
                              <FaCopy className="text-slate-400" /> Copy Code
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {!secret && (
              <div className="mt-8 bg-slate-900/50 border border-slate-700/50 rounded-2xl p-8 text-center border-dashed">
                <FaKey className="mx-auto text-slate-500 mb-3" size={32} />
                <p className="text-slate-400">
                  Enter a valid 2FA Secret Key to view your verification code.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TwoFaAuthPage;
