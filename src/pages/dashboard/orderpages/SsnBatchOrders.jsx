import React, { useMemo, useState } from "react";
import {
  FaDownload,
  FaFileCsv,
  FaLayerGroup,
  FaBoxOpen,
  FaCheckSquare,
  FaRegSquare,
  FaList,
  FaChevronDown,
  FaChevronUp,
  FaCopy
} from "react-icons/fa";

// ─── Shared Download Helpers ────────────────────────────────────────────────

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
    content += `2FA:               ${o.twoFA || "N/A"}\n`;
    content += `Backup Code:       ${o.BackupCode}\n`;
    content += `Description:       ${o.Description || "N/A"}\n`;
    content += `Enrollment Detail: ${o.EnrollmentDetails || "N/A"}\n`;
    content += `Enrollment Status: ${o.EnrollmentStatus || "N/A"}\n`;
    content += `Batch:             ${o.purchaseBatchNumber || "N/A"}\n`;
    content += `Purchased:         ${o.purchaseDate ? new Date(o.purchaseDate).toLocaleString() : "N/A"}\n\n`;
  });
  return content;
};

const toMMDDYYYY = (isoStr) => {
  if (!isoStr) return "";
  const [year, month, day] = String(isoStr).split("T")[0].split("-");
  return `${month}/${day}/${year}`;
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
    "base",
    "purchaseBatchNumber",
  ];
  let csv = headers.join(",") + "\n";
  orders.forEach((o) => {
    const row = headers
      .map((h) => {
        let val = o[h] || "";
        if ((h === "DOB" || h === "purchaseDate") && val) {
          val = toMMDDYYYY(val);
        }
        return `"${String(val).replace(/"/g, '""')}"`;
      })
      .join(",");
    csv += row + "\n";
  });
  return csv;
};

// ─── BatchCard ───────────────────────────────────────────────────────────────

