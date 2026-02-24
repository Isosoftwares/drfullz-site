import React from "react";

const INSTRUCTIONS_TEXT = `How to log in and secure your account;
Log in with email and fsaid password. 
If the fullz you have are mail.tm base, you can log into the email and get the code to confirm your log in activity
If you are provided with an email alone, go to help me access my account, an option that comes out immediately afte adding email and password. Use the recovery code to access your acc. Remember to save the new backup code and then add in your own email upon successfully logging in. 
Happy dollar milling

Account Login and Access Instructions
 1. Login Credentials
 • Log in using your email address and FSA ID password.
 2. Login Verification
 • If the credentials you have are mail.tm–based, log in to the email account and retrieve the verification code sent to confirm the login activity.
 3. Account Access Using Email Only
 • If you are provided with an email address only, proceed as follows:
 • Enter the email and password.
 • Immediately after submission, select "Help me access my account."
 • Use the recovery code to gain access to the account.
 4. Post-Login Actions
 • Upon successful login:
 • Save the new backup/recovery code provided.
 • Add your own email address to the account for future access and security.`;

function News() {
  const downloadInstructions = () => {
    const blob = new Blob([INSTRUCTIONS_TEXT], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "login-instructions.txt";
    a.click();
    URL.revokeObjectURL(url);
  };
  return (
    <div className="max-w-4xl mx-auto px-6 pt-[50px] pb-12">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-3xl font-bold text-light bg-gradient-to-r from-green-400 to-teal-400 bg-clip-text text-transparent">
              Account Login and Access Instructions
            </h2>
            <button
              onClick={downloadInstructions}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/40 hover:border-green-500/70 transition-all text-sm font-semibold whitespace-nowrap"
              title="Download instructions as a text file"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download Instructions
            </button>
          </div>
          <div className="h-1 w-24 bg-gradient-to-r from-green-500 to-teal-500 rounded-full"></div>
        </div>

        {/* Informal Intro Block */}
        <section className="mb-8 bg-gray-800/60 rounded-xl p-6 border border-gray-600/50">
          <p className="text-gray-200 font-semibold text-base mb-1">
            How to log in and secure your account;
          </p>
          <p className="text-gray-300 mb-2">
            Log in with email and fsaid password.
          </p>
          <p className="text-gray-300 mb-2">
            If the fullz you have are mail.tm base, you can log into the email
            and get the code to confirm your log in activity
          </p>
          <p className="text-gray-300 mb-2">
            If you are provided with an email alone, go to help me access my
            account, an option that comes out immediately afte adding email and
            password. Use the recovery code to access your acc. Remember to save
            the new backup code and then add in your own email upon successfully
            logging in.
          </p>
          <p className="text-green-400 font-semibold mt-3">
            Happy dollar milling
          </p>
        </section>

        {/* Section 1 - Login Credentials */}
        <section className="mb-8 bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center w-8 h-8 bg-green-500 text-white rounded-full font-bold text-sm">
              1
            </div>
            <h3 className="text-xl font-semibold text-light">
              Login Credentials
            </h3>
          </div>
          <ul className="space-y-3 ml-11">
            <li className="flex items-start gap-2 text-gray-300">
              <span className="text-green-400 mt-1">•</span>
              <span>Log in using your email address and FSA ID password.</span>
            </li>
          </ul>
        </section>

        {/* Section 2 - Login Verification */}
        <section className="mb-8 bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center w-8 h-8 bg-teal-500 text-white rounded-full font-bold text-sm">
              2
            </div>
            <h3 className="text-xl font-semibold text-light">
              Login Verification
            </h3>
          </div>
          <ul className="space-y-3 ml-11">
            <li className="flex items-start gap-2 text-gray-300">
              <span className="text-teal-400 mt-1">•</span>
              <span>
                If the credentials you have are mail.tm–based, log in to the
                email account and retrieve the verification code sent to confirm
                the login activity.
              </span>
            </li>
          </ul>
        </section>

        {/* Section 3 - Email Only Access */}
        <section className="mb-8 bg-gradient-to-br from-green-900/30 to-green-900/30 rounded-xl p-6 border-2 border-green-500/50 hover:border-green-500/70 transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center w-8 h-8 bg-green-500 text-white rounded-full font-bold text-sm">
              3
            </div>
            <h3 className="text-xl font-semibold text-light">
              Account Access Using Email Only
            </h3>
          </div>
          <ul className="space-y-3 ml-11">
            <li className="flex items-start gap-2 text-gray-300">
              <span className="text-green-400 mt-1">•</span>
              <span>
                If you are provided with an email address only, proceed as
                follows:
              </span>
            </li>
            <li className="flex items-start gap-2 text-gray-300">
              <span className="text-green-400 mt-1">•</span>
              <span>Enter the email and password.</span>
            </li>
            <li className="flex items-start gap-2 text-gray-300">
              <span className="text-green-400 mt-1">•</span>
              <span>
                Immediately after submission, select "Help me access my
                account."
              </span>
            </li>
            <li className="flex items-start gap-2 text-gray-300">
              <span className="text-green-400 mt-1">•</span>
              <span>Use the recovery code to gain access to the account.</span>
            </li>
          </ul>
        </section>

        {/* Section 4 - Post-Login Actions */}
        <section className="mb-8 bg-gradient-to-br from-orange-900/30 to-red-900/30 rounded-xl p-6 border-2 border-orange-500/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center w-8 h-8 bg-orange-500 text-white rounded-full font-bold text-sm">
              4
            </div>
            <h3 className="text-xl font-semibold text-light">
              Post-Login Actions
            </h3>
          </div>
          <ul className="space-y-3 ml-11">
            <li className="flex items-start gap-2 text-gray-300">
              <span className="text-orange-400 mt-1">•</span>
              <span>Upon successful login:</span>
            </li>
            <li className="flex items-start gap-2 text-gray-300">
              <span className="text-orange-400 mt-1">•</span>
              <span>Save the new backup/recovery code provided.</span>
            </li>
            <li className="flex items-start gap-2 text-gray-300">
              <span className="text-orange-400 mt-1">•</span>
              <span>
                Add your own email address to the account for future access and
                security.
              </span>
            </li>
          </ul>
        </section>

        {/* Closing Note */}
        <div className="text-center py-4">
          <span className="inline-block bg-gradient-to-r from-green-500/20 to-teal-500/20 text-green-400 px-6 py-3 rounded-full text-base font-semibold border border-green-500/30 tracking-wide">
            💵 Happy Dollar Milling 💵
          </span>
        </div>
      </div>
    </div>
  );
}

export default News;
