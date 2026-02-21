import React, { useState } from "react";
import { BiPlus, BiMinus } from "react-icons/bi";

const FAQ = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-6 min-w-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between w-full items-center py-4 px-6 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-all border-l-4 border-green-500 shadow-lg"
      >
        <p className="font-semibold text-lg">{question}</p>
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500 text-slate-900">
          {isOpen ? <BiMinus size={20} /> : <BiPlus size={20} />}
        </div>
      </button>
      {isOpen && (
        <div className="animate-in slide-in-from-top-2 duration-300 w-full p-6 mt-1 bg-slate-800/50 rounded-b-lg border border-slate-700/50">
          <div className="text-slate-300 leading-relaxed">{answer}</div>
        </div>
      )}
    </div>
  );
};

export default FAQ;
