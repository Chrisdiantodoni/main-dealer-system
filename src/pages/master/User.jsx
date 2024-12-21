import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Pagination from "@/components/ui/Pagination";
import Select from "@/components/ui/Select";
import { useDebounce } from "@/hooks/useDebounce";
import master from "@/services/API/master";
import queryString from "@/utils/queryString";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import Table from "../table/Table";
import Search from "@/components/ui/Search";
import createStore from "@/context";
import SelectComponent from "@/components/ui/Select/Select";
import user from "@/services/API/user";
import Badge from "@/components/ui/Badge";
import ModalUser from "@/components/Modal/Master/ModalUser";

const User = () => {
  const { handleModal } = createStore();
  const [selectStatus, setSelectStatus] = useState("all");
  const [selectPageSize, setSelectPageSize] = useState("10");
  const [selectMainDealer, setSelectMainDealer] = useState(null);
  const [mainDealer, setMainDealer] = useState([]);
  const [search, setSearch] = useState("");
  const debouncedSearchValue = useDebounce(search, 500);
  const [paging, setPaging] = useState({
    currentPage: 1,
    totalPage: 1,
  });

  const resultQueryString = queryString.stringified({
    q: debouncedSearchValue,
    limit: selectPageSize,
    page: paging.currentPage,
    status: selectStatus === "all" ? "" : selectStatus,
    main_dealer_id: selectMainDealer,
  });
  const { data, isFetching, refetch, isSuccess, isRefetching } = useQuery({
    queryKey: ["getUserList", resultQueryString],
    queryFn: async () => {
      const response = await user.getListUser(resultQueryString);
      return response;
    },
  });

  const { isFetching: isLoading } = useQuery({
    queryKey: ["getMainDealer"],
    queryFn: async () => {
      const response = await master.getMainDealerList();
      console.log(response);
      setMainDealer([
        ...[
          {
            label: "Semua",
            value: "all",
          },
        ],
        ...response?.data?.data?.map((item) => ({
          label: item?.main_dealer_name,
          value: item?.main_dealer_id,
        })),
      ]);
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

  const handleSelectStatus = async (e) => {
    await setSelectStatus(e.target.value);
    await setPaging((prev) => ({
      ...prev,
      currentPage: 1,
    }));
    await refetch();
  };

  const handleSelectPageSize = async (e) => {
    await setSelectPageSize(e.target.value);
    await setPaging((prev) => ({
      ...prev,
      currentPage: 1,
    }));
    await refetch();
  };
  const handleSelectPage = async (e) => {
    await setPaging((prev) => ({
      ...prev,
      currentPage: e,
    }));
    await refetch();
  };

  const handleSelectMainDealer = async (e) => {
    await setSelectMainDealer(e.target.value);
    await setPaging((prev) => ({
      ...prev,
      currentPage: 1,
    }));
    await refetch();
  };

  console.log({ mainDealer });

  return (
    <div>
      <ModalUser />
      <Card>
        <div className="grid grid-cols-12 gap-5">
          <div className="col-span-12 lg:col-span-3">
            <Select
              placeholder="Pilih Status"
              label={"Status"}
              options={[
                { label: "Semua", value: "all" },
                { label: "Active", value: "Active" },
                { label: "Non-Active", value: "unactive" },
              ]}
              value={selectStatus}
              onChange={handleSelectStatus}
            />
          </div>
          <div className="col-span-12 lg:col-span-3">
            <Select
              placeholder="Main Dealer"
              label={"Main Dealer"}
              options={mainDealer}
              value={selectMainDealer}
              onChange={handleSelectMainDealer}
            />
          </div>
          <div className="col-span-12">
            <div className="grid grid-cols-2 lg:grid-cols-12 gap-5">
              <div className="col-span-2">
                <Button
                  text="ADD NEW"
                  className="bg-slate-800 text-white hover:bg-slate-950 w-full"
                  onClick={() => handleModal("modalMasterAddUser", true)}
                />
              </div>
            </div>
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
                  onChange={(value) => handleSelectPageSize(value)}
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
              isLoading={isFetching || isLoading}
              data={data?.data?.data.map((item, index) => ({
                ...item,
                no: (
                  <span>
                    {(paging.currentPage - 1) * parseInt(selectPageSize) +
                      index +
                      1}
                  </span>
                ),

                main_dealer: (
                  <>
                    {item?.main_dealers?.map((dealer, index) => (
                      <Badge
                        key={index}
                        className="bg-slate-700 text-white m-0.5"
                      >
                        {dealer?.main_dealer?.main_dealer_name}
                      </Badge>
                    ))}
                  </>
                ),
                status: (
                  <Badge
                    label={item?.user_status}
                    className={`${
                      item?.user_status === "active"
                        ? "bg-success-500"
                        : "bg-danger-500"
                    }  text-white`}
                  />
                ),
                action: (
                  <Button
                    text="Detail"
                    className="btn-outline-dark py-1"
                    link={`/master-data/user/${item?.user_id}`}
                  />
                ),
              }))}
              headers={headers}
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
};

const headers = [
  {
    title: "NO.",
    key: "no",
  },
  {
    title: "Nama",
    key: "name",
  },
  {
    title: "Username",
    key: "username",
  },
  {
    title: "Main Dealer",
    key: "main_dealer",
  },
  {
    title: "Status",
    key: "status",
  },
  {
    title: "Action",
    key: "action",
  },
];

export default User;
