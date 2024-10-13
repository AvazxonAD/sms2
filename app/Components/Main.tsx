"use client";
import React from "react";
import Header from "./Header";
import { Backdrop, CircularProgress } from "@mui/material";
import { useSelector } from "react-redux";

function Main({ children }: { children: any }) {
  const loading = useSelector((s: any) => s.auth.loading);
  return (
    <>
      <div className="flex min-h-full   min-w-full mx-auto">
        <Header />
        <div className=" w-full  mt-[70px]">{children}</div>
        <Backdrop
          sx={{ color: "#fff", zIndex: 1301 }} // zIndex yangilandi
          open={loading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </div>
    </>
  );
}

export default Main;
