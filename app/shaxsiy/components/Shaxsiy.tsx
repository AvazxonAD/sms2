"use client";
import React from "react";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import { useSelector, useDispatch } from "react-redux";
import { alertChange, setModalShaxsiy } from "@/app/Redux/ShaxsiySlice";
import EditModal from "./EditModal";

import { UpdateAuth, getAuth } from "@/app/Api/Apis";
import { changeAdminStatuss } from "@/app/Redux/AuthSlice";
import { latinToCyrillic } from "@/app/Utils";

function Shaxsiy() {
  const [userData, setUserData] = React.useState<any>(null);
  const JWT = useSelector((state: any) => state.auth.JWT);
  const [value, setValue] = React.useState<any>({
    username: "",
    oldPassword: "",
    newPassword: "",
  });
  const dispatch = useDispatch();

  const getUser = async () => {
    const res = await getAuth(JWT);
    if (res.success) {
      setUserData(res.data);
    }
  };

  React.useEffect(() => {
    getUser();
  }, []);
  const updateAuthh = async () => {
    const res = await UpdateAuth(JWT, value);

    if (res.success) {
      dispatch(
        alertChange({
          open: true,
          message: latinToCyrillic("Malumotlar taxrirlandi"),
          status: "success",
        })
      );
      handleClose();
      getUser();
    } else {
      dispatch(
        alertChange({
          open: true,
          message: latinToCyrillic(
            "Malumotlar taxrirlanishida muamo yuz berdi!"
          ),
          status: "error",
        })
      );
    }
  };
  const handleSubmit = () => {
    console.log("salom");
    
    updateAuthh();
  };

  const handleClose = () => {
    dispatch(setModalShaxsiy(false));
  };

  return (
    <div className="px-6 py-8  min-h-screen">
      <h1 className="font-bold text-4xl mb-6 text-blue-800">
        {latinToCyrillic("Shaxsiy ma'lumotlar")}
      </h1>
      <div className="flex w-full justify-between items-start gap-6">
        <div className="flex relative w-1/2 bg-white shadow-lg p-6 gap-4 flex-col rounded-lg border border-blue-200">
          <div className="absolute top-2 right-2">
            <button
              className="btn  bg-blue-700 hover:bg-blue-800"
              onClick={() => dispatch(setModalShaxsiy(true))}
            >
              <AppRegistrationIcon className="text-white" />
            </button>
          </div>

          <div className="flex flex-col">
            <h2 className="font-bold text-2xl text-blue-700">
              {latinToCyrillic("Ish profilingiz nomi:")}
            </h2>
            <p className="text-lg text-gray-600">
              {userData?.username || latinToCyrillic("Ma'lumot mavjud emas")}
            </p>
          </div>
        </div>
      </div>
      <EditModal
        isUser={userData?.adminstatus}
        setValue={setValue}
        value={value}
        handleSubmit={updateAuthh}
        handleClose={handleClose}
      />
    </div>
  );
}

export default Shaxsiy;
