import React from "react";
import FAQ from "./FAQ";

function FAQpage() {
  return (
    <div className="bg-slate-900 min-h-screen pb-12">
      <div className="text-white pt-10 text-center mb-10">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-400 to-teal-400 bg-clip-text text-transparent">
          Frequently Asked Questions
        </h1>
        <div className="h-1 w-24 bg-green-500 rounded-full mx-auto"></div>
      </div>
      <div className="max-w-4xl mx-auto px-4">
        <FAQ
          question="General Rules"
          answer={[
            "1. All your balance, replenished by any method, is a part of the Fullducks website and is non-refundable (non-returnable).",
            <br />,
            <br />,
            "2. We are not responsible for your links passability (negotiability).",
            <br />,
            <br />,
            "3. Save all purchases to your device, we wipe sold items data from time to time.",
            <br />,
            <br />,
            "4. In case of insults or threats, your account will be blocked without refunds.",
            <br />,
            <br />,
            "5. There is no moneyback out of Fullducks.",
          ]}
        />

        <FAQ
          question="Seller Rules"
          answer={[
            <p className="text-2xl font-semibold mb-4 text-green-400">
              Seller-to-Buyer Disclosure Terms
            </p>,
            <hr className="border-slate-700 mb-6" />,
            <p className="text-xl font-bold text-white mb-3">
              Rules for Sellers:
            </p>,
            <div className="space-y-3 text-slate-300">
              <p>
                1. All balance replenishments are part of the Fullducks
                ecosystem and are non-refundable.
              </p>
              <p>
                2. Link passability and negotiability are the user's
                responsibility.
              </p>
              <p>
                3. Always backup your purchases; sold data is cleared
                periodically.
              </p>
              <p>
                4. Professional conduct is required; insults or threats lead to
                account termination.
              </p>
              <p>5. No external refunds or moneybacks are provided.</p>
            </div>,
          ]}
        />
        <FAQ
          question="Purchase Rules for SSN/DOB"
          answer={[
            <div className="space-y-4">
              <p className="text-xl font-medium text-green-400">
                We are not responsible for link success rates or negotiability.
              </p>

              <p className="text-lg text-white">
                Refunds for SSN are only considered for the following reasons:
              </p>

              <ul className="list-disc pl-6 space-y-2 text-slate-300">
                <li>Holder is deceased</li>
                <li>PO Box address</li>
                <li>Incorrect main Fullz data</li>
              </ul>
            </div>,
          ]}
        />
        <FAQ
          question="Purchase Rules for Google Voice, TextNow & Mail"
          answer={[
            <div className="space-y-4">
              <p className="text-slate-300">
                1. After purchase, you{" "}
                <span className="text-white font-bold underline">must</span>{" "}
                change the password and set up a recovery email immediately upon
                first login.
              </p>
              <p className="text-slate-300">
                2. We provide a limited{" "}
                <span className="text-green-400 font-bold">
                  24-hour warranty
                </span>{" "}
                from the time of purchase.
              </p>
            </div>,
          ]}
        />
        <FAQ
          question="Purchase Rules for Accounts Market"
          answer={[
            <div className="space-y-4 text-slate-300">
              <p>
                1. We provide a limited{" "}
                <span className="text-green-400 font-bold">
                  24-hour warranty
                </span>{" "}
                from the time of purchase.
              </p>
              <p>
                2. Use a clean USA IP address. Verify its status via the "Check
                IP" tab.
              </p>
              <p>3. For refund claims, you must provide:</p>
              <ul className="list-disc pl-8 space-y-1">
                <li>Proof of cookie usage (e.g., imgur.com screenshot)</li>
                <li>The exact IP address used for login</li>
              </ul>
              <p>
                4. Change all passwords (email and account) immediately after
                purchase.
              </p>
            </div>,
          ]}
        />
      </div>
    </div>
  );
}

export default FAQpage;
