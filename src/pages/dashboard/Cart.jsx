import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDisclosure } from "@mantine/hooks";
import { Modal, Button, Text, Group } from "@mantine/core";
import { toast } from "react-toastify";
import PulseLoader from "react-spinners/PulseLoader";

// Icons
import { CgShoppingCart } from "react-icons/cg";
import {
  FaTrashAlt,
  FaCreditCard,
  FaShoppingBag,
  FaArrowRight,
  FaExclamationTriangle,
} from "react-icons/fa";

// Hooks
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAuth from "../../hooks/useAuth";

function Cart() {
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // --- Modal State Management ---
  // 1. Delete Single Item
  const [deleteOpened, { open: openDelete, close: closeDelete }] =
    useDisclosure(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // 2. Clear All Items
  const [clearOpened, { open: openClear, close: closeClear }] =
    useDisclosure(false);

  // 3. Checkout
  const [checkoutOpened, { open: openCheckout, close: closeCheckout }] =
    useDisclosure(false);

  // --- Helpers ---
  const formatCurrency = (number) => {
    return Number.parseFloat(number)
      .toFixed(2)
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // --- 1. Fetch Cart Data ---
  const { isLoading: loadingCart, data: cartData } = useQuery(
    [`shoppingCart-${auth?.userId}`],
    async () => {
      const { data } = await axiosPrivate.get(`/cart`);
      return data;
    },
    {
      keepPreviousData: true,
      refetchOnWindowFocus: true,
    }
  );

  const cartItems = cartData?.cart?.items || [];
  const userBalance = cartData?.cart?.userBalance || 0;
  const totalItems = cartItems.length;
  const totalPrice = cartItems.reduce(
    (acc, curr) => acc + parseFloat(curr?.price?.price || 0),
    0
  );

  // --- 2. Mutations ---

  // Delete Single Item
  const { isLoading: isDeleting, mutate: deleteProduct } = useMutation(
    (id) => axiosPrivate.post(`/cart/remove`, { dobIds: [id] }),
    {
      onSuccess: (res) => {
        toast.success(res?.data?.message || "Item removed");
        queryClient.invalidateQueries([`shoppingCart-${auth?.userId}`]);
        closeDelete();
      },
      onError: (err) => {
        toast.error(err?.response?.data?.message || "Failed to remove item");
        closeDelete();
      },
    }
  );

  // Clear Entire Cart
  const { isLoading: isClearing, mutate: clearCart } = useMutation(
    () => {
      const allIds = cartItems?.map((item) => item._id) || [];
      return axiosPrivate.post(`/cart/remove`, { dobIds: allIds });
    },
    {
      onSuccess: (res) => {
        toast.success(res?.data?.message || "Cart cleared");
        queryClient.invalidateQueries([`shoppingCart-${auth?.userId}`]);
        closeClear();
      },
      onError: (err) => {
        toast.error(
          err?.response?.data?.message || err.message || "Failed to clear cart"
        );
        closeClear();
      },
    }
  );

  // Checkout
  const { isLoading: checkoutLoading, mutate: checkout } = useMutation(
    () => axiosPrivate.post(`/cart/checkout`),
    {
      onSuccess: (res) => {
        toast.success(res?.data?.message || "Order successful!");
        queryClient.invalidateQueries([`shoppingCart-${auth?.userId}`]);
        queryClient.invalidateQueries([`profile-${auth?.userId}`]);
        navigate("/dash/my-orders");
        closeCheckout();
      },
      onError: (err) => {
        toast.error(err?.response?.data?.message || "Checkout failed");
        closeCheckout();
      },
    }
  );

  // --- Handlers ---
  const handleDeleteClick = (id) => {
    setItemToDelete(id);
    openDelete();
  };

  // --- Render ---

  if (loadingCart) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center">
        <PulseLoader color="#3b82f6" size={15} />
        <p className="text-slate-500 mt-4 animate-pulse">Loading cart...</p>
      </div>
    );
  }

  const isEmpty = !cartItems || cartItems.length < 1;

  return (
    <div className="min-h-screen bg-slate-900 pb-20">
      {/* --- MODALS --- */}

      {/* 1. Delete Item Modal */}
      <Modal
        opened={deleteOpened}
        onClose={closeDelete}
        title="Remove Item"
        centered
      >
        <Text size="sm" mb="lg">
          Are you sure you want to remove this item from your cart?
        </Text>
        <Group position="right">
          <Button variant="default" onClick={closeDelete}>
            Cancel
          </Button>
          <Button
            color="red"
            onClick={() => deleteProduct(itemToDelete)}
            loading={isDeleting}
          >
            Remove
          </Button>
        </Group>
      </Modal>

      {/* 2. Clear Cart Modal */}
      <Modal
        opened={clearOpened}
        onClose={closeClear}
        title="Clear Cart"
        centered
      >
        <div className="flex items-center gap-2 text-amber-500 mb-2">
          <FaExclamationTriangle />
          <Text fw={700}>Warning</Text>
        </div>
        <Text size="sm" mb="lg">
          This will remove all {totalItems} items. This action cannot be undone.
        </Text>
        <Group position="right">
          <Button variant="default" onClick={closeClear}>
            Cancel
          </Button>
          <Button color="red" onClick={() => clearCart()}>
            Clear All
          </Button>
        </Group>
      </Modal>

      {/* 3. Checkout Modal */}
      <Modal
        opened={checkoutOpened}
        onClose={closeCheckout}
        title="Confirm Purchase"
        centered
      >
        <Text size="sm" mb="lg">
          A total of <strong>${formatCurrency(totalPrice)}</strong> will be
          deducted from your balance.
        </Text>
        <Group position="right">
          <Button variant="default" onClick={closeCheckout}>
            Cancel
          </Button>
          <Button
            color="blue"
            onClick={() => {
              if (userBalance < totalPrice) {
                navigate(`/dash/add-deficit-funds?deficit=${(totalPrice - userBalance).toFixed(2)}`);
                closeCheckout();
              } else {
                checkout();
              }
            }}
            loading={checkoutLoading}
          >
            Confirm Buy
          </Button>
        </Group>
      </Modal>

      {/* --- MAIN CONTENT --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
          <div className="p-3 bg-blue-600/20 rounded-xl text-blue-500">
            <CgShoppingCart />
          </div>
          Your Shopping Cart
        </h1>

        {isEmpty ? (
          /* --- Empty State --- */
          <div className="flex flex-col items-center justify-center bg-slate-900 border border-dashed border-slate-700 rounded-2xl p-12 text-center">
            <div className="bg-slate-800 p-6 rounded-full mb-6">
              <FaShoppingBag className="text-slate-600 text-4xl" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Your cart is empty
            </h2>
            <p className="text-slate-400 mb-8 max-w-md">
              Looks like you haven't added any products yet.
            </p>
            <Link
              to="/dash/ssn"
              className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-medium transition-all shadow-lg shadow-blue-900/20 flex items-center gap-2"
            >
              Start Shopping <FaArrowRight size={14} />
            </Link>
          </div>
        ) : (
          /* --- Cart Grid --- */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Items */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-950 text-slate-400 uppercase text-xs">
                      <tr>
                        <th className="p-4 border-b border-slate-800">Type</th>
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
                      {cartItems.map((item, index) => (
                        <tr
                          key={item._id || index}
                          className="hover:bg-slate-800/50 transition-colors"
                        >
                          <td className="p-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900/30 text-blue-400 border border-blue-900/50">
                              {item.price?.base || "Unknown"}
                            </span>
                          </td>
                          <td className="p-4 text-sm text-slate-300">
                            <span className="font-mono text-slate-500">
                              ID: {item._id?.substring(0, 8)}
                            </span>
                          </td>
                          <td className="p-4 text-right font-bold text-green-400">
                            ${formatCurrency(item.price?.price)}
                          </td>
                          <td className="p-4 text-center">
                            <button
                              onClick={() => handleDeleteClick(item._id)}
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

              {/* Clear All Button */}
              <div className="flex justify-end">
                <button
                  onClick={openClear}
                  className="text-sm text-red-400 hover:text-red-300 flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-red-500/10 transition-colors"
                >
                  <FaTrashAlt size={12} /> Clear Entire Cart
                </button>
              </div>
            </div>

            {/* Right Column: Summary */}
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
                    onClick={openCheckout}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white py-3.5 rounded-lg font-bold shadow-lg shadow-blue-900/20 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
                  >
                    <FaCreditCard /> Checkout
                  </button>
                )}

                <div className="mt-4 text-center">
                  <p className="text-xs text-slate-500">
                    By clicking checkout, you agree to our terms of service.
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
