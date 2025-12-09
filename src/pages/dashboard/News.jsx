import React from "react";

function News() {
  return (
    <div className="max-w-4xl mx-auto px-6 pt-[50px] pb-12">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-light mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Instructions on How to Use DrFullz.com Matched Fullz
          </h2>
          <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
        </div>

        <section className="mb-8 bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center w-8 h-8 bg-blue-500 text-white rounded-full font-bold text-sm">
              1
            </div>
            <h3 className="text-xl font-semibold text-light">
              Login to FSAID
            </h3>
          </div>
          <ul className="space-y-3 ml-11">
            <li className="flex items-start gap-2 text-gray-300">
              <span className="text-blue-400 mt-1">•</span>
              <span>
                Go to the <span className="font-semibold text-blue-400">FSAID</span> website.
              </span>
            </li>
            <li className="flex items-start gap-2 text-gray-300">
              <span className="text-blue-400 mt-1">•</span>
              <span>
                Enter the <span className="font-semibold text-blue-400">"Email"</span> as the
                username on the login screen.
              </span>
            </li>
            <li className="flex items-start gap-2 text-gray-300">
              <span className="text-blue-400 mt-1">•</span>
              <span>
                Enter <span className="font-semibold text-blue-400">"FA Pass"</span> as the
                password.
              </span>
            </li>
          </ul>
        </section>

        <section className="mb-8 bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center w-8 h-8 bg-purple-500 text-white rounded-full font-bold text-sm">
              2A
            </div>
            <h3 className="text-xl font-semibold text-light">
              Option 1: Login Using Email Verification Code
            </h3>
          </div>
          <ul className="space-y-3 ml-11">
            <li className="flex items-start gap-2 text-gray-300">
              <span className="text-purple-400 mt-1">•</span>
              <span>
                Go to <span className="font-semibold text-purple-400">mail.tm</span> website.
              </span>
            </li>
            <li className="flex items-start gap-2 text-gray-300">
              <span className="text-purple-400 mt-1">•</span>
              <span>
                Click on <span className="font-semibold text-purple-400">Profile</span> in the top
                right corner and log in.
              </span>
            </li>
            <li className="flex items-start gap-2 text-gray-300">
              <span className="text-purple-400 mt-1">•</span>
              <span>
                Enter the <span className="font-semibold text-purple-400">Email</span> and{" "}
                <span className="font-semibold text-purple-400">Email Pass</span> to log in.
              </span>
            </li>
            <li className="flex items-start gap-2 text-gray-300">
              <span className="text-purple-400 mt-1">•</span>
              <span>Retrieve the verification code and proceed.</span>
            </li>
          </ul>
        </section>

        <section className="mb-8 bg-gradient-to-br from-green-900/30 to-emerald-900/30 rounded-xl p-6 border-2 border-green-500/50 hover:border-green-500/70 transition-colors">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-8 h-8 bg-green-500 text-white rounded-full font-bold text-sm">
              2B
            </div>
            <h3 className="text-xl font-semibold text-light">
              Option 2: Login Using Backup Code
            </h3>
          </div>
          <div className="ml-11 mb-4">
            <span className="inline-block bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-medium">
              ⭐ Recommended
            </span>
          </div>
          <ul className="space-y-3 ml-11">
            <li className="flex items-start gap-2 text-gray-300">
              <span className="text-green-400 mt-1">•</span>
              <span>
                Click on{" "}
                <span className="font-semibold text-green-400">"Help me access my account"</span>{" "}
                instead of "Send Code".
              </span>
            </li>
            <li className="flex items-start gap-2 text-gray-300">
              <span className="text-green-400 mt-1">•</span>
              <span>
                Select{" "}
                <span className="font-semibold text-green-400">
                  "Backup Code & Challenge Questions"
                </span>{" "}
                and click <span className="font-semibold text-green-400">"Enter Code"</span>.
              </span>
            </li>
            <li className="flex items-start gap-2 text-gray-300">
              <span className="text-green-400 mt-1">•</span>
              <span>
                Enter the Backup Code from the fullz and click{" "}
                <span className="font-semibold text-green-400">"Continue"</span>.
              </span>
            </li>
            <li className="flex items-start gap-2 text-gray-300">
              <span className="text-green-400 mt-1">•</span>
              <span>Answer the Security Questions from the fullz.</span>
            </li>
            <li className="flex items-start gap-2 text-gray-300">
              <span className="text-green-400 mt-1">•</span>
              <span>Proceed to access the account.</span>
            </li>
          </ul>
        </section>

        <section className="bg-gradient-to-br from-orange-900/30 to-red-900/30 rounded-xl p-6 border-2 border-orange-500/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center w-8 h-8 bg-orange-500 text-white rounded-full font-bold text-sm">
              3
            </div>
            <h3 className="text-xl font-semibold text-light">Final Steps</h3>
          </div>
          <p className="text-gray-300 mb-3 ml-11 font-medium">Once logged in, remember to:</p>
          <ul className="space-y-3 ml-11">
            <li className="flex items-start gap-2 text-gray-300">
              <span className="text-orange-400 mt-1">•</span>
              <span>Change the email to your own.</span>
            </li>
            <li className="flex items-start gap-2 text-gray-300">
              <span className="text-orange-400 mt-1">•</span>
              <span>Update the address and username.</span>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}

export default News;
