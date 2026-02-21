import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useQuery, useMutation } from "@tanstack/react-query";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { toast } from "react-toastify";
import PulseLoader from "react-spinners/PulseLoader";
import useAuth from "../../hooks/useAuth";
import QrCodeGenerator from "../../components/QrCodeGenerator";
import Select from "react-select";
import { Loader } from "@mantine/core";
import { IconAlertTriangle, IconWallet } from "@tabler/icons-react";

function AddFunds() {
  const axios = useAxiosPrivate();
  const { auth } = useAuth();
  const userId = auth?.userId;
  const userName = auth?.userName;

  const [cryptoCurrency, setCryptoCurrency] = useState("");
  const [paymentData, setPaymentData] = useState({});

  // -- API Calls --
  const getCurrencies = () => axios.get(`/payments/currencies`);

  const { isLoading: loadingCurrencies, data: currenciesData } = useQuery(
    ["currencies"],
    getCurrencies,
    { keepPreviousData: true },
  );

  const formattedArray = currenciesData?.data?.data?.selectedCurrencies.map(
    (currency) => {
      let label;
      switch (currency) {
        case "BTC":
          label = "Bitcoin (BTC)";
          break;
        case "LTC":
          label = "Litecoin (LTC)";
          break;
        case "USDTERC20":
          label = "USDT (ERC20)";
          break;
        case "SOL":
          label = "Solana (SOL)";
          break;
        default:
          label = currency;
      }
      return { label, value: currency.toLowerCase() };
    },
  );

  const getMinAmount = () => axios.get(`/payments/minimum/${cryptoCurrency}`);

  const { data: minAmountData, refetch: refetchMinAmount } = useQuery(
    ["min-amount"],
    getMinAmount,
    {
      keepPreviousData: true,
      enabled: !!cryptoCurrency,
    },
  );

  useEffect(() => {
    if (cryptoCurrency) refetchMinAmount();
  }, [cryptoCurrency]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm();

  const createPaymentFnc = (payAddress) =>
    axios.post("/payments/create", payAddress);

  const { mutate: createPaymentMutate, isLoading: loadingCreatePayment } =
    useMutation(createPaymentFnc, {
      onSuccess: (response) => {
        toast.success(response?.data?.message);
        setPaymentData(response.data?.data?.paymentData);
      },
      onError: (err) => {
        toast.error(err?.response?.data?.message || "Something went wrong");
      },
    });

  const fetchPayments = () => axios.get(`/payments/all-transactions`);
  const { isLoading: loadingPayments, data: paymentsData } = useQuery(
    ["payments"],
    fetchPayments,
    {
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    },
  );

  const submit = (data) => {
    if (!cryptoCurrency) {
      toast.error("Please select a cryptocurrency!");
      return;
    }
    const minAmount = parseFloat(minAmountData?.data?.data?.fiat_equivalent);
    if (parseFloat(data.amount) < minAmount) {
      toast.error(`Minimum amount is $${Math.ceil(minAmount)}`);
      return;
    }
    data.userId = userId;
    data.userName = userName;
    data.cryptoCurrency = cryptoCurrency;
    data.username = auth?.user?.username;
    createPaymentMutate(data);
  };

  // -- Custom Styles for React Select in Dark Mode --
  const darkSelectStyles = {
    control: (base, state) => ({
      ...base,
      backgroundColor: "#1e293b", // slate-800
      borderColor: state.isFocused ? "#10b981" : "#334155", // green-500 : slate-700
      color: "white",
      padding: "2px",
      borderRadius: "0.5rem",
      boxShadow: state.isFocused ? "0 0 0 1px #10b981" : "none",
      "&:hover": { borderColor: "#10b981" },
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: "#1e293b",
      border: "1px solid #334155",
      borderRadius: "0.5rem",
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "#10b981"
        : state.isFocused
          ? "#334155"
          : "#1e293b",
      color: "white",
      cursor: "pointer",
    }),
    singleValue: (base) => ({ ...base, color: "white" }),
    input: (base) => ({ ...base, color: "white" }),
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header / Instructions */}
      <div className="bg-gradient-to-r from-amber-900/40 to-amber-800/20 border border-amber-700/50 rounded-2xl p-6 text-center shadow-lg">
        <div className="flex justify-center mb-2 text-amber-500">
          <IconAlertTriangle size={32} />
        </div>
        <h2 className="text-xl font-bold text-amber-400 mb-2">
          Important Deposit Rules
        </h2>
        <p className="text-slate-300 max-w-2xl mx-auto leading-relaxed">
          We use <strong>one-time disposable wallets</strong>. Send{" "}
          <span className="text-white font-bold underline decoration-amber-500">
            only 1 transaction
          </span>{" "}
          per generated address. Do not save addresses for future use. Funds
          sent to old addresses will be lost.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Form Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-6">
            <div className="p-2 bg-green-600/20 rounded-lg text-green-500">
              <IconWallet size={24} />
            </div>
            <h1 className="text-xl font-bold text-white">Add Funds</h1>
          </div>

          <form onSubmit={handleSubmit(submit)} className="space-y-6">
            {/* Currency Select */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-400">
                Select Cryptocurrency
              </label>
              {loadingCurrencies ? (
                <div className="flex justify-center py-2">
                  <PulseLoader color="#10b981" size={8} />
                </div>
              ) : (
                <Select
                  options={formattedArray}
                  styles={darkSelectStyles}
                  placeholder="Choose coin..."
                  onChange={(opt) => setCryptoCurrency(opt?.value)}
                />
              )}
            </div>

            {/* Amount Input */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-400">
                Amount (USD)
                {cryptoCurrency && minAmountData?.data?.data && (
                  <span className="ml-2 text-xs text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full">
                    Min: ${Math.ceil(minAmountData.data?.data?.fiat_equivalent)}
                  </span>
                )}
              </label>

              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                  $
                </span>
                <input
                  type="number"
                  disabled={!cryptoCurrency}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2.5 pl-8 pr-4 text-white placeholder-slate-500 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="0.00"
                  step="0.01"
                  {...register("amount", {
                    required: true,
                    validate: (value) =>
                      !cryptoCurrency ||
                      parseFloat(value) >=
                        parseFloat(minAmountData?.data?.data?.fiat_equivalent),
                  })}
                />
              </div>

              {errors.amount && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.amount.type === "required"
                    ? "Amount is required"
                    : `Minimum amount is $${Math.ceil(
                        minAmountData?.data?.data?.fiat_equivalent,
                      )}`}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loadingCreatePayment || !!paymentData?.order_id}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-all shadow-lg shadow-green-900/20 flex justify-center items-center gap-2"
            >
              {loadingCreatePayment ? (
                <PulseLoader color="white" size={8} />
              ) : (
                "Generate Payment Address"
              )}
            </button>
          </form>
        </div>

        {/* QR Code Area (Conditional) */}
        {paymentData?.order_id && (
          <div className="animate-in slide-in-from-right duration-500">
            <QrCodeGenerator data={paymentData} />
          </div>
        )}
      </div>

      {/* Transactions History Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden mt-8">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-lg font-bold text-white">Payment History</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-400">
            <thead className="bg-slate-950 text-slate-200 uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Wallet</th>
                <th className="px-6 py-4">Coin</th>
                <th className="px-6 py-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {loadingPayments ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center">
                    <PulseLoader color="#10b981" size={10} />
                  </td>
                </tr>
              ) : !paymentsData?.data?.data?.transactions ||
                paymentsData?.data?.data?.transactions?.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-8 text-center text-slate-500"
                  >
                    No transactions found.
                  </td>
                </tr>
              ) : (
                paymentsData.data.data.transactions.map((item, index) => (
                  <tr
                    key={index}
                    className="hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="px-6 py-4 font-mono text-xs">{item._id}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-bold ${
                          item.status?.toLowerCase() === "confirmed" ||
                          item.status === "Approved"
                            ? "bg-green-500/10 text-green-400"
                            : item.status?.toLowerCase() === "waiting"
                              ? "bg-yellow-500/10 text-yellow-400"
                              : "bg-red-500/10 text-red-400"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {item.createdAt?.substr(0, 10)}
                    </td>
                    <td
                      className="px-6 py-4 font-mono text-xs max-w-[150px] truncate"
                      title={item.payAddress}
                    >
                      {item.payAddress}
                    </td>
                    <td className="px-6 py-4 uppercase">{item.network}</td>
                    <td className="px-6 py-4 text-right font-medium text-white">
                      ${item.priceAmount}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AddFunds;
