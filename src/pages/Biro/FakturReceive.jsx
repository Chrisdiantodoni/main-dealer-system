import SelectDealer from "@/components/Select/SelectDealer";
import Card from "@/components/ui/Card";
import DatePicker from "@/components/ui/DatePicker";
import Select from "@/components/ui/Select";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import Table from "../table/Table";
import Search from "@/components/ui/Search";
import Pagination from "@/components/ui/Pagination";
import Button from "@/components/ui/Button";
import Checkbox from "@/components/ui/Checkbox";
import { useMutation, useQuery } from "react-query";
import biro from "@/services/API/biro";
import queryString from "@/utils/queryString";
import { useDebounce } from "@/hooks/useDebounce";
import { dayJsFormatDate, dayjsFormatInputDate } from "@/utils/dayjs";
import { SweetAlert } from "@/utils/Swal";
import Swal from "sweetalert2";

function FakturReceive() {
  const now = dayjs();
  const oneMonthBefore = now.subtract(1, "month");
  const [selectedSpk, setSelectedSpk] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [search, setSearch] = useState("");
  const debouncedSearchValue = useDebounce(search, 500);
  const [selectedPageSize, setSelectedPageSize] = useState("10");
  const [selectDealer, setSelectedDealer] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [paging, setPaging] = useState({
    currentPage: 1,
    totalPage: 1,
  });

  const [selectedDates, setSelectedDates] = useState({
    startDate: oneMonthBefore.toISOString(),
    endDate: now.toISOString(),
  });

  const resultQueryString = queryString.stringified({
    q: debouncedSearchValue,
    page: paging.currentPage,
    limit: selectedPageSize,
    faktur_received_status: selectedStatus === "all" ? "" : selectedStatus,
    dealer_id: selectDealer?.value?.dealer_id,
    start_date: dayjsFormatInputDate(selectedDates?.startDate),
    end_date: dayjsFormatInputDate(selectedDates?.endDate),
  });

  const { data, isFetching, isSuccess, refetch, isRefetching } = useQuery({
    queryKey: ["getFakturReceived", resultQueryString],
    queryFn: async () => {
      const response = await biro.getFakturReceive(resultQueryString);
      return response;
    },
  });

  useEffect(() => {
    if (data?.data?.data && data?.data?.data?.length > 0) {
      const newSelectedData = selectedSpk?.filter(
        (item) =>
          (item.faktur_received_status === "waiting" ||
            item?.faktur_received_status === "rejected") &&
          data.data.data.some(
            (newItem) =>
              newItem.faktur_application_id === item.faktur_application_id
          )
      );
      const totalItems = data?.data?.data?.filter(
        (filter) => filter?.faktur_received_status === "waiting"
      ).length;
      const selectedItems = newSelectedData.length;

      if (totalItems > 0 && selectedItems === totalItems) {
        setSelectAll(true);
      } else {
        setSelectAll(false);
      }
    } else {
      setSelectAll(false);
    }
  }, [data, selectedSpk]);

  const { mutate: ReceiveFaktur, isLoading: loadingReceive } = useMutation({
    mutationFn: async () => {
      const body = {
        faktur_received: selectedSpk?.map((item) => ({
          faktur_received_id: item?.faktur_received_id,
          faktur_received_status: "received", //received, rejected
          dealer_id: item?.dealer_id,
          faktur_application_id: item?.faktur_application_id,
        })),
      };
      const response = await biro.updateStatusFakturReceive(body);
      return response;
    },
    onSuccess: (res) => {
      if (res?.meta?.code === 200) {
        SweetAlert("success", "Berhasil", "success");
        setSelectedSpk([]);
        refetch();
      } else {
        SweetAlert("error", "Gagal", "gagal");
      }
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const { mutate: rejectFaktur, isLoading: loadingReject } = useMutation({
    mutationFn: async () => {
      const body = {
        faktur_received: selectedSpk?.map((item) => ({
          faktur_received_id: item?.faktur_received_id,
          faktur_received_status: "rejected", //received, rejected
          dealer_id: item?.dealer_id,
          faktur_application_id: item?.faktur_application_id,
        })),
      };
      const response = await biro.updateStatusFakturReceive(body);
      return response;
    },
    onSuccess: (res) => {
      if (res?.meta?.code === 200) {
        SweetAlert("success", "Berhasil", "success");
        setSelectedSpk([]);
        refetch();
      } else {
        SweetAlert("error", "Gagal", "gagal");
      }
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const headers = [
    {
      title: (
        <div className="flex">
          {data?.data?.data?.some(
            (some) => some?.faktur_received_status === "waiting"
          ) && (
            <Checkbox
              value={selectAll}
              onChange={() => {
                const newSelectAll = !selectAll;
                setSelectAll(newSelectAll);
                if (newSelectAll) {
                  let newData = data?.data?.data
                    ?.filter(
                      (filter) => filter?.faktur_received_status === "waiting"
                    )
                    .map((item) => ({
                      ...item,
                      pagination: paging.currentPage,
                    }));
                  const combinedData = [...selectedSpk, ...newData];
                  const uniqueData = combinedData?.filter(
                    (value, index, self) =>
                      index ===
                      self.findIndex(
                        (t) =>
                          t.faktur_application_id ===
                          value.faktur_application_id
                      )
                  );
                  setSelectedSpk(uniqueData);
                } else {
                  setSelectedSpk((prevState) =>
                    prevState.filter(
                      (item) => item.pagination !== paging.currentPage
                    )
                  );
                }
              }}
            />
          )}
          NO.
        </div>
      ),
      key: "no",
    },
    {
      title: "Tanggal",
      key: "tanggal",
    },
    {
      title: "NO. SPK",
      key: "spk_number",
    },
    {
      title: "DEALER",
      key: "dealer_name",
    },
    {
      title: "NAMA STNK",
      key: "name_legal",
    },
    {
      title: "NO. HP",
      key: "no_hp",
    },
    {
      title: "NO. RANGKA",
      key: "number_frame",
    },
    {
      title: "NO. MESIN",
      key: "number_engine",
    },

    {
      title: "STATUS",
      key: "faktur_received_status",
    },
  ];

  const handleSelectPage = async (e) => {
    await setPaging((prev) => ({
      ...prev,
      currentPage: e,
    }));
    await refetch();
  };

  useEffect(() => {
    setPaging((prevState) => ({
      ...prevState,
      currentPage: 1,
    }));
    refetch();
  }, [debouncedSearchValue]);

  useEffect(() => {
    if (isSuccess || isRefetching) {
      setPaging((state) => ({
        ...state,
        totalPage: data?.data?.last_page,
        currentPage: data?.data?.current_page,
      }));
    }
  }, [isSuccess, isRefetching]);

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

  const handleTotalPage = async (value) => {
    setSelectedPageSize(value);
    await setPaging((state) => ({
      ...state,
      currentPage: 1,
    }));
    await refetch();
  };

  const handleChangeDealer = async (dealer) => {
    setSelectedDealer(dealer);
    await setPaging((state) => ({
      ...state,
      currentPage: 1,
    }));
    await refetch();
  };

  const handleChangeStatus = async (e) => {
    setSelectedStatus(e.target.value);
    await setPaging((state) => ({
      ...state,
      currentPage: 1,
    }));
    await refetch();
  };

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
              onChange={handleEndDate}
              form={false}
            />
          </div>
          <div className="col-span-12 lg:col-span-3">
            <SelectDealer
              value={selectDealer}
              onChange={(value) => handleChangeDealer(value)}
            />
          </div>
          <div className="col-span-12 lg:col-span-3">
            <Select
              label={"Status"}
              options={[
                {
                  label: "SEMUA",
                  value: "all",
                },
                {
                  label: "WAITING",
                  value: "waiting",
                },
                {
                  label: "RECEIVED",
                  value: "received",
                },
                {
                  label: "REJECTED",
                  value: "rejected",
                },
              ]}
              value={selectedStatus}
              onChange={(value) => handleChangeStatus(value)}
            />
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
                  value={selectedPageSize}
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
              isLoading={isFetching}
              data={data?.data?.data?.map((item, index) => ({
                ...item,
                no: (
                  <div className="flex items-center gap-2">
                    {item?.faktur_received_status === "waiting" && (
                      <Checkbox
                        name={"selected_spk"}
                        value={selectedSpk.some(
                          (some) =>
                            some?.faktur_application_id ===
                            item?.faktur_application_id
                        )}
                        onChange={() => {
                          const isSelected = selectedSpk?.some(
                            (some) =>
                              some.faktur_application_id ===
                              item?.faktur_application_id
                          );
                          const newItem = {
                            ...item,
                            pagination: paging.currentPage,
                          };
                          if (isSelected) {
                            setSelectedSpk(
                              selectedSpk.filter(
                                (filter) =>
                                  filter?.faktur_application_id !==
                                  item?.faktur_application_id
                              )
                            );
                            setSelectAll(false);
                          } else {
                            const existingSelectedItem = selectedSpk;
                            setSelectedSpk([...existingSelectedItem, newItem]);
                          }
                        }}
                      />
                    )}
                    <span>
                      {(paging.currentPage - 1) * parseInt(selectedPageSize) +
                        index +
                        1}
                    </span>
                  </div>
                ),
                tanggal: <span>{dayJsFormatDate(item?.created_at)}</span>,
              }))}
            />
          </div>
          <div className="col-span-12">
            <div className="grid grid-cols-1 lg:flex gap-2">
              <Button
                isLoading={loadingReceive}
                className={`btn-success py-1 transition-opacity ${
                  selectedSpk.length > 0 ? "opacity-100" : "opacity-30"
                } `}
                text={"Received"}
                onClick={() => {
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
                      ReceiveFaktur();
                    }
                  });
                }}
              />
              <Button
                className={`btn-danger py-1 transition-all ${
                  selectedSpk.length > 0 ? "opacity-100" : "opacity-30"
                } `}
                isLoading={loadingReject}
                text={"Reject"}
                onClick={() => {
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
                      // ReceiveFaktur();
                      rejectFaktur();
                    }
                  });
                }}
              />
            </div>
          </div>
          <div className="col-span-12">
            <Pagination
              currentPage={data?.data?.current_page}
              totalPages={paging?.totalPage}
              currentPageItems={data?.data?.data?.length}
              totalItems={data?.data?.total}
              handlePageChange={handleSelectPage}
            />
          </div>
        </div>
      </Card>
    </div>
  );
}

export default FakturReceive;
