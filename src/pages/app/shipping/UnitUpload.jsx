import ModalSyncShippingOrder from "@/components/Modal/Master/ModalSyncShippingOrder";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { ControllerInput } from "@/components/ui/ControllerInput";
import DatePicker from "@/components/ui/DatePicker";
import Dropdown from "@/components/ui/Dropdown";
import Icons from "@/components/ui/Icon";
import Pagination from "@/components/ui/Pagination";
import Search from "@/components/ui/Search";
import Select from "@/components/ui/Select";
import Textinput from "@/components/ui/Textinput";
import createStore from "@/context";
import { useDebounce } from "@/hooks/useDebounce";
import DropZone from "@/pages/forms/file-input/DropZone";
import Table from "@/pages/table/Table";
import TableAdvancedPage from "@/pages/table/react-table";
import shippingOrder from "@/services/API/shippingOrder";
import {
  dayJsFormatDate,
  dayjsFormatInputDate,
  disabledDate,
} from "@/utils/dayjs";
import queryString from "@/utils/queryString";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import Flatpickr from "react-flatpickr";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import uploadSvgImage from "@/assets/images/svg/upload.svg";
import * as XLSX from "xlsx"; //
import unit from "@/services/API/unit";
import { SweetAlert } from "@/utils/Swal";
import { useNavigate } from "react-router-dom";

