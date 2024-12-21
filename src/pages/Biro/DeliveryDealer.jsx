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
import ModalDeliveryDealer from "@/components/Modal/Biro/ModalDeliveryDealer";
import { useQuery } from "react-query";
import biro from "@/services/API/biro";
import { useDebounce } from "@/hooks/useDebounce";
import { dayJsFormatDate, dayjsFormatInputDate } from "@/utils/dayjs";
import queryString from "@/utils/queryString";

function DeliveryDealer() {
  const { handleModal } = createStore();
  const now = dayjs();
  const oneMonthBefore = now.subtract(1, "month");

  const [selectedDates, setSelectedDates] = useState({
    startDate: oneMonthBefore.toISOString(),
    endDate: now.toISOString(),
  });
  const [selectedPageSize, setSelectedPageSize] = useState("10");

  const [search, setSearch] = useState("");
  const debouncedSearchValue = useDebounce(search, 500);
  const [paging, setPaging] = useState({
    currentPage: 1,
    totalPage: 1,
  });
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedDocumentType, setSelectedDocumentType] = useState("all");

  const resultQueryString = queryString.stringified({
    q: debouncedSearchValue,
    page: paging.currentPage,
    limit: selectedPageSize,
    delivery_dealer_status: selectedStatus === "all" ? "" : selectedStatus,
    type_document: selectedDocumentType === "all" ? "" : selectedDocumentType,
    start_date: dayjsFormatInputDate(selectedDates?.startDate),
    end_date: dayjsFormatInputDate(selectedDates?.endDate),
  });

  const { isLoading, data, isSuccess, isRefetching, refetch } = useQuery({
    queryKey: ["getDevDealer", resultQueryString],
    queryFn: async () => {
      const response = await biro.getDeliveryDealer(resultQueryString);
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

  const handleChangeDocumentType = async (e) => {
    setSelectedDocumentType(e.target.value);
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
      <ModalDeliveryDealer />
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
              value={selectedDates?.endDate}
              onChange={handleEndDate}
            />
          </div>
          <div className="col-span-12 lg:col-span-3">
            <Select
              label={"Jenis Dokumen"}
              options={[
                { label: "Semua", value: "all" },
                { label: "STNK", value: "stnk" },
                { label: "PLAT", value: "plat" },
                { label: "BPKB", value: "bpkb" },
              ]}
              value={selectedDocumentType}
              onChange={handleChangeDocumentType}
            />
          </div>
          <div className="col-span-12 lg:col-span-3">
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
                value={selectedStatus}
                onChange={(value) => handleChangeStatus(value)}
              />
            </div>
          </div>

          <div className="col-span-12">
            <div className="grid grid-cols-1 lg:flex">
              <Button
                className="btn-dark py-2"
                text="ADD DELIVERY"
                onClick={() => handleModal("modalDeliveryDealer", true)}
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
                type_document: (
                  <span className="uppercase">{item?.type_document}</span>
                ),
                tanggal: <span>{dayJsFormatDate(item.created_at)}</span>,
                action: (
                  <Button
                    className="btn-outline-dark py-1 px-4"
                    text="DETAIL"
                    link={`/biro/delivery-dealer/${item?.delivery_dealer_id}`}
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
    key: "deliver_dealer_number",
  },
  {
    title: "DEALER",
    key: "dealer.dealer_name",
  },
  {
    title: "JLH SPK",
    key: "delivery_dealer_unit_total",
  },
  {
    title: "DOKUMEN",
    key: "type_document",
  },
  {
    title: "STATUS",
    key: "delivery_dealer_status",
  },
  {
    title: "AKSI",
    key: "action",
  },
];

export default DeliveryDealer;
