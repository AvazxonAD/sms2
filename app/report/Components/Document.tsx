import React from "react";
import GridExample from "./GridExample";
import TableExample from "./GridExample";

// Forward the ref to the Documentt component
const Documentt = React.forwardRef(({ value, info }: any, ref: any) => {
  return (
    <div ref={ref} className="p-0">
      {/* Header */}
      <div className="text-center w-full mb-2">
        <img
          src="/gerb.png"
          className="w-[120px] mb-3 h-[120px] mx-auto rounded-[999px]"
          alt=""
        />
        <h1 className="font-bold text-[24px] uppercase">
          O‘ZBEKISTON RESPUBLIKASI MILLIY GVARDIYASI
        </h1>
        <h2 className="font-bold text-[24px] uppercase">
          {info?.region_name + " "} QO‘RIQLASH BOSHQARMASI
        </h2>
        <p className="text-lg">
          {info?.address + ". "} tel: {info?.phone_number + " "} fax:{" "}
          {info?.fax + " "}
        </p>
        <div className="flex flex-col gap-1">
          <div className="w-full h-[5px] bg-blue-700"></div>
          <div className="w-full h-[2px] bg-blue-700"></div>
        </div>
      </div>

      {/* Addressed To */}
      <div className="flex  justify-between w-full">
        <div className="w-[10px]"></div>
        <div className="mb-6 text-xl font-bold  max-w-[250px]  ">
          <p>
            Жарқўрғон туман {value?.tashkilot} tashkilot raxbari{" "}
            {value?.client_fio}
          </p>
        </div>
      </div>

      {/* Title of the letter */}
      <h3 className="text-center text-lg font-semibold  mb-6">
        SMS ESLATMA Х А Т И.
      </h3>

      {/* Table */}
      <TableExample rows={value ? value.rows : []} />

      {/* Main Content */}
      <div className="mb-0">
        <p>Sms xabarnoma matni quyidagicha:</p>
        <p className="mt-0">{value?.report_string}</p>
      </div>

      {/* Bank Details */}
      <div className="flex justify-between w-full">
        <div>
          <p>x/r: {info?.account_number + " "}</p>
          <p>Aloqa telefoni: {info?.phone_number2 + " "}</p>
        </div>
        <p>INN: {info?.inn + " "}</p>
      </div>

      {/* Footer */}
      <div className="text-left text-[20px] mt-10">
        <p className="font-bold">Бошқарма бошлиғи</p>
        <p className="italic font-bold">{info?.boos_fio}</p>
      </div>

      {/* Executor Information */}
      <div className="mt-10 font-bold text-[18px]">
        <p>Ижрочи: {" " + info?.worker_fio}</p>
      </div>
    </div>
  );
});

export default Documentt;
