import React, { useMemo, useState } from "react";
import {
  FaDownload,
  FaFileCsv,
  FaLayerGroup,
  FaBoxOpen,
  FaCheckSquare,
  FaRegSquare,
  FaChevronDown,
  FaCopy,
  FaUser,
  FaMapMarkerAlt,
  FaKey,
} from "react-icons/fa";

// --- Shared Download Helpers ---
const INSTRUCTIONS_TEXT = `How to log in and secure your account;
Log in with email and fsaid password. 
If the fullz you have are mail.tm base, you can log into the email and get the code to confirm your log in activity
If you are provided with an email alone, go to help me access my account, an option that comes out immediately afte adding email and password. Use the recovery code to access your acc. Remember to save the new backup code and then add in your own email upon successfully logging in. 
Happy dollar milling

Account Login and Access Instructions
 1. Login Credentials
 • Log in using your email or username and FSA ID password.
 2. Login Verification
 • If the credentials you have are mail.tm–based, log in to the email account and retrieve the verification code sent to confirm the login activity.
 3. Account Access Using Email Only
 • If you are provided with an email or username and password alone, proceed as follows:
 • Enter the email or username and password.
 • Immediately after submission, select "Help me access my account."
 • Use the recovery code to gain access to the account.
 • If you are provided with 2FA, visit 2FA on the sidebar or https://fullducks.com/2fa to get the code. By pasting the code, you will be able to access the account.
 4. Post-Login Actions
 • Upon successful login:
 • Save the new backup/recovery code provided.
 • Add your own email address to the account for future access and security.`;

const downloadFile = (content, type, filename) => {
  const blob = new Blob([content], { type });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
};

const downloadInstructions = () => {
  downloadFile(INSTRUCTIONS_TEXT, "text/plain", "login-instructions.txt");
};

const generateTxtContent = (orders) => {
  let content =
    "SSN/DOB Orders Export\n\n" +
    "Instructions: Find login instructions in the downloaded files as well (login-instructions.txt)." +
    "\n\n";
  orders.forEach((o, i) => {
    content += `[Order #${i + 1}] --------------------------------\n`;
    content += `Name:              ${o.FName} ${o.LName}\n`;
    content += `SSN:               ${o.SSN}\n`;
    content += `DOB:               ${o.DOB ? new Date(o.DOB).toLocaleDateString() : "N/A"}\n`;
    content += `Address:           ${o.Address}, ${o.City}, ${o.State || ""} ${o.Zip || ""}\n`;
    content += `Username:          ${o.Username}\n`;
    content += `Password:          ${o.Password}\n`;
    content += `2Fa:          ${o.twoFA || "N/A"}\n`;
    content += `Backup Code:       ${o.BackupCode}\n`;
    content += `Description:       ${o.Description || "N/A"}\n`;
    content += `Enrollment Detail: ${o.EnrollmentDetails || "N/A"}\n`;
    content += `Enrollment Status: ${o.EnrollmentStatus || "N/A"}\n`;
    content += `Purchased:         ${o.purchaseDate ? new Date(o.purchaseDate).toLocaleString() : "N/A"}\n\n`;
  });
  return content;
};

const generateCsvContent = (orders) => {
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
    "twoFA",
    "BackupCode",
    "Description",
    "EnrollmentDetails",
    "EnrollmentStatus",
    "purchaseDate",
  ];
  let csv = headers.join(",") + "\n";

  orders.forEach((o) => {
    const row = headers
      .map((h) => {
        let val = o[h] || "";

        // Format DOB as mm/dd/yyyy
        if (h === "DOB" && val) {
          const date = new Date(val);
          // Check if the date is valid before trying to format
          if (!isNaN(date.getTime())) {
            // padStart ensures single digits get a leading zero
            const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
            const dd = String(date.getUTCDate()).padStart(2, "0");
            const yyyy = date.getUTCFullYear();

            val = `${mm}/${dd}/${yyyy}`;
          }
        }

        return `"${String(val).replace(/"/g, '""')}"`;
      })
      .join(",");
    csv += row + "\n";
  });

  return csv;
};

