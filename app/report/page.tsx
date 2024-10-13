"use client";
import React, { useEffect, useRef, useState } from "react";
import MenuBatalyon from "./Components/MenuBatalyon";
import {
  deleteWorker,
  getAllWorkers,
  getAllWorkersDate,
  getAllWorkerstashkilot,
  getInfoPrint,
  getPrintDataa,
} from "../Api/Apis";
import { useDispatch, useSelector } from "react-redux";
import { alertChange } from "../Redux/ShaxsiySlice";
import TipTab from "./Components/TipTab";
import { latinToCyrillic } from "../Utils";
import { IconButton, Button } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import TipModal from "./Components/TipModal";
import { setModalTip } from "../Redux/TipSlice";
import { useReactToPrint } from "react-to-print";
import Documentt from "./Components/Document";

// Function to format Uzbek phone numbers
// Function to format Uzbek phone numbers with dashes as user types
const formatPhoneNumber = (value: string) => {
  // Remove all non-digit characters

  const cleaned = value.replace(/\D/g, "");

  // Apply formatting
  if (cleaned.length > 3) {
    const areaCode = cleaned.slice(0, 3); // "998"
    const firstPart = cleaned.slice(3, 5); // "95" (2 digits)
    const secondPart = cleaned.slice(5, 8); // "XXX" (3 digits)
    const thirdPart = cleaned.slice(8, 10); // "XX" (2 digits)
    const fourthPart = cleaned.slice(10, 12); // "XX" (2 digits)

    return `${areaCode}${firstPart ? "-" + firstPart : ""}${
      secondPart ? "-" + secondPart : ""
    }${thirdPart ? "-" + thirdPart : ""}${fourthPart ? "-" + fourthPart : ""}`;
  }

  return cleaned; // Return the raw input if it doesn't match the expected format yet
};

