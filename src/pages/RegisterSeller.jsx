import React from "react";
import { Link } from "react-router-dom";

import { MdArrowBack } from "react-icons/md";

function RegisterSeller() {
  return (
    <div className="bg-slate-950 flex flex-col justify-center items-center min-h-screen bg-cover bg-center bg-no-repeat">
      <div className="w-[93%] md:w-[450px] bg-slate-900 border border-slate-800 text-start rounded-2xl shadow-2xl p-8 border-t-4 border-t-emerald-500">
        <h1 className="text-3xl font-bold text-white mb-6">Sign Up (Seller)</h1>

        <div className="bg-emerald-600/10 border border-emerald-600/20 text-emerald-400 p-6 flex flex-col gap-4 rounded-xl items-center">
          <p className="text-base font-medium text-center">
            Ready to start selling your products on Fullducks?
          </p>
          <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 w-full text-center">
            <p className="text-sm text-slate-400 mb-1">Contact us today at:</p>
            <p className="text-lg font-bold text-white selection:bg-emerald-500 selection:text-slate-900">
              JabberID: rarevision@yax.im
            </p>
          </div>
        </div>

        <div className="mt-8 flex justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white py-2.5 px-6 rounded-lg transition-all border border-slate-700"
          >
            <MdArrowBack />
            <span>Back</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default RegisterSeller;
