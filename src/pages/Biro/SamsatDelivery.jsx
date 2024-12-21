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
import ModalSamsat from "@/components/Modal/Biro/ModalSamsat";
import SelectComponent from "@/components/ui/Select/Select";
import { useQuery } from "react-query";
import biro from "@/services/API/biro";
import { useDebounce } from "@/hooks/useDebounce";
import queryString from "@/utils/queryString";
import queryStrings from "query-string";
import { dayJsFormatDate, dayjsFormatInputDate } from "@/utils/dayjs";
import SelectBiro from "@/components/Select/SelectBiro";

function FakturDelivery() {
  const { handleModal } = createStore();
  const now = dayjs();
  const oneMonthBefore = now.subtract(1, "month");
  const [selectedPageSize, setSelectedPageSize] = useState("10");
  const [selectBiro, setSelectBiro] = useState("");

  const [selectedDates, setSelectedDates] = useState({
    startDate: oneMonthBefore.toISOString(),
    endDate: now.toISOString(),
  });

  const [search, setSearch] = useState("");
  const debouncedSearchValue = useDebounce(search, 500);

  const [status, setStatus] = useState("all");

  const [paging, setPaging] = useState({
    currentPage: 1,
    totalPage: 1,
  });
  const resultQueryString = queryString.stringified({
    q: debouncedSearchValue,
    page: paging.currentPage,
    limit: selectedPageSize,
    biro_id: selectBiro?.value?.biro_id,
    start_date: dayjsFormatInputDate(selectedDates?.startDate),
    end_date: dayjsFormatInputDate(selectedDates?.endDate),
    samsat_dev_status: status === "all" ? "" : status,
  });
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
      key: "samsat_dev_number",
    },
    {
      title: "BIRO",
      key: "biro.biro_name",
    },
    {
      title: "JLH SPK",
      key: "samsat_unit_dev_total",
    },
    {
      title: "STATUS",
      key: "samsat_dev_status",
    },
    {
      title: "AKSI",
      key: "action",
    },
  ];

  const { isLoading, data, isSuccess, isRefetching, refetch } = useQuery({
    queryKey: ["getSamsatDev", resultQueryString],
    queryFn: async () => {
      const response = await biro.getSamsatDelivery(resultQueryString);
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

  const handleChangeBiro = async (dealer) => {
    setSelectBiro(dealer);
    await setPaging((state) => ({
      ...state,
      currentPage: 1,
    }));
    await refetch();
  };

  const handleChangeStatus = async (e) => {
    setStatus(e.target.value);

    await setPaging((state) => ({
      ...state,
      currentPage: 1,
    }));
    await refetch();
  };

  return (
    <div>
      <ModalSamsat type={"delivery"} />
      <Card>
        <div className="grid grid-cols-12 gap-5">
          <div className="col-span-12 lg:col-span-3">
            <DatePicker
              label={"Tanggal Awal"}
              form={false}
              value={selectedDates.startDate}
              onChange={handleStartDate}
            />
          </div>

          <div className="col-span-12 lg:col-span-3">
            <DatePicker
              label={"Tanggal Akhir"}
              form={false}
              value={selectedDates.endDate}
              onChange={handleEndDate}
            />
          </div>
          <div className="col-span-12 lg:col-span-3">
            <SelectBiro
              label={"Biro"}
              value={selectBiro}
              onChange={handleChangeBiro}
            />
          </div>
          <div className="col-span-12 lg:col-span-3">
            <Select
              label={"Status"}
              options={[
                {
                  label: "Semua",
                  value: "all",
                },
                {
                  label: "Confirm",
                  value: "confirm",
                },
                {
                  label: "Create",
                  value: "create",
                },
              ]}
              value={status}
              onChange={(value) => handleChangeStatus(value)}
            />
          </div>
          <div className="grid grid-cols-1 lg:flex">
            <Button
              className="btn-dark py-2"
              text="ADD DELIVERY"
              onClick={() => handleModal("modalSamsat", true)}
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
                  onChange={handleTotalPage}
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
              isLoading={isLoading}
              headers={headers}
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
                    link={`/biro/samsat-delivery/${item?.samsat_dev_id}`}
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
