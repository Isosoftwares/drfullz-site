import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAuth from "../../hooks/useAuth";
import PulseLoader from "react-spinners/PulseLoader";
import { FaIdCard } from "react-icons/fa";
import SsnOrders from "./orderpages/SsnOrders";

function MyOrders(props) {
  const axios = useAxiosPrivate();
  const { auth } = useAuth();
  const userId = auth?.userId;

  const fetchOrders = () => {
    return axios.get(`/cart/orders`);
  };

  const { isLoading: loadingOrders, data: orders } = useQuery(
    [`orders-${userId}`],
    fetchOrders,
    { keepPreviousData: true, retry: 1 },
  );

  const ssnOrders = orders?.data?.orders || [];

  return (
    <div className="space-y-6 pb-20">
      {/* --- HEADER --- */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
            <FaIdCard className="text-green-500" />
            My SSN Orders
          </h1>
          <p className="text-slate-400 text-sm">
            View and download your purchased Fullz/SSN records.
            <span className="text-amber-500 font-semibold ml-1 block sm:inline">
              Note: Save data locally immediately. Data is DELETED 72 hours
              after purchase.
            </span>
          </p>
        </div>
        <div className="hidden sm:block text-right">
          <div className="text-3xl font-bold text-white">
            {ssnOrders.length}
            <div className="text-xs text-green-400 mt-1 font-medium bg-green-900/20 inline-block px-1.5 py-0.5 rounded">
              Total Orders
            </div>
          </div>
        </div>
      </div>

      {loadingOrders ? (
        <div className="h-96 flex flex-col justify-center items-center bg-slate-900 rounded-xl border border-slate-800">
          <PulseLoader color="#10b981" size={15} />
          <p className="text-slate-500 mt-4 animate-pulse">
            Retrieving your secure orders...
          </p>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-xl overflow-hidden min-h-[600px] p-4 md:p-6">
          <SsnOrders ssn={ssnOrders} />
        </div>
      )}
    </div>
  );
}

export default MyOrders;