function BatchCard({ batchKey, orders, isSelected, onToggleSelect }) {
  const [expanded, setExpanded] = useState(true);

  const isSolo = batchKey === "__solo__";
  const label = isSolo ? "No Batch" : batchKey;
  const subLabel = isSolo
    ? "Orders without a batch number"
    : `${orders.length} order${orders.length !== 1 ? "s" : ""}`;

  const handleDownloadTxt = (e) => {
    e.stopPropagation();
    const filename = isSolo ? "no-batch-orders.txt" : `${batchKey}.txt`;
    downloadFile(generateTxtContent(orders), "text/plain", filename);
    downloadInstructions();
  };

  const handleDownloadCsv = (e) => {
    e.stopPropagation();
    const filename = isSolo ? "no-batch-orders.csv" : `${batchKey}.csv`;
    downloadFile(
      generateCsvContent(orders),
      "text/csv;charset=utf-8;",
      filename,
    );
    downloadInstructions();
  };

  return (
    <div
      className={`rounded-xl border transition-all duration-200 overflow-hidden ${
        isSelected
          ? "border-green-500/60 bg-green-900/10 shadow-md shadow-green-900/20"
          : "border-slate-700/60 bg-slate-900/60 hover:border-slate-600"
      }`}
    >
      {/* Header row */}
      <div className="flex items-center gap-3 px-4 py-3">
        {/* Select checkbox */}
        <button
          onClick={() => onToggleSelect(batchKey)}
          className={`flex-shrink-0 text-lg transition-colors ${
            isSelected
              ? "text-green-400"
              : "text-slate-600 hover:text-slate-400"
          }`}
          title={isSelected ? "Deselect batch" : "Select batch"}
        >
          {isSelected ? <FaCheckSquare /> : <FaRegSquare />}
        </button>

        {/* Batch icon + label */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <FaLayerGroup
            className={`flex-shrink-0 ${isSolo ? "text-slate-500" : "text-green-400"}`}
            size={14}
          />
          <span
            className={`font-mono font-semibold text-sm truncate ${
              isSolo ? "text-slate-400 italic" : "text-slate-200"
            }`}
          >
            {label}
          </span>
          <span className="bg-slate-800 border border-slate-700 text-xs text-slate-400 px-2 py-0.5 rounded-full flex-shrink-0">
            {orders.length}
          </span>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={handleDownloadTxt}
            className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 hover:border-slate-600 transition-colors"
            title="Download TXT"
          >
            <FaDownload size={10} />
            <span className="hidden sm:inline">TXT</span>
          </button>
          <button
            onClick={handleDownloadCsv}
            className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 hover:border-slate-600 transition-colors"
            title="Download CSV"
          >
            <FaFileCsv size={10} />
            <span className="hidden sm:inline">CSV</span>
          </button>
          <button
            onClick={() => setExpanded((v) => !v)}
            className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 border border-slate-700 hover:border-slate-600 transition-colors"
            title={expanded ? "Collapse" : "Preview orders"}
          >
            <FaList size={9} />
            {expanded ? <FaChevronUp size={9} /> : <FaChevronDown size={9} />}
          </button>
        </div>
      </div>

      {/* Expanded table */}
      {expanded && (
        <div className="border-t border-slate-800 overflow-x-auto overflow-hidden">
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
                <tr
                  key={item._id}
                  className="hover:bg-slate-800/40 transition-colors"
                >
                  <td className="px-4 py-2.5 align-top">
                    <div className="font-bold text-white">
                      {item.FName} {item.LName}
                    </div>
                    <div className="text-slate-400 font-mono mt-0.5">
                      <span className="text-slate-500">SSN:</span> {item.SSN}
                      <span className="mx-1.5 text-slate-700">|</span>
                      <span className="text-slate-500">DOB:</span>{" "}
                      {item.DOB
                        ? new Date(item.DOB).toLocaleDateString()
                        : "N/A"}
                    </div>
                    <div className="text-green-400 mt-1 font-medium bg-green-900/20 inline-block px-1.5 py-0.5 rounded text-xs">
                      {item.base}
                    </div>
                  </td>
                  <td className="px-4 py-2.5 align-top text-slate-300">
                    <div>
                      {item.City}, {item.State || "—"}
                    </div>
                    <div className="text-slate-500 font-mono mt-0.5">
                      {item.Zip || "—"}
                    </div>
                  </td>
                  <td className="px-4 py-2.5 align-top font-mono text-slate-400 space-y-0.5">
                    <div>
                      <span className="text-slate-600">User: </span>
                      {item.Username}
                    </div>
                    <div>
                      <span className="text-slate-600">Pass: </span>
                      {item.Password}
                    </div>
                    <div>
                      <span className="text-slate-600 w-16">2FA: </span>
                      <span className="text-green-400 truncate max-w-[140px]">{item.twoFA || "N/A"}</span>
                      {/* add a copy button if they have a 2FA   */}
                      {item.twoFA && (
                        <button
                        title="Copy 2FA"
                          onClick={() =>
                            navigator.clipboard.writeText(item.twoFA)
                          }
                          className="text-slate-500 hover:text-white"
                        >
                          <FaCopy size={12} />
                        </button>
                      )}
                    </div>
                    <div>
                      <span className="text-slate-600">BK: </span>
                      <span className="text-yellow-400">{item.BackupCode}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2.5 align-top text-right text-slate-500">
                    {new Date(item.purchaseDate).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── SsnBatchOrders (main export) ────────────────────────────────────────────

function SsnBatchOrders({ ssn = [] }) {
  const [selectedBatches, setSelectedBatches] = useState(new Set());

  // Group by purchaseBatchNumber; orders without one go to "__solo__"
  const { batches, batchKeys } = useMemo(() => {
    const map = {};
    (Array.isArray(ssn) ? ssn : [])
      .filter((o) => !o.isDeleted)
      .forEach((o) => {
        const key = o.purchaseBatchNumber?.trim() || "__solo__";
        if (!map[key]) map[key] = [];
        map[key].push(o);
      });

    // Sort: named batches first (alphabetically), then __solo__
    const keys = Object.keys(map).sort((a, b) => {
      if (a === "__solo__") return 1;
      if (b === "__solo__") return -1;
      return a.localeCompare(b);
    });

    return { batches: map, batchKeys: keys };
  }, [ssn]);

  const totalOrders = useMemo(
    () => batchKeys.reduce((acc, k) => acc + batches[k].length, 0),
    [batches, batchKeys],
  );

  // ── Selection helpers ──────────────────────────────────────────────────────
  const toggleBatch = (key) => {
    setSelectedBatches((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const selectAll = () => setSelectedBatches(new Set(batchKeys));
  const clearAll = () => setSelectedBatches(new Set());

  const allSelected =
    batchKeys.length > 0 && batchKeys.every((k) => selectedBatches.has(k));

  // ── Derived orders for combined download ──────────────────────────────────
  const selectedOrders = useMemo(() => {
    return Array.from(selectedBatches).flatMap((k) => batches[k] || []);
  }, [selectedBatches, batches]);

  const allOrders = useMemo(
    () => batchKeys.flatMap((k) => batches[k]),
    [batches, batchKeys],
  );

  // ── Combine-download handlers ──────────────────────────────────────────────
  const handleCombinedTxt = () => {
    if (!selectedOrders.length) return;
    const label =
      selectedBatches.size === 1 ? Array.from(selectedBatches)[0] : "combined";
    downloadFile(
      generateTxtContent(selectedOrders),
      "text/plain",
      `${label}-orders.txt`,
    );
    downloadInstructions();
  };

  const handleCombinedCsv = () => {
    if (!selectedOrders.length) return;
    const label =
      selectedBatches.size === 1 ? Array.from(selectedBatches)[0] : "combined";
    downloadFile(
      generateCsvContent(selectedOrders),
      "text/csv;charset=utf-8;",
      `${label}-orders.csv`,
    );
    downloadInstructions();
  };

  const handleDownloadAllTxt = () => {
    if (!allOrders.length) return;
    downloadFile(
      generateTxtContent(allOrders),
      "text/plain",
      "all-ssn-orders.txt",
    );
    downloadInstructions();
  };

  const handleDownloadAllCsv = () => {
    if (!allOrders.length) return;
    downloadFile(
      generateCsvContent(allOrders),
      "text/csv;charset=utf-8;",
      "all-ssn-orders.csv",
    );
    downloadInstructions();
  };

  // ─────────────────────────────────────────────────────────────────────────
  if (totalOrders === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-slate-800/20 rounded-xl border border-dashed border-slate-700 text-center">
        <div className="text-slate-600 mb-4 text-4xl">📦</div>
        <h3 className="text-slate-400 text-lg font-medium">No batches found</h3>
        <p className="text-slate-500 text-sm">
          SSN orders with batch numbers will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* ── Top toolbar ──────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-3">
        {/* Stats */}
        <div className="flex items-center gap-3 text-sm text-slate-400">
          <FaBoxOpen className="text-green-500" />
          <span>
            <span className="text-white font-semibold">{batchKeys.length}</span>{" "}
            batch{batchKeys.length !== 1 ? "es" : ""}
          </span>
          <span className="text-slate-700">·</span>
          <span>
            <span className="text-white font-semibold">{totalOrders}</span>{" "}
            total
          </span>
          {selectedBatches.size > 0 && (
            <>
              <span className="text-slate-700">·</span>
              <span className="text-green-400 font-semibold">
                {selectedBatches.size} selected ({selectedOrders.length} orders)
              </span>
            </>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-2 items-center">
          {/* Select / Deselect all */}
          <button
            onClick={allSelected ? clearAll : selectAll}
            className="text-xs px-3 py-1.5 rounded border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            {allSelected ? "Deselect All" : "Select All Batches"}
          </button>

          {/* Combined download – only when batches are selected */}
          {selectedBatches.size > 0 && (
            <>
              <button
                onClick={handleCombinedTxt}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded bg-indigo-700 hover:bg-indigo-600 text-white border border-indigo-600 transition-colors"
              >
                <FaDownload size={10} />
                Combined TXT ({selectedBatches.size})
              </button>
              <button
                onClick={handleCombinedCsv}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded bg-indigo-700 hover:bg-indigo-600 text-white border border-indigo-600 transition-colors"
              >
                <FaFileCsv size={10} />
                Combined CSV ({selectedBatches.size})
              </button>
            </>
          )}

          {/* Download all */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleDownloadAllTxt}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded bg-green-800 hover:bg-green-700 text-white border border-green-700 transition-colors"
            >
              <FaDownload size={10} />
              All TXT
            </button>
            <button
              onClick={handleDownloadAllCsv}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded bg-green-800 hover:bg-green-700 text-white border border-green-700 transition-colors"
            >
              <FaFileCsv size={10} />
              All CSV
            </button>
          </div>
        </div>
      </div>

      {/* ── Helper tip ────────────────────────────────────────────────────── */}
      {selectedBatches.size === 0 && (
        <p className="text-xs text-slate-500 px-1">
          ☑ Check the boxes next to batches to select them for a combined
          download.
        </p>
      )}

      {/* ── Batch cards ───────────────────────────────────────────────────── */}
      <div className="space-y-2">
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
