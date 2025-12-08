import React, { useState } from "react";
import QRCode from "qrcode.react";
import btcIcon from "../assets/graphics/btc.png";
import solIcon from "../assets/graphics/sol.svg";
import liteIcon from "../assets/graphics/lite.png";
import usdtIcon from "../assets/graphics/usdc.png";
import { FaCopy, FaCheck } from "react-icons/fa";
import { Alert } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";

function QrCodeGenerator({ data }) {
  const [copyText, setCopyText] = useState(false);
  const [copyAmount, setCopyAmount] = useState(false);

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === "address") {
      setCopyText(true);
      setTimeout(() => setCopyText(false), 2000);
    } else {
      setCopyAmount(true);
      setTimeout(() => setCopyAmount(false), 2000);
    }
  };

  const iconObj = {
    btc: btcIcon,
    usdterc20: usdtIcon,
    ltc: liteIcon,
    sol: solIcon,
  };

  if (!data) return null;

  // Configuration for QR Code Overlay
  const qrCodeSize = 200;
  const iconSize = 40;
  const iconStyle = {
    position: "absolute",
    top: `calc(50% - ${iconSize / 2}px)`,
    left: `calc(50% - ${iconSize / 2}px)`,
    width: `${iconSize}px`,
    height: `${iconSize}px`,
    borderRadius: "50%",
    backgroundColor: "white",
    padding: "2px",
    zIndex: 10,
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-xl w-full max-w-lg mx-auto">
      {/* Warning Alert for USDT */}
      {data?.pay_currency === "usdterc20" && (
        <div className="mb-4">
          <Alert
            icon={<IconAlertCircle size="1rem" />}
            title="Important Network Warning"
            color="red"
            variant="light"
            radius="md"
          >
            Only send USDT via the <strong>ERC20</strong> network. Sending from
            other networks (TRC20, BEP20) will result in permanent loss of
            funds.
          </Alert>
        </div>
      )}

      {/* QR Code Section */}
      <div className="flex flex-col items-center mb-6">
        <div className="relative p-4 bg-white rounded-xl shadow-inner">
          <QRCode
            size={qrCodeSize}
            value={`${data?.pay_currency}:${data?.pay_address}?amount=${data?.pay_amount}`}
            level={"H"}
            includeMargin={true}
          />
          {iconObj[data?.pay_currency] && (
            <img
              src={iconObj[data?.pay_currency]}
              alt="Icon"
              style={iconStyle}
            />
          )}
        </div>
        <p className="mt-4 text-slate-400 text-sm font-medium uppercase tracking-wider">
          Scan to Pay
        </p>
      </div>

      {/* Address Copy Section */}
      <div className="space-y-4">
        <div>
          <label className="text-xs text-slate-400 uppercase font-bold ml-1">
            Wallet Address
          </label>
          <div
            onClick={() => handleCopy(data?.pay_address, "address")}
            className="group mt-1 flex items-center justify-between bg-slate-900 border border-slate-700 hover:border-blue-500 rounded-lg p-3 cursor-pointer transition-all duration-200"
          >
            <p className="text-slate-200 text-sm font-mono break-all pr-2">
              {data?.pay_address}
            </p>
            <div className="text-slate-500 group-hover:text-blue-400 transition-colors">
              {copyText ? (
                <FaCheck size={16} className="text-green-500" />
              ) : (
                <FaCopy size={16} />
              )}
            </div>
          </div>
        </div>

        {/* Amount Copy Section */}
        <div>
          <label className="text-xs text-slate-400 uppercase font-bold ml-1">
            Exact Amount
          </label>
          <div
            onClick={() => handleCopy(data?.pay_amount, "amount")}
            className="group mt-1 flex items-center justify-between bg-slate-900 border border-slate-700 hover:border-blue-500 rounded-lg p-3 cursor-pointer transition-all duration-200"
          >
            <p className="text-slate-200 text-sm font-mono font-bold">
              {data?.pay_amount}{" "}
              <span className="uppercase text-slate-500 ml-1">
                {data?.pay_currency}
              </span>
            </p>
            <div className="text-slate-500 group-hover:text-blue-400 transition-colors">
              {copyAmount ? (
                <FaCheck size={16} className="text-green-500" />
              ) : (
                <FaCopy size={16} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QrCodeGenerator;
