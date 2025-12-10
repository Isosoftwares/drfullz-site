import React, { useState } from 'react';
import { FaInfoCircle, FaCheckSquare, FaShoppingCart, FaLayerGroup } from 'react-icons/fa';
import { BiCartDownload } from "react-icons/bi";

const UserGuide = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-lg mb-6 overflow-hidden">
      <div 
        className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800 cursor-pointer hover:bg-slate-900 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2 text-blue-400">
          <FaInfoCircle />
          <h3 className="font-bold text-white">How to Use This Table</h3>
        </div>
        <span className="text-xs text-slate-500">{isOpen ? "Hide Guide" : "Show Guide"}</span>
      </div>

      {isOpen && (
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8 text-slate-300 text-sm">
          
          {/* Section 1: Selection */}
          <div className="space-y-3">
            <h4 className="font-semibold text-white flex items-center gap-2">
              <FaCheckSquare className="text-blue-500" /> Selecting Records
            </h4>
            <ul className="space-y-2 pl-2 border-l-2 border-slate-700">
              <li>
                <strong className="text-white">Select Single:</strong> Click the checkbox on the far left of any row. The row will highlight blue.
              </li>
              <li>
                <strong className="text-white">Select All:</strong> Click the checkbox in the <span className="text-slate-400 uppercase text-xs">Table Header</span> to select all 50+ items currently visible on this page.
              </li>
              <li className="text-xs text-slate-500 italic">
                * Note: Items already in your cart cannot be selected.
              </li>
            </ul>
          </div>

          {/* Section 2: Purchasing */}
          <div className="space-y-3">
            <h4 className="font-semibold text-white flex items-center gap-2">
              <FaShoppingCart className="text-blue-500" /> Adding to Cart
            </h4>
            <ul className="space-y-2 pl-2 border-l-2 border-slate-700">
              <li className="flex items-start gap-2">
                <div className="mt-1"><FaShoppingCart className="text-blue-400" /></div>
                <div>
                  <strong className="text-white">Single Item:</strong> Click the blue cart icon on the far right of the row to add just that item.
                </div>
              </li>
              <li className="flex items-start gap-2">
                <div className="mt-1"><BiCartDownload className="text-blue-400" size={18} /></div>
                <div>
                  <strong className="text-white">Bulk Add:</strong> Select multiple items using the checkboxes. A <span className="text-white font-medium">Floating Action Bar</span> will appear at the bottom of your screen. Click "Add to Cart" to add all selected items at once.
                </div>
              </li>
            </ul>
          </div>

        </div>
      )}
    </div>
  );
};

export default UserGuide;