import React, { useState, useEffect, useMemo } from "react";
import Select from "react-select";
import PulseLoader from "react-spinners/PulseLoader";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { Pagination } from "@mantine/core";
import filterOptions from "../filterOptions";
import countryList from "react-select-country-list";
import { CgShoppingCart } from "react-icons/cg";
import { FaFilter, FaTimes, FaCheck, FaSearch } from "react-icons/fa";
import { BiCartDownload } from "react-icons/bi";
import useAuth from "../../hooks/useAuth";
import { toast } from "react-toastify";
import MultiRangeSlider from "multi-range-slider-react";

function SSNDOB() {
  const axios = useAxiosPrivate();
  const date = new Date();
  const currentYear = date.getFullYear();
  const countryOptions = useMemo(() => countryList().getData(), []);
  const { auth } = useAuth();
  const queryClient = useQueryClient();

  // -- State Management --
  const [showFilters, setShowFilters] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);
  const [isBulkAdding, setIsBulkAdding] = useState(false);

  // Filters
  const [perPage, setPerPage] = useState(50);
  const [activePage, setPage] = useState(1);
  const [base, setBase] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [country1, setCountry1] = useState("");
  const [cs, setCs] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState("");

  const statusOptions = [
    { label: "Enrolled", value: "Enrolled" },
    { label: "Graduated", value: "Graduated" },
    { label: "Withdrawn", value: "Withdrawn" },
  ];

  // Slider State
  const [minValue, set_minValue] = useState(1910);
  const [maxValue, set_maxValue] = useState(currentYear);

  // -- API Calls --
  const fetchFiles = () => {
    return axios.get(
      `/ssn?page=${activePage}&perPage=${perPage}&base=${
        base?.id || ""
      }&city=${city}&zip=${zip}&country=${country1}&dob=${minValue}&dobMax=${maxValue}&cs=${cs}&name=${name}&state=${state}&fStatus=${status}`
    );
  };

  const {
    isLoading: loadingSsns,
    data: ssnData,
    refetch,
    isRefetching: refetchinSsn,
  } = useQuery(["ssns", activePage], fetchFiles, {
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  });

  const totalPages = Math.ceil((ssnData?.data?.count || 0) / perPage);

  useEffect(() => {
    refetch();
    setSelectedIds([]);
  }, [
    activePage,
    perPage,
    base,
    state,
    city,
    zip,
    country1,
    cs,
    minValue,
    maxValue,
    name,
    status,
  ]);


  const getBases = () => axios.get(`/base`);
  const { data: basesData } = useQuery(["bases-"], getBases, {
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  });

  const baseOptions =
    basesData?.data?.bases?.map((b) => ({
      label: b.base,
      value: { base: b.base, showDescription: b.showDescription, id: b._id },
    })) || [];

  const createCart = (cartData) => axios.post("/cart/add", cartData);

  const { mutate: cartMutate, isLoading: loadingCart } = useMutation(
    createCart,
    {
      onSuccess: (response) => {
        toast.success(response?.data?.message || "Added to cart");
        queryClient.invalidateQueries([`shoppingCart-${auth?.userId}`]);
      },
      onError: (err) => {
        toast.error(err?.response?.data?.message || "Failed to add to cart");
      },
    }
  );

  const onSubmitting = (productId) => {
    cartMutate({
      userId: auth?.userId,
      dobIds: [productId],
      productType: "ssn",
    });
  };

  const handleBulkAdd = async () => {
    if (selectedIds.length === 0) return;
    setIsBulkAdding(true);

    try {
      await axios.post("/cart/add", {
        userId: auth?.userId,
        dobIds: selectedIds,
      });
      toast.success(`Successfully added ${selectedIds.length} items to cart`);
      queryClient.invalidateQueries([`shoppingCart-${auth?.userId}`]);
      setSelectedIds([]);
    } catch (error) {
      toast.error("Some items could not be added");
    } finally {
      setIsBulkAdding(false);
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked && ssnData?.data?.ssns) {
      const allIds = ssnData.data.ssns.map((item) => item._id);
      setSelectedIds(allIds);
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const { data: cartData } = useQuery(
    [`shoppingCart-${auth?.userId}`],
    async () => {
      const { data } = await axios.get(`/cart`);
      return data;
    },
    { keepPreviousData: true }
  );

  const isProductInCart = (productId) => {
    return cartData?.cart?.items?.some((item) => item._id === productId);
  };

  const resetFilters = () => {
    setBase("");
    setCity("");
    setCountry1("");
    setState("");
    setPerPage(50);
    setZip("");
    setCs("");
    setName("");
    set_minValue(1910);
    set_maxValue(currentYear);
    setStatus("");
  };

  const darkSelectStyles = {
    control: (base) => ({
      ...base,
      backgroundColor: "#1e293b",
      borderColor: "#334155",
      color: "white",
      minHeight: "38px",
    }),
    menu: (base) => ({ ...base, backgroundColor: "#1e293b", zIndex: 50 }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused ? "#334155" : "#1e293b",
      color: "white",
    }),
    singleValue: (base) => ({ ...base, color: "white" }),
    input: (base) => ({ ...base, color: "white" }),
  };

  return (
    <div className="space-y-6 pb-20">
      {/* HEADER & FILTERS */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-lg overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white">Fullz / SSN</h2>
            <span className="bg-blue-600/20 text-blue-400 text-xs px-2 py-0.5 rounded-full border border-blue-600/30">
              {ssnData?.data?.count || 0} Records
            </span>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
          >
            <FaFilter /> {showFilters ? "Hide Filters" : "Show Filters"}
          </button>
        </div>

        {showFilters && (
          <div className="p-6 bg-slate-900 animate-in slide-in-from-top-2 duration-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-slate-400">Database Base</label>
                <Select
                  options={baseOptions}
                  styles={darkSelectStyles}
                  value={base && { label: base.base, value: base }}
                  onChange={(opt) => setBase(opt?.value)}
                  placeholder="Select Base..."
                />
              </div>

              {/* Status options filter */}
              <div className="space-y-1">
                <label className="text-xs text-slate-400">Status</label>
                <Select
                  options={statusOptions}
                  value={status && { label: status, value: status }}
                  onChange={(opt) => setStatus(opt?.value)}
                  placeholder="Select Status..."
                  styles={darkSelectStyles}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-400">State</label>
                <Select
                  options={filterOptions?.state}
                  styles={darkSelectStyles}
                  value={state && { label: state, value: state }}
                  onChange={(opt) => setState(opt?.value)}
                  placeholder="Select State..."
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-400">Country</label>
                <Select
                  options={countryOptions}
                  styles={darkSelectStyles}
                  value={
                    country1 && { label: country1.label, value: country1.value }
                  }
                  onChange={(opt) => setCountry1(opt?.value)}
                  placeholder="Select Country..."
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-400">Zip Code</label>
                <input
                  type="text"
                  className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-white text-sm focus:border-blue-500 outline-none"
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                  placeholder="e.g 90210"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-400">City</label>
                <input
                  type="text"
                  className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-white text-sm focus:border-blue-500 outline-none"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g Miami"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-400">Name</label>
                <input
                  type="text"
                  className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-white text-sm focus:border-blue-500 outline-none"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Search by name"
                />
              </div>

              <div className="col-span-1 md:col-span-2 space-y-1">
                <label className="text-xs text-slate-400 mb-2 block">
                  DOB Range: {minValue} - {maxValue}
                </label>
                <div className="px-2">
                  <MultiRangeSlider
                    min={1910}
                    max={currentYear}
                    step={1}
                    ruler={false}
                    label={false}
                    barInnerColor="#3b82f6"
                    barLeftColor="#334155"
                    barRightColor="#334155"
                    thumbLeftColor="#3b82f6"
                    thumbRightColor="#3b82f6"
                    minValue={minValue}
                    maxValue={maxValue}
                    onInput={(e) => {
                      set_minValue(e.minValue);
                      set_maxValue(e.maxValue);
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={resetFilters}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm transition-colors border border-slate-700"
              >
                <FaTimes /> Reset Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* TABLE CONTROLS */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-900/50 p-4 rounded-xl border border-slate-800">
        <Pagination
          total={totalPages || 0}
          page={activePage}
          color="blue"
          onChange={setPage}
          size="sm"
        />
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <span>Show</span>
          <select
            value={perPage}
            onChange={(e) => setPerPage(Number(e.target.value))}
            className="bg-slate-800 border border-slate-700 text-white rounded px-2 py-1 outline-none"
          >
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={200}>200</option>
            <option value={300}>300</option>
          </select>
          <span>per page</span>
        </div>
      </div>

      {/* DATA TABLE */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-lg overflow-hidden min-h-[500px]">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-400 uppercase bg-slate-950 border-b border-slate-800">
              <tr>
                <th className="px-4 py-4 w-10">
                  <input
                    type="checkbox"
                    className="rounded border-slate-700 bg-slate-800 text-blue-600 focus:ring-offset-slate-900"
                    onChange={handleSelectAll}
                    checked={
                      ssnData?.data?.ssns?.length > 0 &&
                      selectedIds.length === ssnData?.data?.ssns?.length
                    }
                  />
                </th>
                <th className="px-4 py-4">Base</th>
                <th className="px-4 py-4">Name</th>
                <th className="px-4 py-4">Year</th>
                <th className="px-4 py-4">Loc (State/City/Zip)</th>
                <th className="px-4 py-4 text-center">SSN</th>
                <th className="px-4 py-4 text-center">DL</th>
                <th className="px-4 py-4 text-center">Email</th>
                <th className="px-4 py-4">Price</th>
                <th className="px-4 py-4 text-center">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800 relative">
              {loadingSsns || refetchinSsn ? (
                <tr>
                  <td colSpan="100%" className="p-0 border-none">
                    <div className="flex flex-col items-center justify-center h-96 w-full bg-slate-900/40 backdrop-blur-sm">
                      <PulseLoader
                        color="#3b82f6"
                        size={15}
                        margin={4}
                        speedMultiplier={0.8}
                      />
                      <p className="mt-4 text-slate-500 text-sm font-medium tracking-wide animate-pulse">
                        Fetching Records...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : ssnData?.data?.ssns?.length > 0 ? (
                ssnData.data.ssns.map((item, idx) => {
                  const inCart = isProductInCart(item._id);
                  const isSelected = selectedIds.includes(item._id);

                  return (
                    <tr
                      key={idx}
                      className={`hover:bg-slate-800/50 transition-colors ${
                        isSelected ? "bg-blue-900/10" : ""
                      }`}
                    >
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          className="rounded border-slate-700 bg-slate-800 text-blue-600 focus:ring-offset-slate-900"
                          checked={isSelected}
                          onChange={() => handleSelectOne(item._id)}
                          disabled={inCart}
                        />
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-300">
                        {item?.price?.base}
                      </td>
                      <td className="px-4 py-3 text-white">
                        {item?.firstName}
                      </td>
                      <td className="px-4 py-3 text-slate-400">
                        {item?.dobYear}
                      </td>
                      <td className="px-4 py-3 text-slate-400">
                        {item?.state}, {item?.city}{" "}
                        <span className="text-slate-500">({item?.zip})</span>
                      </td>

                      <td className="px-4 py-3 text-center">
                        <StatusBadge status={item?.ssn} />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <StatusBadge status={item?.dl || item?.address} />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <StatusBadge status={item?.email} />
                      </td>

                      <td className="px-4 py-3 text-green-400 font-bold">
                        ${item?.price?.price}
                      </td>

                      <td className="px-4 py-3 text-center">
                        {inCart ? (
                          <span className="text-xs font-bold text-slate-500 flex justify-center items-center gap-1">
                            <FaCheck /> In Cart
                          </span>
                        ) : (
                          <button
                            onClick={() => onSubmitting(item._id)}
                            disabled={loadingCart}
                            className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg shadow-lg shadow-blue-900/20 transition-all hover:scale-105"
                          >
                            <CgShoppingCart size={16} />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="100%" className="py-24 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-500">
                      <FaSearch size={40} className="mb-4 text-slate-700" />
                      <p className="text-lg font-medium">No records found</p>
                      <p className="text-sm">Try adjusting your filters</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* FLOATING BULK ACTION BAR */}
      <div
        className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 bg-slate-800 border border-slate-700 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-6 transition-all duration-300 ${
          selectedIds.length > 0
            ? "translate-y-0 opacity-100"
            : "translate-y-20 opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex items-center gap-2">
          <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            {selectedIds.length}
          </span>
          <span className="text-sm font-medium">Items Selected</span>
        </div>

        <div className="h-6 w-px bg-slate-600"></div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedIds([])}
            className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-1"
          >
            <FaTimes /> Cancel
          </button>

          <button
            onClick={handleBulkAdd}
            disabled={isBulkAdding}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg shadow-blue-900/20 transition-all hover:scale-105"
          >
            {isBulkAdding ? (
              <PulseLoader size={6} color="white" />
            ) : (
              <>
                <BiCartDownload size={18} /> Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

const StatusBadge = ({ status }) => {
  if (status) {
    return (
      <span className="inline-block w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
    );
  }
  return (
    <span className="inline-block w-2 h-2 rounded-full bg-slate-700"></span>
  );
};

export default SSNDOB;
