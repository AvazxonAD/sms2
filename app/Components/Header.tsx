"use client";
import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter, usePathname } from "next/navigation";
import SecurityIcon from "@mui/icons-material/Security";
import AssessmentIcon from "@mui/icons-material/Assessment"; // Changed icon
import LogoutIcon from "@mui/icons-material/Logout";

import Link from "next/link";

import { getAuth, getBalancee, UpdateAuth } from "@/app/Api/Apis";
import { alertChange } from "@/app/Redux/ShaxsiySlice";
import { puJWT, setLoadingg } from "@/app/Redux/AuthSlice";
import { latinToCyrillic } from "@/app/Utils";

export default function Header() {
  const admin = useSelector((state: any) => state.auth.admin);
  const JWT = useSelector((state: any) => state.auth.JWT);
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const [balance, setBalance] = React.useState();
  // Modal state
  const [isModalOpen, setModalOpen] = React.useState(false);
  const [userData, setUserData] = React.useState<any>(null);
  const [value, setValue] = React.useState({
    login: "",
    username: "",
    oldPassword: "",
    newPassword: "",
  });

  // Fetch user data for the modal
  const getUser = async () => {
    const res = await getAuth(JWT);
    if (res.success) {
      setUserData(res.data);
    }
  };

  React.useEffect(() => {
    getUser();
  }, [JWT]);

  // Menu items
  const menuListAdmin = [
    {
      name: "Shaxsiy",
      path: "#", // Modal handling
      icon: <SecurityIcon />,
      isModal: true,
    },
    {
      name: "Xisobot",
      path: "/report",
      icon: <AssessmentIcon />,
      isModal: false,
    },
  ];

  const [active, setActive] = React.useState<string>(menuListAdmin[1].path);

  React.useEffect(() => {
    if (pathname === "/") {
      setActive(menuListAdmin[1].path);
    } else {
      const matchingMenuItem = menuListAdmin.find(
        (item) => item.path === pathname
      );
      if (matchingMenuItem) {
        setActive(matchingMenuItem.path);
      }
    }
    getBalance();
  }, [pathname, menuListAdmin]);

  // Handling click for navigation or modal
  const handleClick = async (item: any) => {
    if (item.isModal) {
      setModalOpen(true); // Open the modal
    } else {
      dispatch(setLoadingg(true));
      setActive(item.path);
      await router.push(item.path); // Wait for the navigation
      dispatch(setLoadingg(false)); // After navigation is done, stop loading
    }
  };

  // Handle logout
  const AuthOut = () => {
    sessionStorage.setItem("token", "out");
    dispatch(puJWT("out"));
    location.reload();
  };

  // Update user data
  const updateAuthh = async () => {
    const res = await UpdateAuth(JWT, value);
    if (res.success) {
      dispatch(
        alertChange({
          open: true,
          message: latinToCyrillic("Ma'lumotlar tahrirlandi"),
          status: "success",
        })
      );
      setModalOpen(false);
      getUser();
    } else {
      dispatch(
        alertChange({
          open: true,
          message: latinToCyrillic("Muammo yuz berdi!"),
          status: "error",
        })
      );
    }
  };

  const getBalance = async () => {
    const res = await getBalancee(JWT);

    setBalance(res.data.balance);
  };

  return (
    <div className="navbar bg-[#243642] shadow-lg fixed top-0 left-0 w-full z-50">
      <div className="navbar-start">
        <Link
          href="/"
          className="btn btn-ghost normal-case text-xl text-white flex items-center gap-2"
        >
          <img
            src="/znak.png"
            className="w-[48px] h-[48px] rounded-full"
            alt="CMC Logo"
          />
          {latinToCyrillic("Qo'riqlash Xizmati")}
        </Link>
        <div className="text-red-400 text-[18px] ml-2 font-bold">{balance}</div>
      </div>

      <div className="navbar-end">
        <ul className="menu menu-horizontal px-1 flex gap-4 items-center">
          {menuListAdmin.map((item) => (
            <li key={item.name}>
              <button
                onClick={() => handleClick(item)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                  active === item.path
                    ? "bg-[#3C566D] text-white"
                    : "hover:bg-[#4A7388] hover:text-white text-white"
                }`}
              >
                {item.icon}
                <span>{latinToCyrillic(item.name)}</span>
              </button>
            </li>
          ))}
          <li>
            <button
              onClick={AuthOut}
              className="flex items-center gap-2 bg-[#FF6B6B] text-white hover:bg-[#E63946] px-4 py-2 rounded-md transition-all"
            >
              <LogoutIcon className="mr-2" />
              {latinToCyrillic("Chiqish")}
            </button>
          </li>
        </ul>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <div className="py-4">
              {/* Username */}
              <p className="text-2xl font-bold text-gray-700">
                {latinToCyrillic("Foydalanuvchi nomi:")}{" "}
                {userData?.username || latinToCyrillic("Mavjud emas")}
              </p>
              <input
                type="text"
                placeholder={latinToCyrillic("Foydalanuvchi FIO")}
                className="input input-bordered w-full mt-2"
                value={value.username}
                onChange={(e) =>
                  setValue({ ...value, username: e.target.value })
                }
              />

              {/* Login */}
              <input
                type="text"
                placeholder={latinToCyrillic("Foydalanuvchi Login")}
                className="input input-bordered w-full mt-2"
                value={value.login}
                onChange={(e) => setValue({ ...value, login: e.target.value })}
              />

              {/* Old Password */}
              <input
                type="password"
                placeholder={latinToCyrillic("Eski parol")}
                className="input input-bordered w-full mt-2"
                value={value.oldPassword}
                onChange={(e) =>
                  setValue({ ...value, oldPassword: e.target.value })
                }
              />

              {/* New Password */}
              <input
                type="password"
                placeholder={latinToCyrillic("Yangi parol")}
                className="input input-bordered w-full mt-2"
                value={value.newPassword}
                onChange={(e) =>
                  setValue({ ...value, newPassword: e.target.value })
                }
              />
            </div>
            <div className="modal-action">
              <button
                className="btn btn-primary text-white"
                onClick={updateAuthh}
              >
                {latinToCyrillic("Yangilash")}
              </button>
              <button className="btn" onClick={() => setModalOpen(false)}>
                {latinToCyrillic("Yopish")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