function Page() {
  const [data, setData] = useState<any>([]);
  const [filteredRanks, setFilteredRanks] = useState<any[]>([]);
  const JWT = useSelector((s: any) => s.auth.JWT);
  const dispatch = useDispatch();

  const [page, setPage] = useState(0); // start at 0 for pagination
  const [rowsPerPage, setRowsPerPage] = useState(100);

  // Modal states for the right-side button modal
  const [modalOpen, setModalOpen] = useState(false);
  const [input1, setInput1] = useState("");
  const [input2, setInput2] = useState("");
  const [input3, setInput3] = useState("");

  // Filter states
  const [searchDate, setSearchDate] = useState("");
  const [searchOrg, setSearchOrg] = useState("");
  const [searchPhone, setSearchPhone] = useState(""); // New state for phone number search
  const open = useSelector((s: any) => s.tip.modal);
  const [value, setValue] = useState<any>({});

  // Fetch data based on both date, organization, and phone filters
  const fetchDataWithFilters = async () => {
    const res = await getAllWorkers(
      JWT,
      page,
      rowsPerPage,
      searchDate,
      searchOrg,
      searchPhone.replace(/-/g, "") // Pass phone filter
    );
    setFilteredRanks(res.data); // Set filtered data
    setData(res); // Set entire response if needed
  };

  useEffect(() => {
    fetchDataWithFilters(); // Fetch data when component mounts and filters change
  }, [JWT, page, rowsPerPage, searchDate, searchOrg, searchPhone]);

  // Handle search by date
  const handleSearchDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchDate(e.target.value);
  };

  // Handle search by organization
  const handleSearchOrg = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchOrg(e.target.value);
  };

  // Handle search by phone number
  const handleSearchPhone = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchPhone(formatPhoneNumber(e.target.value)); // Apply formatting as the user types
  };

  // Clear all filters
  const clearSearch = () => {
    setSearchDate("");
    setSearchOrg("");
    setSearchPhone(""); // Clear phone number filter
    fetchDataWithFilters(); // Re-fetch the data without filters
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleClose = () => {
    dispatch(
      setModalTip({
        type: 0,
        open: false,
        id: 0,
        name: "",
        FIO: "Bekzod Abdullayev Ibrohimovich",
      })
    );
  };

  const deleteUnvon = async () => {
    const res = await deleteWorker(JWT, open.id);
    if (res.success) {
      handleClose();
      dispatch(
        alertChange({
          open: true,
          message: open.name + " " + latinToCyrillic("o'chirildi"),
          status: "success",
        })
      );
      fetchDataWithFilters();
    } else {
      dispatch(
        alertChange({
          open: true,
          message: latinToCyrillic(res.message),
          status: "error",
        })
      );
    }
  };

  const deleteAllRanks = () => {
    deleteUnvon();
  };

  const [infoPrint, setInfoPrint] = useState();
  const getInfo = async () => {
    const res = await getInfoPrint(JWT);
    setInfoPrint(res.data);
  };
  function removeDashes(input: any): any {
    return input.replace(/-/g, ""); // Replace all dashes with an empty string
  }
  // Handlers for the custom modal
  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);

  const handleApply = () => {
    const inp3 = input3.replace(/-/g, "");
    getPrintData({ input1, input2, inp3 });
  };

  const [printData, setPrintData] = useState();
  const componentRef: any = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  useEffect(() => {
    getInfo();
  }, []);
  const getPrintData = async (value: any) => {
    const res = await getPrintDataa(JWT, value);
    if (res.success) {
      setPrintData(res.data); // Set the print data first
      // Wait for state update before printing
      setTimeout(handlePrint, 10); // Trigger print after setting data
      handleModalClose();
    } else {
      dispatch(
        alertChange({
          open: true,
          message: latinToCyrillic("xatolik yuz berdi"),
          status: "error",
        })
      );
    }
  };

  return (
    <>
      <div className="hidden">
        <Documentt value={printData} info={infoPrint} ref={componentRef} />
      </div>

      <div className="flex justify-between mt-6 mx-auto max-w-[95%] mb-2">
        <form className="flex gap-4 ml-4 items-center">
          {/* Date input */}
          <input
            type="text"
            value={searchDate}
            placeholder={latinToCyrillic("Sana")}
            onChange={handleSearchDate}
            className="input input-bordered input-info bg-white grow text-black"
          />
          {/* Organization input */}
          <input
            type="text"
            value={searchOrg}
            onChange={handleSearchOrg}
            className="input input-bordered text-black input-info bg-white grow"
            placeholder={latinToCyrillic("Tashkilot nomi")}
            autoComplete="off"
          />
          {/* Phone number input */}
          <input
            type="text"
            value={searchPhone}
            onChange={handleSearchPhone}
            className="input input-bordered text-black input-info bg-white grow"
            placeholder={latinToCyrillic("Telefon Raqami")}
            autoComplete="off"
          />
          <IconButton type="button" size="large" onClick={clearSearch}>
            <CloseIcon fontSize="inherit" color="error" />
          </IconButton>
        </form>
        <button
          className="btn btn-primary text-white"
          onClick={handleModalOpen}
        >
          {latinToCyrillic("Modalni ochish")}
        </button>
      </div>

      <div className="mx-auto w-[95%] mt-[10px]">
        <TipTab
          ranks={filteredRanks}
          page={page}
          rowsPerPage={rowsPerPage}
          handleChangePage={handleChangePage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </div>

      {open.open ? (
        <TipModal
          handleDelete={deleteAllRanks}
          handleClose={handleClose}
          value={value}
          setValue={setValue}
        />
      ) : null}

      {/* Modal for text inputs with DaisyUI */}
      {/* Modal for text inputs with DaisyUI */}
      <div className={`modal ${modalOpen ? "modal-open" : ""}`}>
        <div className=" bg-white p-6 rounded-xl w-[1000px]">
          {" "}
          {/* Set modal width to 1000px */}
          <form onSubmit={(e) => e.preventDefault()}>
            {" "}
            {/* Prevent form submission from reloading the page */}
            <div className="grid grid-cols-3 gap-4">
              <input
                type="text"
                value={input1}
                onChange={(e) => setInput1(e.target.value)}
                placeholder={latinToCyrillic("Sana 1")}
                className="input input-bordered w-full"
              />
              <input
                type="text"
                value={input2}
                onChange={(e) => setInput2(e.target.value)}
                placeholder={latinToCyrillic("Sana 2")}
                className="input input-bordered w-full"
              />
              <input
                type="text"
                value={input3}
                onChange={(e) => setInput3(formatPhoneNumber(e.target.value))} // Apply phone number formatting here
                placeholder={latinToCyrillic("Telefon Raqam")}
                className="input input-bordered w-full"
              />
            </div>
            <div className="modal-action flex justify-end mt-4">
              <button
                className="btn btn-primary text-white"
                onClick={handleApply}
              >
                {latinToCyrillic("Chop Etish")}
              </button>
              <button
                type="button" // Change to button to prevent form submission
                className="btn btn-outline btn-secondary"
                onClick={handleModalClose}
              >
                {latinToCyrillic("Yopish")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Page;
