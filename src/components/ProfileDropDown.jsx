import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaRegUserCircle, FaSignOutAlt } from "react-icons/fa";
import { MdOutlineAccountBalanceWallet } from "react-icons/md";
import { HiOutlineKey } from "react-icons/hi";
import useLogout from "../hooks/useLogout";

function ProfileDropDown() {
  const navigate = useNavigate();
  const logOut = useLogout();

  const signOut = async () => {
    await logOut();
    navigate("/");
  };

  const dropDownItems = [
    {
      name: "My Orders",
      path: "/dash/my-orders",
      icon: <FaRegUserCircle size={16} />,
    },
    {
      name: "Add Balance",
      path: "/dash/addfunds",
      icon: <MdOutlineAccountBalanceWallet size={16} />,
    },
    {
      name: "Change password",
      path: "/dash/change-password",
      icon: <HiOutlineKey size={16} />,
    },
  ];

  return (
    <ul className="flex flex-col py-1">
      {dropDownItems.map((item, index) => (
        <li key={index}>
          <Link
            to={item.path}
            className="flex items-center gap-3 px-4 py-3 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
          >
            <span className="text-blue-500">{item.icon}</span>
            <span className="font-medium">{item.name}</span>
          </Link>
        </li>
      ))}

      {/* Divider */}
      <div className="h-px bg-slate-700 my-1 mx-3"></div>

      {/* Logout Button */}
      <li>
        <button
          onClick={signOut}
          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors text-left"
        >
          <FaSignOutAlt size={16} />
          <span className="font-medium">Logout</span>
        </button>
      </li>
    </ul>
  );
}

export default ProfileDropDown;
