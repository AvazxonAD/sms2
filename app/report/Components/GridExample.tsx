import { latinToCyrillic } from "@/app/Utils";
import React from "react";

const TableExample = ({ rows }: { rows: any }) => {
  return (
    <div className="overflow-x-auto p-4">
      <table className="min-w-full border border-black print-no-repeat-header">
        <thead className="print-header">
          <tr>
            <th className="border border-black p-4 text-left">
              {latinToCyrillic("Jo'natilgan sana")}
            </th>
            <th className="border border-black p-4 text-left">
              {latinToCyrillic("Telfon Raqam")}
            </th>
            <th className="border border-black p-4 text-left">
              {latinToCyrillic("Summa")}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((e: any) => (
            <tr key={e.senddate}>
              <td className="border border-black p-4">{e.senddate}</td>
              <td className="border border-black p-4">{e.client_phone}</td>
              <td className="border border-black p-4">{e.summa}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableExample;
