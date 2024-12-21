import Card from "@/components/ui/Card";
import DatePicker from "@/components/ui/DatePicker";
import Pagination from "@/components/ui/Pagination";
import Search from "@/components/ui/Search";
import Select from "@/components/ui/Select";
import Table from "@/pages/table/Table";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import {
  dayJsFormatDate,
  dayjsFormatInputDate,
  disabledDate,
} from "@/utils/dayjs";
import { useMutation, useQuery, useQueryClient } from "react-query";
import unit from "@/services/API/unit";
import queryString from "@/utils/queryString";
import { useDebounce } from "@/hooks/useDebounce";
import Button from "@/components/ui/Button";
import SelectDealer from "@/components/Select/SelectDealer";
import Swal from "sweetalert2";
import { SweetAlert } from "@/utils/Swal";

const Unit = () => {
  const [search, setSearch] = useState();
  const [selectPageSize, setSelectPageSize] = useState("10");
  const [dealer, setDealer] = useState("");

  const debouncedSearchValue = useDebounce(search, 500);
  const now = dayjs();
  const oneMonthBefore = now.subtract("1", "month");

  const [selectedDates, setSelectedDates] = useState({
    startDate: oneMonthBefore.toISOString(),
    endDate: now.toISOString(),
  });

  const [selectStatusUnit, setSelectStatusUnit] = useState("all");

  const [paging, setPaging] = useState({
    currentPage: 1,
    totalPage: 1,
  });

  const resultQueryString = queryString.stringified({
    q: debouncedSearchValue,
    page: paging.currentPage,
    limit: selectPageSize,
    start_date: dayjsFormatInputDate(selectedDates?.startDate),
    end_date: dayjsFormatInputDate(selectedDates?.endDate),
    unit_status: selectStatusUnit === "all" ? "" : selectStatusUnit,
    dealer_id: dealer?.value?.dealer_id,
  });

  const { data, isFetching, refetch, isSuccess, isRefetching } = useQuery({
    queryKey: ["getUnitStock", resultQueryString],
    queryFn: async () => {
      const response = await unit.getListUnit(resultQueryString);
      return response;
    },
  });

  useEffect(() => {
    if (isSuccess) {
      setPaging((state) => ({
        ...state,
        totalPage: data?.data?.last_page,
        currentPage: data?.data?.current_page,
      }));
    }
  }, [isSuccess, isRefetching, data]);

  useEffect(() => {
    setPaging((prevState) => ({
      ...prevState,
      currentPage: 1,
    }));
    refetch();
  }, [debouncedSearchValue]);

  const handleStartDate = async (value) => {
    setSelectedDates((prevState) => ({
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
    setSelectedDates((prevState) => ({
      ...prevState,
      endDate: value,
    }));
    await setPaging((state) => ({
      ...state,
      currentPage: 1,
    }));
    await refetch();
  };

  const handleStatusUnit = async (value) => {
    setSelectStatusUnit(value);
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
    await setSelectPageSize(value);
    await setPaging((state) => ({
      ...state,
      currentPage: 1,
    }));
    await refetch();
  };

  const handleChangeDealer = async (value) => {
    await setDealer(value);
    await setPaging((state) => ({
      ...state,
      currentPage: 1,
    }));
    await refetch();
  };

  const queryClient = useQueryClient();

  const { mutate: updateToSPK } = useMutation({
    mutationFn: async (id) => {
      const response = await unit.changeUnitToSPK(id);
      return response;
    },
    onSuccess: (res) => {
      if (res?.meta?.code === 200) {
        if (typeof res?.data === "object") {
          SweetAlert("success", "Success Update to SPK", "Success");
        } else {
          SweetAlert("success", res?.data, "Success");
        }
        queryClient.invalidateQueries({ queryKey: ["getUnitStock"] });
      } else {
        SweetAlert("error", `Failed to update`, "error");
      }
    },
    onError: (res) => {
      SweetAlert("error", res?.data, "error");
    },
  });

  return (
    <div>
      <Card>
        <div className="grid grid-cols-12 gap-5">
          <div className="col-span-12 lg:col-span-3">
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
              disabledDate={disabledDate}
              onChange={handleEndDate}
              form={false}
            />
          </div>
          <div className="col-span-12 lg:col-span-3">
            <Select
              label={"Status"}
              options={[
                { label: "SEMUA", value: "all" },
                { label: "ON HAND", value: "on_hand" },
                { label: "DELIVERED", value: "delivered" },
                { label: "RETUR", value: "retur" },
                { label: "SPK", value: "spk" },
              ]}
              value={selectStatusUnit}
              onChange={(value) => handleStatusUnit(value.target.value)}
            />
          </div>
          <div className="col-span-12 lg:col-span-3">
            <SelectDealer
              value={dealer}
              onChange={(value) => handleChangeDealer(value)}
            />
          </div>
          <div className="col-span-12">
            <div className="grid grid-cols-12 gap-5">
              <div className="col-span-12 lg:col-span-6  flex-wrap lg:flex gap-2 items-center">
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
              isLoading={isFetching}
              headers={headers}
              data={data?.data?.data.map((item, index) => ({
                ...item,
                no: (
                  <span>
                    {(paging.currentPage - 1) * parseInt(selectPageSize) +
                      index +
                      1}
                  </span>
                ),
                date: (
                  <span className="whitespace-nowrap">
                    {dayJsFormatDate(item?.created_at)}
                  </span>
                ),
                dealer_name: (
                  <span className="whitespace-nowrap">{`${item?.shipping_order?.dealer?.dealer_name} - ${item?.shipping_order?.dealer?.dealer_code}`}</span>
                ),
                action: (
                  <div className="flex gap-x-2">
                    {item?.unit_status !== "spk" && (
                      <Button
                        icon={"bx-chart"}
                        className="btn-warning rounded-full p-2"
                        // text="SPK"
                        onClick={() => {
                          Swal.fire({
                            title: "Apakah Anda Yakin?",
                            icon: "info",
                            text: `Change Unit to SPK ${item?.unit_frame}`,
                            showCancelButton: true,
                            cancelButtonText: "NO",
                            cancelButtonColor: "bg-danger",
                            confirmButtonText: "YES",
                            confirmButtonColor: "bg-success",
                          }).then((result) => {
                            if (result.isConfirmed) {
                              // mutate();
                              updateToSPK(item?.unit_id);
                              //  onUpdateRejectReturUnit();
                            }
                          });
                        }}
                      />
                    )}
                    <Button
                      className="btn-outline-dark py-1 px-4"
                      text="Detail"
                      link={`/unit-order/${item?.unit_id}`}
                    />
                  </div>
                ),
              }))}
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
  { title: "NO.", key: "no" },
  { title: "Tanggal", key: "date" },
  { title: "Tipe Motor", key: "motor.motor_name" },
  { title: "No. Rangka", key: "unit_frame" },
  { title: "No. Mesin", key: "unit_engine" },
  { title: "Warna", key: "unit_color" },
  { title: "Dealer", key: "dealer_name" },
  { title: "Status", key: "unit_status" },
  { title: "Aksi", key: "action" },
];

export default Unit;
