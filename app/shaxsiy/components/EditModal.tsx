import * as React from "react";
import { useSelector } from "react-redux";
import { latinToCyrillic } from "@/app/Utils";

export default function EditModal({
  value,
  setValue,
  handleSubmit,
  handleClose,
  isUser,
}: {
  value: any;
  setValue: any;
  handleSubmit: any;
  handleClose: any;
  isUser: boolean;
}) {
  const open = useSelector((s: any) => s.shax.modal);

  const handleChange = (e: any) => {
    setValue({
      ...value,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmite = async () => {
    console.log("salom");

    handleSubmit();
  };

  return (
    <React.Fragment>
      {open && (
        <div
          className={`modal ${open ? "modal-open" : ""}`}
          onClick={handleClose}
        >
          <div
            className="modal-box max-w-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-bold text-xl mb-4 text-center">
              {latinToCyrillic("Ish profilingizni tahrirlang !")}
            </h3>

            <div className="flex flex-col md:flex-row justify-between gap-4">
              {!isUser && (
                <input
                  type="text"
                  name="username"
                  value={value.username}
                  onChange={handleChange}
                  placeholder={latinToCyrillic("Foydalanuvchi nomi")}
                  className={`input input-bordered w-full ${
                    value.username === "" ? "input-error" : ""
                  }`}
                />
              )}

              <input
                type="password"
                name="oldPassword"
                value={value.oldPassword}
                onChange={handleChange}
                placeholder={latinToCyrillic("Amaldagi Parol")}
                className={`input input-bordered w-full ${
                  value.oldPassword === "" ? "input-error" : ""
                }`}
              />

              <input
                type="password"
                name="newPassword"
                value={value.newPassword}
                onChange={handleChange}
                placeholder={latinToCyrillic("Yangi Parol")}
                className={`input input-bordered w-full ${
                  value.newPassword === "" ? "input-error" : ""
                }`}
              />
            </div>

            <div className="modal-action mt-6 flex justify-between">
              <button className="btn btn-outline" onClick={handleClose}>
                {latinToCyrillic("Orqaga")}
              </button>
              <button
                className="btn btn-primary text-white"
                onClick={handleSubmit}
              >
                {latinToCyrillic("Saqlash")}
              </button>
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
}
