import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import DatePicker from "@/components/ui/DatePicker";
import Pagination from "@/components/ui/Pagination";
import Search from "@/components/ui/Search";
import Select from "@/components/ui/Select";
import Table from "@/pages/table/Table";
import unitReturn from "@/services/API/unitReturn";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { dayJsFormatDate, dayjsFormatInputDate } from "../../../utils/dayjs";
import queryString from "@/utils/queryString";
import { useDebounce } from "@/hooks/useDebounce";
import { disabledDate } from "@/utils/dayjs";

const Unit = () => {
  const [search, setSearch] = useState();
  const [selectPageSize, setSelectPageSize] = useState("10");

  const now = dayjs();
  const oneMonthBefore = now.subtract("1", "month");

  const [selectedDates, setSelectedDates] = useState({
    startDate: oneMonthBefore.toISOString(),
    endDate: now.toISOString(),
  });

  const [selectStatusUnitRetur, setSelectStatusUnitRetur] = useState("all");

  const debouncedSearchValue = useDebounce(search, 500);

  const [paging, setPaging] = useState({
    currentPage: 1,
    totalPage: 1,
  });

  const resultQueryString = queryString.stringified({
    start_date: dayjsFormatInputDate(selectedDates?.startDate),
    end_date: dayjsFormatInputDate(selectedDates?.endDate),
    limit: selectPageSize,
    page: paging?.currentPage,
    q: debouncedSearchValue,
    retur_unit_status:
      selectStatusUnitRetur === "all" ? "" : selectStatusUnitRetur,
  });

  const { isFetching, data, isSuccess, refetch, isRefetching } = useQuery({
    queryKey: ["getListReturnUnit", resultQueryString],
    queryFn: async () => {
      const response = await unitReturn.getListReturnUnit(resultQueryString);
      return response;
    },
  });

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
  const handleTotalPage = async (limit) => {
    await setSelectPageSize(limit);
    await setPaging((state) => ({
      ...state,
      currentPage: 1,
    }));
    await refetch();
  };

  const handlePageChange = async (page) => {
    await setPaging((state) => ({
      ...state,
      currentPage: page,
    }));
    await refetch();
  };

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

  const handleStatusUnitRetur = async (status) => {
    await setSelectStatusUnitRetur(status);
    await setPaging((prevState) => ({
      ...prevState,
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
            />
          </div>
          <div className="col-span-12 lg:col-span-3">
            <DatePicker
              label={"Tanggal Akhir"}
              value={selectedDates?.endDate}
              onChange={handleEndDate}
              disabledDate={disabledDate}
            />
          </div>
          <div className="col-span-12 lg:col-span-3">
            <Select
              label={"Status"}
              options={[
                { label: "SEMUA", value: "all" },
                { label: "REQUEST", value: "request" },
                { label: "APPROVE", value: "approved" },
                { label: "REJECT", value: "reject" },
              ]}
              value={selectStatusUnitRetur}
              onChange={(e) => handleStatusUnitRetur(e.target.value)}
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
              data={data?.data?.data?.map((item, index) => ({
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
                to: (
                  <span className="whitespace-nowrap">
                    {item?.dealer_destination?.dealer_name}
                  </span>
                ),
                action: [
                  <Button
                    key={`action-${index}`}
                    link={`/unit-return/${item?.retur_unit_id}`}
                    text={"Detail"}
                    className="btn-outline-dark py-1 px-4"
                  />,
                ],
              }))}
            />
          </div>
          <div className="col-span-12">
            <Pagination
              currentPage={data?.data?.current_page}
              totalPages={paging?.totalPage}
              currentPageItems={data?.data?.data?.length}
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
  { title: "TANGGAL", key: "date" },
  { title: "NO. RETUR", key: "retur_unit_number_dealer" },
  { title: "DEALER ASAL", key: "dealer_name" },
  { title: "RETUR KE", key: "main_dealer.main_dealer_name" },
  { title: "DEALER TUJUAN", key: "retur_unit_dealer_destination_name" },
  { title: "JUMLAH UNIT", key: "retur_unit_list_total" },
  { title: "JUMLAH TERIMA", key: "retur_unit_list_approved" },
  { title: "STATUS RETUR", key: "retur_unit_status" },
  { title: "action", key: "action" },
];

// const data = [
//   {
//     no: 1,
//     date: "2024-05-09",
//     retur_number: "RT001",
//     to: "Supplier A",
//     dealer_destination: "Dealer X",
//     unit_length: 5,
//     unit_approved: 3,
//     retur_status: "Pending",
//     action: "View",
//   },
//   {
//     no: 2,
//     date: "2024-05-10",
//     retur_number: "RT002",
//     to: "Supplier B",
//     dealer_destination: "Dealer Y",
//     unit_length: 4,
//     unit_approved: 2,
//     retur_status: "Completed",
//     action: "Edit",
//   },
//   {
//     no: 3,
//     date: "2024-05-11",
//     retur_number: "RT003",
//     to: "Supplier C",
//     dealer_destination: "Dealer Z",
//     unit_length: 6,
//     unit_approved: 5,
//     retur_status: "Pending",
//     action: "View",
//   },
//   {
//     no: 4,
//     date: "2024-05-12",
//     retur_number: "RT004",
//     to: "Supplier D",
//     dealer_destination: "Dealer W",
//     unit_length: 3,
//     unit_approved: 1,
//     retur_status: "Cancelled",
//     action: "View",
//   },
//   {
//     no: 5,
//     date: "2024-05-13",
//     retur_number: "RT005",
//     to: "Supplier E",
//     dealer_destination: "Dealer V",
//     unit_length: 7,
//     unit_approved: 6,
//     retur_status: "Completed",
//     action: "Edit",
//   },
//   {
//     no: 6,
//     date: "2024-05-14",
//     retur_number: "RT006",
//     to: "Supplier F",
//     dealer_destination: "Dealer U",
//     unit_length: 2,
//     unit_approved: 2,
//     retur_status: "Pending",
//     action: "View",
//   },
//   {
//     no: 7,
//     date: "2024-05-15",
//     retur_number: "RT007",
//     to: "Supplier G",
//     dealer_destination: "Dealer T",
//     unit_length: 5,
//     unit_approved: 4,
//     retur_status: "Completed",
//     action: "Edit",
//   },
//   {
//     no: 8,
//     date: "2024-05-16",
//     retur_number: "RT008",
//     to: "Supplier H",
//     dealer_destination: "Dealer S",
//     unit_length: 4,
//     unit_approved: 3,
//     retur_status: "Cancelled",
//     action: "View",
//   },
//   {
//     no: 9,
//     date: "2024-05-17",
//     retur_number: "RT009",
//     to: "Supplier I",
//     dealer_destination: "Dealer R",
//     unit_length: 6,
//     unit_approved: 5,
//     retur_status: "Pending",
//     action: "Edit",
//   },
//   {
//     no: 10,
//     date: "2024-05-18",
//     retur_number: "RT010",
//     to: "Supplier J",
//     dealer_destination: "Dealer Q",
//     unit_length: 3,
//     unit_approved: 2,
//     retur_status: "Completed",
//     action: "View",
//   },
// ];

export default Unit;
