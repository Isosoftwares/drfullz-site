import React, { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import useAuth from "../../../hooks/useAuth";
import {
  FaTrashAlt,
  FaDownload,
  FaFileCsv,
  FaCalendarDay,
  FaHistory,
  FaClock,
} from "react-icons/fa";
import PulseLoader from "react-spinners/PulseLoader";

function SsnOrders({ ssn = [], onOrdersDeleted }) {
  const [todaysOrders, setTodaysOrders] = useState([]);
  const [yesterdaysOrders, setYesterdaysOrders] = useState([]);
  const [earlierOrders, setEarlierOrders] = useState([]);
  const [selectedOrders, setSelectedOrders] = useState(new Set());

  const axios = useAxiosPrivate();
  const queryClient = useQueryClient();
  const { auth } = useAuth();

  // --- Sorting Logic ---
  useEffect(() => {
    if (!Array.isArray(ssn)) return;

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const t = [];
    const y = [];
    const e = [];

    ssn.forEach((order) => {
      if (order.isDeleted) return;
      const pDate = new Date(order.purchaseDate);

      if (pDate.toDateString() === today.toDateString()) t.push(order);
      else if (pDate.toDateString() === yesterday.toDateString()) y.push(order);
      else e.push(order);
    });

    setTodaysOrders(t);
    setYesterdaysOrders(y);
    setEarlierOrders(e);
  }, [ssn]);

  // --- Selection Logic ---
  const handleOrderSelect = (orderId) => {
    const newSelected = new Set(selectedOrders);
    if (newSelected.has(orderId)) newSelected.delete(orderId);
    else newSelected.add(orderId);
    setSelectedOrders(newSelected);
  };

  const handleSelectGroup = (orders, isSelect) => {
    const newSelected = new Set(selectedOrders);
    orders.forEach((o) =>
      isSelect ? newSelected.add(o._id) : newSelected.delete(o._id),
    );
    setSelectedOrders(newSelected);
  };

  // --- Delete Mutation ---
  const { mutate: removeMutate, isLoading: loadingMutate } = useMutation(
    (data) => axios.patch("/orders/remove", data),
    {
      onSuccess: (res) => {
        toast.success(res?.data?.message || "Orders deleted");
        queryClient.invalidateQueries([`orders-${auth?.userId}`]);
        setSelectedOrders(new Set());
        if (onOrdersDeleted) onOrdersDeleted(Array.from(selectedOrders));
      },
      onError: (err) =>
        toast.error(err?.response?.data?.message || "Failed to delete"),
    },
  );

  const bulkDeleteOrders = () => {
    if (selectedOrders.size === 0) return;
    if (!window.confirm(`Delete ${selectedOrders.size} orders?`)) return;
    removeMutate({
      userId: auth?.userId,
      productIds: Array.from(selectedOrders),
    });
  };

  // --- Download Helpers ---
  const instructions = ``;

  const generateTxtContent = (orders) => {
    let content = "SSN/DOB Orders Export\n\n" + instructions + "\n\n";
    orders.forEach((o, i) => {
      content += `[Order #${i + 1}] --------------------------------\n`;
      content += `Name:              ${o.FName} ${o.LName}\n`;
      content += `SSN:               ${o.SSN}\n`;
      content += `DOB:               ${o.DOB ? new Date(o.DOB).toLocaleDateString() : "N/A"}\n`;
      content += `Address:           ${o.Address}, ${o.City}, ${o.State || ""} ${o.Zip || ""}\n`;
      content += `Username:          ${o.Username}\n`;
      content += `Password:          ${o.Password}\n`;
      content += `Backup Code:       ${o.BackupCode}\n`;
      content += `Description:       ${o.Description || "N/A"}\n`;
      content += `Enrollment Detail: ${o.EnrollmentDetails || "N/A"}\n`;
      content += `Enrollment Status: ${o.EnrollmentStatus || "N/A"}\n`;
      content += `Purchased:         ${o.purchaseDate ? new Date(o.purchaseDate).toLocaleString() : "N/A"}\n\n`;
    });
    return content;
  };

  const downloadFile = (content, type, filename) => {
    const blob = new Blob([content], { type });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  const handleDownloadTxt = (orders) => {
    downloadFile(generateTxtContent(orders), "text/plain", "orders.txt");
  };

  const handleDownloadCsv = (orders) => {
    if (!orders.length) return;

    // Explicit ordered headers matching new SsnDob schema
    const headers = [
      "FName",
      "LName",
      "DOB",
      "SSN",
      "Address",
      "City",
      "State",
      "Zip",
      "Username",
      "Password",
      "BackupCode",
      "Description",
      "EnrollmentDetails",
      "EnrollmentStatus",
      "status",
      "isPaid",
      "purchaseDate",
      "base",
    ];

    let csv = headers.join(",") + "\n";
    orders.forEach((o) => {
      const row = headers
        .map((h) => `"${String(o[h] || "").replace(/"/g, '""')}"`)
        .join(",");
      csv += row + "\n";
    });
    downloadFile(csv, "text/csv;charset=utf-8;", "ssn_orders.csv");
  };

  // --- Render Table Component ---
  const RenderTable = ({ data, title, icon: Icon }) => {
    if (data.length === 0) return null;
    const allSelected = data.every((o) => selectedOrders.has(o._id));

    return (
      <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col gap-2 md:flex-row items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2 text-slate-300">
            <Icon className="text-green-500" />
            <h3 className="font-bold text-lg">{title}</h3>
            <span className="bg-slate-800 text-xs px-2 py-0.5 rounded-full border border-slate-700 text-slate-400">
              {data.length}
            </span>
          </div>
          <div className="flex flex-col md:flex-row gap-2">
            <button
              onClick={() => handleDownloadTxt(data)}
              className="p-2 bg-slate-800 hover:bg-slate-700 flex items-center gap-2 rounded text-slate-300 transition-colors"
              title="Download TXT"
            >
              <FaDownload size={12} />
              <p>Download TXT</p>
            </button>
            <button
              onClick={() => handleDownloadCsv(data)}
              className="p-2 bg-slate-800 hover:bg-slate-700 flex items-center gap-2 rounded text-slate-300 transition-colors"
              title="Download CSV"
            >
              <FaFileCsv size={12} />
              <p>Download CSV</p>
            </button>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-400 uppercase bg-slate-950/50 border-b border-slate-800">
                <tr>
                  {/* <th className="px-4 py-3 w-10">
                    <input
                      type="checkbox"
                      className="rounded border-slate-700 bg-slate-800 text-blue-600 focus:ring-offset-slate-900"
                      checked={allSelected}
                      onChange={(e) =>
                        handleSelectGroup(data, e.target.checked)
                      }
                    />
                  </th> */}
                  <th className="px-4 py-3">Identity</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Credentials</th>
                  <th className="px-4 py-3 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {data.map((item) => {
                  const isSelected = selectedOrders.has(item._id);
                  return (
                    <tr
                      key={item._id}
                      className={`hover:bg-slate-800/50 transition-colors ${
                        isSelected ? "bg-green-900/10" : ""
                      }`}
                    >
                      {/* <td className="px-4 py-3 align-top pt-4">
                        <input
                          type="checkbox"
                          className="rounded border-slate-700 bg-slate-800 text-blue-600 focus:ring-offset-slate-900"
                          checked={isSelected}
                          onChange={() => handleOrderSelect(item._id)}
                        />
                      </td> */}
                      <td className="px-4 py-3 align-top">
                        <div className="font-bold text-white text-base">
                          {item.FName} {item.LName}
                        </div>
                        <div className="text-xs text-slate-400 font-mono mt-1">
                          <span className="text-slate-500">SSN:</span>{" "}
                          {item.SSN}
                          <span className="mx-2 text-slate-700">|</span>
                          <span className="text-slate-500">DOB:</span>{" "}
                          {item.DOB
                            ? new Date(item.DOB).toLocaleDateString()
                            : "N/A"}
                        </div>
                        <div className="text-xs text-green-400 mt-1 font-medium bg-green-900/20 inline-block px-1.5 py-0.5 rounded">
                          {item.base}
                        </div>
                      </td>
                      <td className="px-4 py-3 align-top text-slate-300">
                        <div>
                          {item.City}, {item.State || "—"}
                        </div>
                        <div className="text-xs text-slate-500 mt-1 font-mono">
                          {item.Zip || "—"}
                        </div>
                        <div
                          className="text-xs text-slate-500 mt-1 truncate max-w-[150px]"
                          title={item.Address}
                        >
                          {item.Address}
                        </div>
                      </td>
                      <td className="px-4 py-3 align-top text-xs font-mono text-slate-400 space-y-1">
                        <div className="flex gap-2">
                          <span className="text-slate-600 w-16">Username:</span>
                          <span className="truncate max-w-[140px]">
                            {item.Username}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <span className="text-slate-600 w-16">Password:</span>
                          <span className="truncate max-w-[140px]">
                            {item.Password}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <span className="text-slate-600 w-16">Backup:</span>
                          <span className="truncate max-w-[140px] text-yellow-400">
                            {item.BackupCode}
                          </span>
                        </div>
                        {item.EnrollmentStatus &&
                          item.EnrollmentStatus !== "N/A" && (
                            <div className="flex gap-2">
                              <span className="text-slate-600 w-16">
                                Enroll:
                              </span>
                              <span className="truncate max-w-[140px] text-blue-400">
                                {item.EnrollmentStatus}
                              </span>
                            </div>
                          )}
                      </td>
                      <td className="px-4 py-3 align-top text-right text-slate-500 text-xs">
                        <div className="font-medium text-slate-400">
                          {new Date(item.purchaseDate).toLocaleDateString()}
                        </div>
                        <div>
                          {new Date(item.purchaseDate).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const totalOrders =
    todaysOrders.length + yesterdaysOrders.length + earlierOrders.length;

  return (
    <div className="relative min-h-[400px]">
      {/* Empty State */}
      {totalOrders === 0 && (
        <div className="flex flex-col items-center justify-center py-20 bg-slate-800/20 rounded-xl border border-dashed border-slate-700 text-center">
          <div className="text-slate-600 mb-4 text-4xl">📭</div>
          <h3 className="text-slate-400 text-lg font-medium">
            No SSN orders found
          </h3>
          <p className="text-slate-500 text-sm">
            Purchase records will appear here.
          </p>
        </div>
      )}

      {/* Sections */}
      <RenderTable data={todaysOrders} title="Purchased Today" icon={FaClock} />
      <RenderTable
        data={yesterdaysOrders}
        title="Yesterday"
        icon={FaCalendarDay}
      />
      <RenderTable
        data={earlierOrders}
        title="Order History"
        icon={FaHistory}
      />

      {/* Floating Action Bar */}
      <div
        className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 bg-slate-800 border border-slate-700 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-6 transition-all duration-300 ${
          selectedOrders.size > 0
            ? "translate-y-0 opacity-100"
            : "translate-y-20 opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex items-center gap-2">
          <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            {selectedOrders.size}
          </span>
          <span className="text-sm font-medium">Selected</span>
        </div>
        <div className="h-6 w-px bg-slate-600"></div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedOrders(new Set())}
            className="text-sm text-slate-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={bulkDeleteOrders}
            disabled={loadingMutate}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg shadow-red-900/20 transition-all hover:scale-105"
          >
            {loadingMutate ? (
              <PulseLoader size={6} color="white" />
            ) : (
              <>
                <FaTrashAlt size={14} /> Delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default SsnOrders;
