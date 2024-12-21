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
import createStore from "@/context";
import ModalFakturDelivery from "@/components/Modal/Biro/ModalFakturDelivery";
import { useQuery } from "react-query";
import biro from "@/services/API/biro";
import queryString from "@/utils/queryString";
import { useDebounce } from "@/hooks/useDebounce";
import { dayJsFormatDate, dayjsFormatInputDate } from "@/utils/dayjs";

function FakturDelivery() {
  const { handleModal } = createStore();

  const headers = [
    {
      title: "NO",
      key: "no",
    },
    {
      title: "Tanggal",
      key: "tanggal",
    },
    {
      title: "NO. TANDA TERIMA",
      key: "faktur_delivered_number",
    },
    {
      title: "DEALER",
      key: "dealer.dealer_name",
    },
    {
      title: "JUMLAH BERKAS",
      key: "faktur_delivered_unit_total",
    },
    {
      title: "STATUS",
      key: "faktur_delivered_status",
    },
    {
      title: "AKSI",
      key: "action",
    },
  ];

  const now = dayjs();
  const oneMonthBefore = now.subtract(1, "month");
  const [search, setSearch] = useState("");
  const debouncedSearchValue = useDebounce(search, 500);
  const [selectedPageSize, setSelectedPageSize] = useState("10");
  const [paging, setPaging] = useState({
    currentPage: 1,
    totalPage: 1,
  });
  const [selectDealer, setSelectedDealer] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const [selectedDates, setSelectedDates] = useState({
    startDate: oneMonthBefore.toISOString(),
    endDate: now.toISOString(),
  });

  const resultQueryString = queryString.stringified({
    q: debouncedSearchValue,
    page: paging.currentPage,
    limit: selectedPageSize,
    faktur_delivered_status: selectedStatus === "all" ? "" : selectedStatus,
    dealer_id: selectDealer?.value?.dealer_id,
    start_date: dayjsFormatInputDate(selectedDates?.startDate),
    end_date: dayjsFormatInputDate(selectedDates?.endDate),
  });

  const { refetch, isSuccess, isRefetching, data, isFetching } = useQuery({
    queryKey: ["getFakturDelivery", resultQueryString],
    queryFn: async () => {
      const response = await biro.getFakturDelivered(resultQueryString);
      return response;
    },
  });

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

  const handleSelectPage = async (e) => {
    await setPaging((prev) => ({
      ...prev,
      currentPage: e,
    }));
    await refetch();
  };

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
      <ModalFakturDelivery type={"faktur-delivery"} />
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
                  label: "CREATE",
                  value: "create",
                },
                {
                  label: "CONFIRM",
                  value: "confirm",
                },
                {
                  label: "RECEIVED",
                  value: "received",
                },
              ]}
              value={selectedStatus}
              onChange={(value) => handleChangeStatus(value)}
            />
          </div>
          <div className="col-span-12">
            <div className="grid grid-cols-1 lg:flex">
              <Button
                className="btn-dark py-2 w-full lg:w-auto"
                text="ADD DELIVERY"
                onClick={() => handleModal("modalFakturDelivery", true)}
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
                  <div>
                    <span>
                      {(paging.currentPage - 1) * parseInt(selectedPageSize) +
                        index +
                        1}
                    </span>
                  </div>
                ),
                tanggal: <span>{dayJsFormatDate(item.created_at)}</span>,
                action: (
                  <Button
                    className="btn-outline-dark py-1 px-4"
                    text="DETAIL"
                    link={`/biro/faktur-delivery/${item?.faktur_delivered_id}`}
                  />
                ),
              }))}
            />
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

export default FakturDelivery;