// --- Mobile Order Row ---
const OrderMobileCard = ({ item }) => (
  <div className="p-4 border-b border-slate-800 bg-slate-900/30 space-y-3">
    <div className="flex justify-between items-start">
      <div>
        <div className="text-white font-bold text-sm">
          {item.FName} {item.LName}
        </div>
        <div className="text-[10px] text-green-400 font-medium bg-green-900/20 px-1.5 py-0.5 rounded mt-1 inline-block">
          {item.base}
        </div>
      </div>
      <div className="text-[10px] text-slate-500 font-mono">
        {new Date(item.purchaseDate).toLocaleDateString()}
      </div>
    </div>

    <div className="grid grid-cols-2 gap-4 text-[11px]">
      <div className="space-y-1">
        <div className="text-slate-500 flex items-center gap-1 uppercase tracking-wider font-bold">
          <FaUser size={8} /> Identity
        </div>
        <div className="text-slate-300 font-mono">SSN: {item.SSN}</div>
        <div className="text-slate-300 font-mono">
          DOB: {item.DOB ? new Date(item.DOB).toLocaleDateString() : "N/A"}
        </div>
      </div>
      <div className="space-y-1">
        <div className="text-slate-500 flex items-center gap-1 uppercase tracking-wider font-bold">
          <FaMapMarkerAlt size={8} /> Location
        </div>
        <div className="text-slate-300">
          {item.City}, {item.State}
        </div>
        <div className="text-slate-400 font-mono">{item.Zip}</div>
      </div>
    </div>

    <div className="bg-slate-950/50 p-2 rounded border border-slate-800 space-y-1">
      <div className="text-slate-500 flex items-center gap-1 uppercase tracking-wider font-bold text-[9px] mb-1">
        <FaKey size={8} /> Credentials
      </div>
      <div className="flex justify-between font-mono text-[11px]">
        <span className="text-slate-500 truncate mr-2">U: {item.Username}</span>
        <span className="text-slate-500 truncate">P: {item.Password}</span>
      </div>
      <div className="flex justify-between items-center font-mono text-[11px]">
        <span className="text-green-400 truncate pr-2">
          2FA: {item.twoFA || "N/A"}
        </span>
        {item.twoFA && (
          <button
            onClick={() => navigator.clipboard.writeText(item.twoFA)}
            className="text-slate-500 active:text-white p-1"
          >
            <FaCopy size={12} />
          </button>
        )}
      </div>
    </div>
  </div>
);

