"use client";
import { sendFileData } from "@/app/Api/Apis";
import { latinToCyrillic } from "@/app/Utils";
import React, { useState, useMemo, useEffect } from "react";
import { useSelector } from "react-redux";

// Interfaces
interface Data {
  fio: string;
  phone: string;
  summa: string;
  tashkilot: string; // Ensure this is always a string
}

interface SmsResponse {
  fio: string;
  phone: string;
  success: boolean;
}

// Utility function to format numbers
const formatNumber = (num: number | string): string => {
  const number = typeof num === "string" && num !== "" ? parseFloat(num) : num;
  if (isNaN(Number(number))) return "";
  return Number(number).toLocaleString("uz-UZ"); // Adjust locale as needed
};

// Utility function to normalize strings (e.g., remove punctuation, convert to lowercase)
const normalizeString = (str: string): string => {
  return latinToCyrillic(str)
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
    .toLowerCase();
};

// Utility function to normalize phone numbers (e.g., remove spaces, dashes)
const normalizePhone = (phone: string): string => {
  return phone.replace(/[\s\-()+]/g, ""); // Remove spaces, dashes, parentheses, plus signs
};

const Send: React.FC = () => {
  // State declarations
  const [formData, setFormData] = useState<Data>({
    fio: "",
    phone: "",
    summa: "",
    tashkilot: "",
  });
  const [dataList, setDataList] = useState<Data[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [modalData, setModalData] = useState<SmsResponse[] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter States
  const [filters, setFilters] = useState({
    fio: "",
    phone: "",
    tashkilot: "",
    summa: "",
  });

  const JWT = useSelector((state: any) => state.auth.JWT);

  // Handle input changes for general fields
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "phone") {
      const phoneRegex = /^[0-9\s\-()+]*$/;
      if (!phoneRegex.test(value)) {
        // Optionally, show an error message or prevent the update
        return;
      }
    }
    setFormData({ ...formData, [name]: value });
  };

  // Dedicated handler for 'summa' field
  const handleSummaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/,/g, "");
    setFormData({ ...formData, summa: rawValue });
  };

  // Handle file upload and automatically send SMS
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const uploadedFile = e.target.files[0];
      setFile(uploadedFile);
      await processFile(uploadedFile);
    }
  };

  // Process the uploaded file
  const processFile = async (file: File) => {
    setIsLoading(true);
    try {
      const myHeaders = new Headers();
      myHeaders.append("Authorization", "Bearer " + JWT);

      const formDataObj = new FormData();
      formDataObj.append("file", file);

      const requestOptions: RequestInit = {
        method: "POST",
        headers: myHeaders,
        body: formDataObj,
        redirect: "follow",
      };

      const response = await fetch(
        "https://proxies.uz/sms/excel",
        requestOptions
      );
      const result = await response.json();

      if (result.success && Array.isArray(result.data)) {
        // Process data: Replace null 'tashkilot' with ""
        const processedData: Data[] = result.data.map((item: any) => ({
          fio: item.fio || "",
          phone: item.phone || "",
          summa: item.summa || "",
          tashkilot: item.tashkilot ? item.tashkilot : "",
        }));

        // Update the dataList state
        setDataList((prevDataList) => [...prevDataList, ...processedData]);

        // Automatically send SMS based on the newly added data (if needed)
      } else {
        console.error("Failed to process the file or no data returned.");
      }
    } catch (error) {
      console.error("Error processing file or sending SMS:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to send SMS
  const sendSMS = async () => {
    if (dataList.length === 0) {
      console.error("No data to send.");
      return;
    }
    try {
      const res = await sendFileData(
        JWT,
        dataList.map((e) => {
          return { ...e, tashkilot: e.tashkilot === "" ? null : e.tashkilot };
        })
      );
      setModalData(res.data);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error sending SMS:", error);
    }
  };

  // Handle form submission
  const handleSubmit = () => {
    setDataList((prevDataList) => [...prevDataList, formData]);
    setFormData({
      fio: "",
      phone: "",
      summa: "",
      tashkilot: "",
    });
  };

  // Handle editing table data
  const handleEditChange = (
    index: number,
    field: keyof Data,
    value: string
  ) => {
    setDataList((prevDataList) => {
      const updatedData = [...prevDataList];
      updatedData[index] = { ...updatedData[index], [field]: value };
      return updatedData;
    });
  };

  // Handle removing a row from the table
  const handleRemove = (index: number) => {
    setDataList((prevDataList) => prevDataList.filter((_, i) => i !== index));
  };

  // Handle filter input changes
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  // Function to determine if a row matches the current filters
  const doesRowMatchFilters = (data: Data): boolean => {
    const matchesFio = filters.fio
      ? normalizeString(data.fio).includes(normalizeString(filters.fio))
      : false;
    const matchesPhone = filters.phone
      ? normalizePhone(data.phone).includes(normalizePhone(filters.phone))
      : false;
    const matchesTashkilot = filters.tashkilot
      ? normalizeString(data.tashkilot).includes(
          normalizeString(filters.tashkilot)
        )
      : false;
    const matchesSumma = filters.summa
      ? formatNumber(data.summa).includes(formatNumber(filters.summa))
      : false;

    // Check if any filter is matched
    return (
      (filters.fio ? matchesFio : false) ||
      (filters.phone ? matchesPhone : false) ||
      (filters.tashkilot ? matchesTashkilot : false) ||
      (filters.summa ? matchesSumma : false)
    );
  };

  // Effect to reload the page after the modal is closed
  useEffect(() => {
    if (!isModalOpen && modalData) {
      // Reload the page after a short delay to ensure modal closes smoothly
      setTimeout(() => {
        window.location.reload();
      }, 300); // 300ms delay
    }
  }, [isModalOpen, modalData]);

  return (
    <div className="p-4 relative">
      {/* Loading Indicator */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
          <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
        </div>
      )}

      {/* Filter Inputs */}
      <div className="flex flex-wrap gap-4 mb-4">
        <input
          type="text"
          placeholder={latinToCyrillic("FIO")}
          name="fio"
          value={filters.fio}
          onChange={handleFilterChange}
          className="input input-bordered w-[22.5%]  bg-white text-black"
        />
        <input
          type="text"
          placeholder={latinToCyrillic("Telefon raqam")}
          name="phone"
          value={filters.phone}
          onChange={handleFilterChange}
          className="input input-bordered w-[22.5%]  bg-white text-black"
        />
        <input
          type="text" // Changed to text for formatted input
          placeholder={latinToCyrillic("Summa")}
          name="summa"
          value={filters.summa ? formatNumber(filters.summa) : ""}
          onChange={(e) =>
            setFilters({
              ...filters,
              summa: e.target.value.replace(/,/g, ""),
            })
          }
          className="input input-bordered w-[22.5%]  bg-white text-black"
        />
        <input
          type="text"
          placeholder={latinToCyrillic("Tashkilot")}
          name="tashkilot"
          value={filters.tashkilot}
          onChange={handleFilterChange}
          className="input input-bordered w-[22.5%]  bg-white text-black"
        />

        <button
          onClick={() =>
            setFilters({ fio: "", phone: "", tashkilot: "", summa: "" })
          }
          className="btn btn-primary text-white"
        >
          {latinToCyrillic("Tozalash")}
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end mb-4">
        <button onClick={sendSMS} className="btn bg-red-500 border-none hover:bg-red-300 text-white">
          {latinToCyrillic("SMS Yuborish")}
        </button>
      </div>

      {/* File Upload */}
      <div className="mb-4">
        <input
          type="file"
          className="file-input file-input-bordered file-input-primary bg-white w-full max-w-full"
          onChange={handleFileUpload}
          aria-label={latinToCyrillic("Файл танланг")}
        />
      </div>

      {/* Form Inputs */}
      <div className="flex flex-wrap gap-4 mb-4">
        <input
          type="text"
          placeholder={latinToCyrillic("FIO")}
          name="fio"
          value={formData.fio}
          onChange={handleInputChange}
          className="input input-bordered w-[22.5%]  bg-white text-black"
        />
        <input
          type="text"
          placeholder={latinToCyrillic("Telefon raqam")}
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          className="input input-bordered w-[22.5%]  bg-white text-black"
        />
        <input
          type="text" // Changed to text to handle formatted display
          placeholder={latinToCyrillic("Summa")}
          name="summa"
          value={formatNumber(formData.summa)}
          onChange={handleSummaChange}
          className="input input-bordered w-[22.5%]  bg-white text-black"
        />
        <input
          type="text"
          placeholder={latinToCyrillic("Tashkilot")}
          name="tashkilot"
          value={formData.tashkilot}
          onChange={handleInputChange}
          className="input input-bordered w-[22.5%]  bg-white text-black"
        />
        <button onClick={handleSubmit} className="btn btn-primary text-white">
          {latinToCyrillic("Qo'shish")}
        </button>
      </div>

      {/* Data Table */}
      {dataList.length > 0 && (
        <table className="table w-full">
          <thead>
            <tr className="text-black">
              <th>{latinToCyrillic("№")}</th>
              <th>{latinToCyrillic("FIO")}</th>
              <th>{latinToCyrillic("Telefon raqam")}</th>
              <th>{latinToCyrillic("Summa")}</th>
              <th>{latinToCyrillic("Tashkilot")}</th>
              <th>{latinToCyrillic("O'chirish")}</th>
            </tr>
          </thead>
          <tbody>
            {dataList.map((data, index) => {
              const isMatch = doesRowMatchFilters(data);
              return (
                <tr key={index} className={isMatch ? "bg-blue-400" : ""}>
                  <td>{index + 1}</td> {/* Serial Number */}
                  <td>
                    <input
                      type="text"
                      value={data.fio}
                      className="input input-bordered w-full bg-white text-black"
                      onChange={(e) =>
                        handleEditChange(index, "fio", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={data.phone}
                      className="input input-bordered w-full bg-white text-black"
                      onChange={(e) =>
                        handleEditChange(index, "phone", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="text" // Changed to text for formatted display
                      value={formatNumber(data.summa)}
                      className="input input-bordered w-full bg-white text-black"
                      onChange={(e) =>
                        handleEditChange(
                          index,
                          "summa",
                          e.target.value.replace(/,/g, "")
                        )
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={data.tashkilot}
                      className="input input-bordered w-full bg-white text-black"
                      onChange={(e) =>
                        handleEditChange(index, "tashkilot", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <button
                      onClick={() => handleRemove(index)}
                      className="btn btn-error text-white"
                    >
                      {latinToCyrillic("O'chirish")}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {/* SMS Response Modal */}
      {isModalOpen && modalData && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">
              {latinToCyrillic("SMS javobi")}
            </h3>
            <table className="table w-full">
              <thead>
                <tr>
                  <th>{latinToCyrillic("FIO")}</th>
                  <th>{latinToCyrillic("Telefon raqam")}</th>
                  <th>{latinToCyrillic("Muvaffaqiyat")}</th>
                </tr>
              </thead>
              <tbody>
                {modalData.map((data, index) => (
                  <tr key={index}>
                    <td>{data.fio}</td>
                    <td>{data.phone}</td>
                    <td>
                      {data.success ? (
                        <span className="text-green-600">
                          {latinToCyrillic("Muvaffaqiyatli")}
                        </span>
                      ) : (
                        <span className="text-red-600">
                          {latinToCyrillic("Muvaffaqiyatsiz")}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="modal-action">
              <button onClick={() => setIsModalOpen(false)} className="btn">
                {latinToCyrillic("Yopish")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Send;
