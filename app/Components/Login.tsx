"use client";
import * as React from "react";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { loginAuth } from "../Api/Apis";
import { setUser } from "../Redux/AuthSlice";
import { alertChange } from "../Redux/ShaxsiySlice";
import { latinToCyrillic } from "../Utils";

export default function Login() {
  const dispatch = useDispatch();
  const [password, setPassword] = React.useState<string>("");
  const [select, setSelect] = React.useState<string>("");
  const [showPassword, setShowPassword] = React.useState<boolean>(false);
  const router = useRouter();

  const login = async (username: string, password: string) => {
    const res = await loginAuth(username, password);

    if (res.success) {
      dispatch(
        alertChange({
          open: true,
          message: latinToCyrillic("Foydalanuvchi muvofaqiyatli kirdi!"),
          status: "success",
        })
      );
      sessionStorage.setItem("token", res.data.token);
      setTimeout(() => window.location.reload(), 1000);
    } else {
      dispatch(
        alertChange({
          open: true,
          message: res.message,
          status: "error",
        })
      );
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password && select) {
      dispatch(
        setUser({
          username: select,
          password: password,
        })
      );
      login(select, password);
    } else {
      dispatch(
        alertChange({
          open: true,
          message: latinToCyrillic("Malumotlarni to'liq to'ldiring!"),
          status: "warning",
        })
      );
    }
  };


  return (
    <div className="h-screen flex items-center justify-center bg-[#001524]">
      <div className="bg-white p-8 shadow-lg rounded-lg max-w-md w-full">
        <div className="flex justify-center mb-4">
          <LockOutlinedIcon fontSize="large" className="text-primary" />
        </div>
        <h1 className="text-center text-2xl font-bold mb-6">
          {latinToCyrillic("Kirish")}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label className="input input-bordered flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="h-4 w-4 opacity-70"
              >
                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
              </svg>
              <input
                type="text"
                value={select}
                onChange={(e) => setSelect(e.target.value)}
                required
                className="grow"
                placeholder={latinToCyrillic("Login")}
              />
            </label>
          </div>
          <div className="form-control">
            <label className="input input-bordered flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="h-4 w-4 opacity-70"
              >
                <path
                  fillRule="evenodd"
                  d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                  clipRule="evenodd"
                />
              </svg>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="grow"
                placeholder={latinToCyrillic("Parol")}
                type={"password"}
              />
            </label>
          </div>
          <button type="submit" className="btn btn-primary text-white w-full mt-4">
            {latinToCyrillic("Kirish")}
          </button>
        </form>
      </div>
    </div>
  );
}
