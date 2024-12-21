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
import Table from "@/pages/table/Table";
import TableAdvancedPage from "@/pages/table/react-table";
import shippingOrder from "@/services/API/shippingOrder";
import SelectDealer from "@/components/Select/SelectDealer";
import { SweetAlert } from "@/utils/Swal";
import {
  dayJsFormatDate,
  dayjsFormatInputDate,
  disabledDate,
} from "@/utils/dayjs";
import queryString from "@/utils/queryString";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import Flatpickr from "react-flatpickr";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

const ShippingOrder = () => {
  const { control } = useForm();
  const [search, setSearch] = useState("");
  const [selectPageSize, setSelectPageSize] = useState("10");
  const [dealer, setDealer] = useState("");

  const [paging, setPaging] = useState({
    currentPage: 1,
    totalPage: 1,
  });

  const debouncedSearchValue = useDebounce(search, 500);

  const handleModal = createStore((state) => state.handleModal);

  const now = dayjs();
  const oneMonthBefore = now.subtract(1, "month");

  const [selectedDates, setSelectedDates] = useState({
    startDate: oneMonthBefore.toISOString(),
    endDate: now.toISOString(),
  });

  const resultQueryString = queryString.stringified({
    q: debouncedSearchValue,
    start_date: dayjsFormatInputDate(selectedDates?.startDate),
    end_date: dayjsFormatInputDate(selectedDates?.endDate),
    limit: selectPageSize,
    page: paging.currentPage,
    dealer_id: dealer?.value?.dealer_id,
  });

  const { data, refetch, isFetching, isSuccess, isRefetching } = useQuery({
    queryKey: ["getShippingOrder", resultQueryString],
    queryFn: async () => {
      const response = await shippingOrder.listShippingOrder(resultQueryString);
      return response;
    },
  });

  const handleStartDate = async (value) => {
    await setSelectedDates((prevState) => ({
      ...prevState,
      startDate: value,
    }));
    await setPaging((state) => ({
      ...state,
      currentPage: 1,
    }));
    await refetch();
  };

  const handleEndDate = async (value) => {
    await setSelectedDates((prevState) => ({
      ...prevState,
      endDate: value,
    }));
    await setPaging((state) => ({
      ...state,
      currentPage: 1,
    }));
    await refetch();
  };

  const handlePageChange = async (value) => {
    await setPaging((state) => ({
      ...state,
      currentPage: value,
    }));
    await refetch();
  };

  const handleTotalPage = async (value) => {
    setSelectPageSize(value);
    await setPaging((state) => ({
      ...state,
      currentPage: 1,
    }));
    await refetch();
  };

  useEffect(() => {
    if (isSuccess) {
      setPaging((prevState) => ({
        ...prevState,
        totalPage: data?.data?.last_page,
        currentPage: data?.data?.current_page,
      }));
    }
  }, [isSuccess, isRefetching, data]);

  useEffect(() => {
    const fetchData = async () => {
      await setPaging((prevState) => ({
        ...prevState,
        currentPage: 1,
      }));
      await refetch();
    };
    fetchData();
  }, [debouncedSearchValue]);

  const handleChangeDealer = async (value) => {
    await setDealer(value);
    await setPaging((state) => ({
      ...state,
      currentPage: 1,
    }));
    await refetch();
  };

  const deleteShippingOrder = useMutation({
    mutationKey: "deleteShippingOrder",
    mutationFn: async () => {
      const data = {
        dealer_id: dealer?.value?.dealer_id,
      };

      const response = await shippingOrder.deleteShippingOrder(data);

      return response;
    },
    onSuccess: (res) => {
      if (res?.meta?.code === 200) {
        toast.success("Success");
        refetch();
      } else {
        toast.error("error", res?.response?.data?.meta?.message, "Error");
      }
    },
    onError: () => {
      toast.error("Error");
    },
  });

  const handleDeleteShippingOrder = () => {
    if (!dealer?.value) {
      SweetAlert(
        "error",
        `Harap filter dahulu dealer untuk di delete`,
        "error"
      );
      return;
    }
    Swal.fire({
      title: "Apakah Anda Yakin?",
      icon: "info",
      showCancelButton: true,
      cancelButtonText: "NO",
      cancelButtonColor: "bg-danger",
      confirmButtonText: "YES",
      confirmButtonColor: "bg-success",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteShippingOrder.mutate();
      }
    });
  };

  return (
    <div>
      <Card>
        <ModalSyncShippingOrder />

        <div className="grid grid-cols-12 gap-5">
          <div className="col-span-12 lg:col-span-3 ">
            <DatePicker
              label={"Tanggal Awal"}
              value={selectedDates?.startDate}
              onChange={handleStartDate}
              form={false}
            />
          </div>
          <div className="col-span-12 lg:col-span-3">
            <DatePicker
              label={"Tanggal Akhir"}
              value={selectedDates?.endDate}
              onChange={handleEndDate}
              form={false}
            />
          </div>
          <div className="col-span-12 lg:col-span-3">
            <SelectDealer
              value={dealer}
              onChange={(value) => handleChangeDealer(value)}
            />
          </div>
          <div className="col-span-12">
            <div className="lg:flex grid grid-cols-1 gap-5 ">
              <Button
                className="btn-dark w-full lg:w-auto"
                text={"SYNC"}
                onClick={() =>
                  handleModal("modalSyncShippingOrder", true, "", "")
                }
              />
              <Button
                className="btn-success w-full lg:w-auto"
                text={"IMPORT"}
                link={"/shipping-order/upload"}
                icon={"mdi:file-excel"}
              />
              <Button
                className="btn-danger w-full lg:w-auto"
                text={"Delete Shipping Order"}
                isLoading={deleteShippingOrder.isLoading}
                onClick={handleDeleteShippingOrder}
              />
            </div>
          </div>
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
                <Search value={search} onChange={(value) => setSearch(value)} />
              </div>
            </div>
          </div>

          <div className="col-span-12">
            <Table
              headers={headers}
              data={data?.data?.data?.map((item, index) => ({
                ...item,
                no: (
                  <span>
                    {(paging.currentPage - 1) * parseInt(selectPageSize) +
                      index +
                      1}
                  </span>
                ),
                dealer: (
                  <span>
                    {item?.dealer?.dealer_name} ({item?.dealer?.dealer_code})
                  </span>
                ),
                date: (
                  <span className="whitespace-nowrap">
                    {dayJsFormatDate(item?.shipping_order_shipping_date)}
                  </span>
                ),
                unit_delivered: (
                  <span>
                    {
                      item?.unit?.filter(
                        (filter) => filter?.unit_status === "delivered"
                      ).length
                    }
                  </span>
                ),
                action: [
                  <Button
                    key={index}
                    link={`/shipping-order/${item?.shipping_order_id}`}
                    className="btn-outline-dark py-1 px-4"
                    text={"DETAIL"}
                  />,
                ],
              }))}
              isLoading={isFetching}
            />
          </div>
          <div className="col-span-12">
            <Pagination
              currentPage={paging.currentPage}
              totalPages={paging?.totalPage}
              currentPageItems={
                parseInt(data?.data?.data?.length) *
                parseInt(paging.currentPage)
              }
              totalItems={data?.data?.total}
              handlePageChange={handlePageChange}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

const headers = [
  { title: "No.", key: "no" },
  { title: "Tanggal", key: "date" },
  { title: "Sales Order", key: "shipping_order_number" },
  { title: "No Delivery", key: "shipping_order_delivery_number" },
  { title: "Dealer Tujuan", key: "dealer" },
  { title: "Jumlah Unit", key: "unit_total" },
  { title: "Jumlah Diterima", key: "unit_delivered" },
  { title: "Aksi", key: "action" },
];

export default ShippingOrder;
