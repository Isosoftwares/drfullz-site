import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CgShoppingCart } from "react-icons/cg";
import {
  FaTrashAlt,
  FaCreditCard,
  FaShoppingBag,
  FaArrowRight,
  FaExclamationTriangle,
} from "react-icons/fa";
import PulseLoader from "react-spinners/PulseLoader";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAuth from "../../hooks/useAuth";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { toast } from "react-toastify";

function Cart() {
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [productId, setDeleteId] = useState("");
  const queryClient = useQueryClient();

  const productMap = {
    gVoice: "Google Voice",
    mail: "TextNow/Mail",
    file: "Files / Logs",
    dump: "Card Dumps",
    card: "Credit Card",
    account: "Account",
    ssn: "Fullz / SSN",
  };

  // --- Data Fetching ---
  const { isLoading: loadingCart, data: cartData } = useQuery(
    [`shoppingCart-${auth?.userId}`],
    async () => {
      const { data } = await axiosPrivate.get(`/cart/${auth?.userId}`);
      return data;
    },
    {
      keepPreviousData: true,
      refetchInterval: 5000,
    }
  );

  const totalItems = cartData?.cart?.length || 0;
  const totalPrice =
    cartData?.cart?.reduce((acc, curr) => acc + parseFloat(curr.price), 0) || 0;

  const formatCurrency = (number) => {
    return Number.parseFloat(number)
      .toFixed(2)
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // --- Delete Single Item ---
  const { isLoading: isDeleting, mutate: deleteProductMutate } = useMutation(
    () => axiosPrivate.delete(`/cart/${auth?.userId}/product/${productId}`),
    {
      onSuccess: (res) => {
        toast.success(res?.data.message || "Item removed");
        queryClient.invalidateQueries([`shoppingCart-${auth?.userId}`]);
      },
      onError: (err) =>
        toast.error(err?.response?.data?.message || "Failed to remove item"),
    }
  );

  const confirmDelete = (id) => {
    setDeleteId(id);
    confirmAlert({
      customUI: ({ onClose }) => (
        <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl shadow-2xl max-w-sm w-full">
          <h1 className="font-bold text-xl text-white mb-2">Remove Item?</h1>
          <p className="text-slate-400 text-sm mb-6">
            Are you sure you want to remove this item from your cart?
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                deleteProductMutate();
                onClose();
              }}
              className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Remove
            </button>
          </div>
        </div>
      ),
    });
  };

  // --- Clear Cart ---
  const { mutate: clearCartMutate } = useMutation(
    () => axiosPrivate.delete(`/cart/products/${auth?.userId}`),
    {
      onSuccess: (res) => {
        toast.success(res?.data.message || "Cart cleared");
        queryClient.invalidateQueries([`shoppingCart-${auth?.userId}`]);
      },
      onError: (err) =>
        toast.error(err?.response?.data?.message || "Failed to clear cart"),
    }
  );

  const confirmClearCart = () => {
    confirmAlert({
      customUI: ({ onClose }) => (
        <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl shadow-2xl max-w-sm w-full">
          <div className="flex items-center gap-2 text-amber-500 mb-2">
            <FaExclamationTriangle />
            <h1 className="font-bold text-xl text-white">Clear Cart?</h1>
          </div>
          <p className="text-slate-400 text-sm mb-6">
            This will remove all {totalItems} items. This action cannot be
            undone.
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                clearCartMutate();
                onClose();
              }}
              className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Clear All
            </button>
          </div>
        </div>
      ),
    });
  };

  // --- Checkout ---
  const { isLoading: checkoutLoading, mutate: checkoutMutate } = useMutation(
    () => axiosPrivate.post(`/orders/${auth?.userId}`),
    {
      onSuccess: (res) => {
        toast.success(res?.data.message || "Order successful!");
        queryClient.invalidateQueries([`shoppingCart-${auth?.userId}`]);
        navigate("/dash/my-orders"); // Redirect to orders page
      },
      onError: (err) =>
        toast.error(err?.response?.data?.message || "Checkout failed"),
    }
  );

  const confirmCheckout = () => {
    confirmAlert({
      customUI: ({ onClose }) => (
        <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl shadow-2xl max-w-sm w-full">
          <h1 className="font-bold text-xl text-white mb-2">
            Confirm Purchase
          </h1>
          <p className="text-slate-400 text-sm mb-6">
            A total of{" "}
            <span className="text-green-400 font-bold">
              ${formatCurrency(totalPrice)}
            </span>{" "}
            will be deducted from your balance.
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                checkoutMutate();
                onClose();
              }}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Confirm Buy
            </button>
          </div>
        </div>
      ),
    });
  };

  if (loadingCart) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center">
        <PulseLoader color="#3b82f6" size={15} />
        <p className="text-slate-500 mt-4 animate-pulse">Loading cart...</p>
      </div>
    );
  }

  const isEmpty = !cartData?.cart || cartData.cart.length < 1;

  return (
    <div className="min-h-screen bg-slate-900 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
          <div className="p-3 bg-blue-600/20 rounded-xl text-blue-500">
            <CgShoppingCart />
          </div>
          Your Shopping Cart
        </h1>

        {isEmpty ? (
          /* --- EMPTY STATE --- */
          <div className="flex flex-col items-center justify-center bg-slate-900 border border-dashed border-slate-700 rounded-2xl p-12 text-center">
            <div className="bg-slate-800 p-6 rounded-full mb-6">
              <FaShoppingBag className="text-slate-600 text-4xl" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Your cart is empty
            </h2>
            <p className="text-slate-400 mb-8 max-w-md">
              Looks like you haven't added any products yet. Explore our market
              to find what you need.
            </p>
            <Link
              to="/dash/ssn"
              className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-medium transition-all shadow-lg shadow-blue-900/20 flex items-center gap-2"
            >
              Start Shopping <FaArrowRight size={14} />
            </Link>
          </div>
        ) : (
          /* --- CART CONTENT --- */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Cart Items List */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-950 text-slate-400 uppercase text-xs">
                      <tr>
                        <th className="p-4 border-b border-slate-800">
                          Product Type
                        </th>
                        <th className="p-4 border-b border-slate-800">
                          Details
                        </th>
                        <th className="p-4 border-b border-slate-800 text-right">
                          Price
                        </th>
                        <th className="p-4 border-b border-slate-800 text-center">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {cartData.cart.map((item, index) => (
                        <tr
                          key={item._id || index}
                          className="hover:bg-slate-800/50 transition-colors"
                        >
                          <td className="p-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900/30 text-blue-400 border border-blue-900/50">
                              {productMap[item.category] || "Product"}
                            </span>
                          </td>
                          <td className="p-4 text-sm text-slate-300">
                            {/* You can add more specific details here if your API returns them (e.g., bin, state) */}
                            <span className="font-mono text-slate-500">
                              ID: {item.productId.substring(0, 8)}...
                            </span>
                          </td>
                          <td className="p-4 text-right font-bold text-green-400">
                            ${formatCurrency(item.price)}
                          </td>
                          <td className="p-4 text-center">
                            <button
                              onClick={() => confirmDelete(item.productId)}
                              disabled={isDeleting}
                              className="text-slate-500 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-500/10"
                              title="Remove Item"
                            >
                              <FaTrashAlt />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Clear Cart Button (Below Table) */}
              <div className="flex justify-end">
                <button
                  onClick={confirmClearCart}
                  className="text-sm text-red-400 hover:text-red-300 flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-red-500/10 transition-colors"
                >
                  <FaTrashAlt size={12} /> Clear Entire Cart
                </button>
              </div>
            </div>

            {/* Right: Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-xl sticky top-24">
                <h2 className="text-xl font-bold text-white mb-6">
                  Order Summary
                </h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-slate-400">
                    <span>Total Items</span>
                    <span className="text-white">{totalItems}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Subtotal</span>
                    <span className="text-white">
                      ${formatCurrency(totalPrice)}
                    </span>
                  </div>
                  <div className="h-px bg-slate-700 my-2"></div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-white">Total</span>
                    <span className="text-2xl font-bold text-green-400">
                      ${formatCurrency(totalPrice)}
                    </span>
                  </div>
                </div>

                {checkoutLoading ? (
                  <button
                    disabled
                    className="w-full bg-slate-700 text-slate-400 py-3 rounded-lg font-bold flex justify-center items-center cursor-not-allowed"
                  >
                    <PulseLoader color="#94a3b8" size={8} />
                  </button>
                ) : (
                  <button
                    onClick={confirmCheckout}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white py-3.5 rounded-lg font-bold shadow-lg shadow-blue-900/20 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
                  >
                    <FaCreditCard /> Checkout
                  </button>
                )}

                <div className="mt-4 text-center">
                  <p className="text-xs text-slate-500">
                    By clicking checkout, you agree to our terms of service.
                    Funds will be deducted immediately.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;
