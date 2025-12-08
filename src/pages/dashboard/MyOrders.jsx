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
  const userId = auth?.roles?.includes("Admin") ? props?.buyerId : auth?.userId;

  const fetchOrders = () => {
    return axios.get(`/orders/${userId}`);
  };

  const { isLoading: loadingOrders, data: orders } = useQuery(
    [`orders-${userId}`],
    fetchOrders,
    { keepPreviousData: true, retry: 1 }
  );

  const ssnOrders = orders?.data?.ssn || [];

  return (
    <div className="space-y-6 pb-20">
      {/* --- HEADER --- */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
            <FaIdCard className="text-blue-500" />
            My SSN Orders
          </h1>
          <p className="text-slate-400 text-sm">
            View and download your purchased Fullz/SSN records.
            <span className="text-amber-500 font-semibold ml-1 block sm:inline">
              Note: Save data locally immediately.
            </span>
          </p>
        </div>
        <div className="hidden sm:block text-right">
          <div className="text-3xl font-bold text-white">
            {ssnOrders.length}
          </div>
          <div className="text-xs text-slate-500 uppercase tracking-wider">
            Total Orders
          </div>
        </div>
      </div>

      {loadingOrders ? (
        <div className="h-96 flex flex-col justify-center items-center bg-slate-900 rounded-xl border border-slate-800">
          <PulseLoader color="#3b82f6" size={15} />
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