// --- BatchCard ---
function BatchCard({ batchKey, orders, isSelected, onToggleSelect }) {
  const [expanded, setExpanded] = useState(false);
  const isSolo = batchKey === "__solo__";
  const label = isSolo ? "No Batch" : batchKey;

  const handleDownloadTxt = (e) => {
    e.stopPropagation();
    downloadFile(generateTxtContent(orders), "text/plain", `${label}.txt`);
    downloadInstructions();
  };

  const handleDownloadCsv = (e) => {
    e.stopPropagation();
    downloadFile(
      generateCsvContent(orders),
      "text/csv;charset=utf-8;",
      `${label}.csv`,
    );
    downloadInstructions();
  };

  return (
    <div
      className={`rounded-xl border transition-all duration-200 overflow-hidden ${
        isSelected
          ? "border-green-500/60 bg-green-900/10"
          : "border-slate-700/60 bg-slate-900/60"
      }`}
    >
      <div
        className="flex items-center gap-3 px-4 py-4 cursor-pointer hover:bg-slate-800/30"
        onClick={() => setExpanded(!expanded)}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleSelect(batchKey);
          }}
          className={`flex-shrink-0 text-xl ${isSelected ? "text-green-400" : "text-slate-600"}`}
        >
          {isSelected ? <FaCheckSquare /> : <FaRegSquare />}
        </button>

        <div className="flex flex-col flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <FaLayerGroup
              className={isSolo ? "text-slate-500" : "text-green-400"}
              size={14}
            />
            <span
              className={`font-mono font-bold text-sm truncate ${isSolo ? "text-slate-400 italic" : "text-slate-200"}`}
            >
              {label}
            </span>
          </div>
          <span className="text-[10px] text-slate-500 mt-0.5">
            {orders.length} Orders
          </span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={handleDownloadTxt}
            className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-lg"
            title="TXT"
          >
            <FaDownload size={13} />
          </button>
          <button
            onClick={handleDownloadCsv}
            className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-lg"
            title="CSV"
          >
            <FaFileCsv size={13} />
          </button>
          <div
            className={`ml-1 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
          >
            <FaChevronDown className="text-slate-600" size={14} />
          </div>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-slate-800">
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="text-slate-500 uppercase bg-slate-950/60 border-b border-slate-800">
                <tr>
                  <th className="px-4 py-2">Identity</th>
                  <th className="px-4 py-2">Location</th>
                  <th className="px-4 py-2">Credentials</th>
                  <th className="px-4 py-2 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {orders.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-800/40">
                    <td className="px-4 py-2.5">
                      <div className="font-bold text-white">
                        {item.FName} {item.LName}
                      </div>
                      <div className="text-slate-500 font-mono text-[10px]">
                        SSN: {item.SSN} | DOB:{" "}
                        {item.DOB
                          ? new Date(item.DOB).toLocaleDateString()
                          : "N/A"}
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-slate-300">
                      {item.City}, {item.State} <br />{" "}
                      <span className="text-slate-500 font-mono text-[10px]">
                        {item.Zip}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 font-mono text-slate-400">
                      <div className="flex gap-2">
                        <span>U: {item.Username}</span>{" "}
                        <span>P: {item.Password}</span>
                      </div>
                      <div className="text-green-400 text-[10px]">
                        2FA: {item.twoFA || "N/A"}
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-right text-slate-500">
                      {new Date(item.purchaseDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="md:hidden">
            {orders.map((item) => (
              <OrderMobileCard key={item._id} item={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// --- Main SsnBatchOrders Component ---
function SsnBatchOrders({ ssn = [] }) {
  const [selectedBatches, setSelectedBatches] = useState(new Set());

  const { batches, batchKeys } = useMemo(() => {
    const map = {};
    (Array.isArray(ssn) ? ssn : [])
      .filter((o) => !o.isDeleted)
      .forEach((o) => {
        const key = o.purchaseBatchNumber?.trim() || "__solo__";
        if (!map[key]) map[key] = [];
        map[key].push(o);
      });
    const keys = Object.keys(map).sort((a, b) =>
      a === "__solo__" ? 1 : b === "__solo__" ? -1 : a.localeCompare(b),
    );
    return { batches: map, batchKeys: keys };
  }, [ssn]);

  const toggleBatch = (key) => {
    setSelectedBatches((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const getSelectedOrders = () =>
    Array.from(selectedBatches).flatMap((k) => batches[k]);

  if (batchKeys.length === 0) {
    return (
      <div className="py-20 text-center border-2 border-dashed border-slate-800 rounded-xl text-slate-500">
        No batches available.
      </div>
    );
  }

  return (
    <div className="max-w-full overflow-hidden space-y-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 sm:p-4 sticky top-0 z-10 shadow-xl">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-white font-medium">
              <FaBoxOpen className="text-green-500" />
              <span>{batchKeys.length} Batches</span>
            </div>
            <button
              onClick={() =>
                selectedBatches.size === batchKeys.length
                  ? setSelectedBatches(new Set())
                  : setSelectedBatches(new Set(batchKeys))
              }
              className="text-xs text-indigo-400 font-semibold uppercase tracking-tight"
            >
              {selectedBatches.size === batchKeys.length
                ? "Deselect All"
                : "Select All"}
            </button>
          </div>

          {selectedBatches.size > 0 && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  downloadFile(
                    generateTxtContent(getSelectedOrders()),
                    "text/plain",
                    "combined.txt",
                  );
                  downloadInstructions();
                }}
                className="flex-1 min-w-[120px] flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-lg text-[11px] font-bold transition-colors"
              >
                <FaDownload size={12} /> TXT ({selectedBatches.size})
              </button>
              <button
                onClick={() => {
                  downloadFile(
                    generateCsvContent(getSelectedOrders()),
                    "text/csv;charset=utf-8;",
                    "combined.csv",
                  );
                  downloadInstructions();
                }}
                className="flex-1 min-w-[120px] flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg text-[11px] font-bold transition-colors"
              >
                <FaFileCsv size={12} /> CSV ({selectedBatches.size})
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {batchKeys.map((key) => (
          <BatchCard
            key={key}
            batchKey={key}
            orders={batches[key]}
            isSelected={selectedBatches.has(key)}
            onToggleSelect={toggleBatch}
          />
        ))}
      </div>
    </div>
  );
}

export default SsnBatchOrders;
