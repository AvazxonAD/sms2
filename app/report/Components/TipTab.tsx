import React, { useState } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import { useDispatch, useSelector } from "react-redux";
import { setModalTip } from "@/app/Redux/TipSlice";
import TablePagination from "@mui/material/TablePagination";
import { latinToCyrillic } from "@/app/Utils";
import MailOutlineIcon from '@mui/icons-material/MailOutline';
const columns = [
  { id: "number", label: "т/р", align: "left" as "left", minWidth: 5 },
  {
    id: "FIO",
    label: latinToCyrillic("FIO"),
    align: "center" as "center",
    minWidth: 100,
  },
  {
    id: "Otryad",
    label: latinToCyrillic("Mijoz Ismi"),
    minWidth: 100,
    align: "center" as "center",
  },
  {
    id: "phone",
    label: latinToCyrillic("Telefon Raqami"),
    minWidth: 100,
    align: "center" as "center",
  },
  {
    id: "xabar",
    label: latinToCyrillic("Tashkilot"),
    minWidth: 100,
    align: "center" as "center",
  },
  {
    id: "actions",
    label: latinToCyrillic("Amallar"),
    minWidth: 100,
    align: "right" as "right",
  },
];

function createData(
  number: any,
  FIO: any,
  Otryad: any,
  phone: any,
  xabar: any,
  actions: any,
  id: number
) {
  return { number, FIO, Otryad, phone, xabar, actions, id };
}

export default function TipTab({
  ranks,
  page,
  rowsPerPage,
  handleChangePage,
  handleChangeRowsPerPage,
}: any) {
  const [modalOpen, setModalOpen] = useState(false); // Modal holati
  const [selectedRow, setSelectedRow] = useState<any>(null); // Tanlangan qator uchun ma'lumotlar

  const rows = ranks
    ? ranks.map((e: any, i: any) =>
        createData(
          i + 1 + page * rowsPerPage, // Adjust to show the correct number based on page
          e.senddate,
          e.client_fio,
          e.client_phone,
          e.tashkilot,
          e.report,
          e.id
        )
      )
    : [];

  const dispatch = useDispatch();

  const handleModalOpen = (row: any) => {
    setSelectedRow(row);
    setModalOpen(true); // Modalni ochadi
  };

  const handleModalClose = () => {
    setModalOpen(false); // Modalni yopadi
    setSelectedRow(null); // Tanlangan ma'lumotni tozalash
  };

  return (
    <>
      <Paper sx={{ width: "100%", overflow: "hidden" }} elevation={0}>
        <TableContainer
          component={Paper}
          sx={{ overflow: "auto", maxHeight: "68vh" }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.length > 0 ? (
                rows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row: any) => (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                      <TableCell align={columns[0].align}>
                        {row.number}
                      </TableCell>
                      <TableCell align={columns[1].align}>{row.FIO}</TableCell>
                      <TableCell align={columns[2].align}>
                        {row.Otryad}
                      </TableCell>
                      <TableCell align={columns[3].align}>
                        {row.phone}
                      </TableCell>
                      <TableCell align={columns[4].align}>
                        {row.xabar}
                      </TableCell>
                      <TableCell align={columns[5].align}>
                        {/* Print Button as modal open */}
                        <IconButton onClick={() => handleModalOpen(row)}>
                          <MailOutlineIcon color="info" />
                        </IconButton>
                        <IconButton
                          onClick={() =>
                            dispatch(
                              setModalTip({
                                open: true,
                                id: row.id,
                                name: row.FIO,
                              })
                            )
                          }
                        >
                          <RemoveCircleOutlineIcon color="error" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    {latinToCyrillic("Malumot Topilmadi")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
          component="div"
          count={200} // Total count for pagination
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* DaisyUI Modal */}
      {modalOpen && selectedRow && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">
              {latinToCyrillic("Sms jo'natilgan habar")}
            </h3>
            <p>{selectedRow.actions}</p>

            <div className="modal-action">
              <button className="btn btn-primary text-white" onClick={handleModalClose}>
                {latinToCyrillic("Yopish")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