const UnitUpload = () => {
  const { control } = useForm();
  const [search, setSearch] = useState("");
  const [selectPageSize, setSelectPageSize] = useState("10");
  const [uploadedExcel, setUploadedExcel] = useState([]);
  const ITEMS_PER_PAGE = 10;

  const [files, setFiles] = useState([]);
  const { getRootProps, getInputProps, isDragAccept } = useDropzone({
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
        ".xls",
      ],
    },
    onDrop: (acceptedFiles) => {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
      handleFileUpload(acceptedFiles[0]);
    },
  });
  const [currentPage, setCurrentPage] = useState(1);

  const handleFileUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target?.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      // Convert the worksheet to a 2D array where the first row is the headers
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      // Get the headers (first row)

      // Get the actual data (all rows except the first one)
      const dataRows = jsonData.slice(0);

      // Convert each row into an object using the headers as keys
      const formattedData = dataRows.map((row) => ({
        dealer_code: row[0],
        dealer_name: row[1],
        motor_type: row[2],
        color: row[3],
        chassis_no: row[4],
        engine_no: row[5],
        unit_year: row[6],
      }));

      setUploadedExcel(formattedData);
      setFiles([file]);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleTotalPage = (value) => {
    setSelectPageSize(value);
    // Re-calculate the total pages or perform necessary operations
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearch = (e) => {
    setSearch(e);
    setCurrentPage(1); // Reset to the first page on new search
  };

  const filteredSpkData = uploadedExcel?.filter((item) => {
    const searchTerm = search?.toLowerCase();
    return (
      String(item?.dealer_code || "")
        .toLowerCase()
        .includes(searchTerm) ||
      String(item?.dealer_name || "")
        .toLowerCase()
        .includes(searchTerm) ||
      String(item?.motor_type || "")
        .toLowerCase()
        .includes(searchTerm) ||
      String(item?.color || "")
        .toLowerCase()
        .includes(searchTerm) ||
      String(item?.chassis_no || "")
        .toLowerCase()
        .includes(searchTerm) ||
      String(item?.engine_no || "")
        .toLowerCase()
        .includes(searchTerm) ||
      String(item?.unit_year || "")
        .toLowerCase()
        .includes(searchTerm)
    );
  });
  const paginatedSpkData = filteredSpkData.slice(
    (currentPage - 1) * parseInt(selectPageSize),
    currentPage * parseInt(selectPageSize)
  );

  const totalPages = Math.ceil(filteredSpkData.length / ITEMS_PER_PAGE);
  const navigate = useNavigate();

  const { mutate, isLoading } = useMutation({
    mutationFn: async () => {
      if (files.length === 0) {
        throw new Error("No files to upload");
      }

      const formData = new FormData();
      formData.append("file", files[0]);
      const response = await unit.uploadUnit(formData);
      return response;
    },
    onSuccess: (res) => {
      if (res?.meta?.code === 200) {
        SweetAlert("success", `Successfully Import Stock`, "Sukses");
        navigate("/shipping-order");
      } else {
        SweetAlert("error", res?.data, "Error");
      }
    },
    onError: (res) => {
      SweetAlert("error", res?.data, "Error");
    },
  });

  return (
    <div>
      <Card>
        <ModalSyncShippingOrder />
        <div className="grid grid-cols-12 gap-5">
          {uploadedExcel?.length > 0 && (
            <div className="col-span-12">
              <div className="lg:grid flex grid-cols-1 lg:grid-cols-12 gap-5 ">
                <Button
                  className="btn-dark w-full lg:w-auto"
                  text={"UPLOAD"}
                  isLoading={isLoading}
                  onClick={() => mutate()}
                />
                <Button
                  className="btn-danger w-full lg:w-auto"
                  text={"CANCEL"}
                  onClick={() => setUploadedExcel([])}
                />
              </div>
            </div>
          )}

          {uploadedExcel?.length === 0 ? (
            <React.Fragment>
              <div className="col-span-12">
                <table className="min-w-full divide-y divide-slate-100 table-fixed  dark:divide-slate-700">
                  <thead className="bg-slate-200 dark:bg-slate-700">
                    <tr>
                      {headers.map((item, index) => (
                        <th
                          scope="col"
                          className={` table-th py-3 ${
                            index === 0 ? "w-1/12" : ""
                          }`}
                          key={index}
                        >
                          {item.title}
                        </th>
                      ))}
                    </tr>
                  </thead>
                </table>
              </div>
              <div
                className="w-full text-center border-dashed border border-secondary-500 rounded-md -mt-4 py-[52px] flex flex-col justify-center items-center 
            col-span-12
            "
              >
                <div {...getRootProps({ className: "dropzone" })}>
                  <input className="hidden" {...getInputProps()} />
                  <img src={uploadSvgImage} alt="" className="mx-auto mb-4" />
                  {isDragAccept ? (
                    <p className="text-sm text-slate-500 dark:text-slate-300 ">
                      Drop the files here ...
                    </p>
                  ) : (
                    <p className="text-sm text-slate-500 dark:text-slate-300 f">
                      Drop files here or click to upload.
                    </p>
                  )}
                </div>
              </div>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <div className="col-span-12">
                <div className="grid grid-cols-12 gap-5">
                  <div className="col-span-12 lg:col-span-6 flex-wrap lg:flex gap-2 items-center">
                    <p>Show</p>
                    <Select
                      placeholder=""
                      options={[
                        { label: "10", value: "10" },
                        { label: "25", value: "25" },
                        { label: "50", value: "50" },
                      ]}
                      className="w-full lg:w-20 min-w-min"
                      value={selectPageSize}
                      onChange={(e) => handleTotalPage(e.target.value)}
                    />
                    <p>Entries</p>
                  </div>
                  <div className="col-span-12 lg:col-span-6">
                    <Search
                      value={search}
                      onChange={(value) => handleSearch(value)}
                    />
                  </div>
                </div>
              </div>
              <div className="col-span-12">
                <Table
                  headers={headers}
                  data={paginatedSpkData?.map((item, index) => ({
                    ...item,
                    no:
                      (currentPage - 1) * parseInt(selectPageSize) + index + 1,
                  }))}
                />
              </div>
              <div className="col-span-12">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  handlePageChange={handlePageChange}
                  currentPageItems={paginatedSpkData.length}
                  totalItems={uploadedExcel?.length}
                />
              </div>
            </React.Fragment>
          )}
        </div>
      </Card>
    </div>
  );
};

const headers = [
  { title: "No.", key: "no" },
  { title: "DEALER CODE", key: "dealer_code" },
  { title: "DEALER NAME", key: "dealer_name" },
  { title: "TYPE", key: "motor_type" },
  { title: "COLOR", key: "color" },
  { title: "FRAME", key: "chassis_no" },
  { title: "ENGINE", key: "engine_no" },
  { title: "UNIT YEAR", key: "unit_year" },
  //   { title: "Aksi", key: "action" },
];

export default UnitUpload;
