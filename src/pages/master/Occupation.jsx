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
import ModalOccupation from "@/components/Modal/Master/ModalOccupation";

const Occupation = () => {
  const { handleModal } = createStore();
  const [selectStatus, setSelectStatus] = useState("all");
  const [selectPageSize, setSelectPageSize] = useState("10");
  const [search, setSearch] = useState("");
  const debouncedSearchValue = useDebounce(search, 500);
  const [paging, setPaging] = useState({
    currentPage: 1,
    totalPage: 1,
  });

  const resultQueryString = queryString.stringified({
    q: debouncedSearchValue,
    limit: selectPageSize,
    status: selectStatus === "all" ? "" : selectStatus,
  });
  const { data, isFetching, refetch, isSuccess, isRefetching } = useQuery({
    queryKey: ["getOccupationList"],
    queryFn: async () => {
      const response = await master.getOccupationList(resultQueryString);
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

  const handleStatus = async (e) => {
    await setSelectStatus(e.target.value);
    await setPaging((prevState) => ({
      ...prevState,
      currentPage: 1,
    }));
    await refetch();
  };

  const handleSelectPageSize = async (e) => {
    setSelectPageSize(e.target.value);
    await setPaging((prevState) => ({
      ...prevState,
      currentPage: 1,
    }));
    await refetch();
  };

  const handlePage = async (value) => {
    await setPaging((prev) => ({
      ...prev,
      currentPage: value,
    }));
    await refetch();
  };

  return (
    <div>
      <ModalOccupation />
      <Card>
        <div className="grid grid-cols-12 gap-5">
          <div className="col-span-12 lg:col-span-3">
            <Select
              placeholder="Pilih Status"
              label={"Status"}
              options={[
                { label: "Semua", value: "all" },
                { label: "Active", value: "Active" },
                { label: "Non-Active", value: "Non-Active" },
              ]}
              value={selectStatus}
              onChange={handleStatus}
            />
          </div>
          <div className="col-span-12">
            <div className="grid grid-cols-2 lg:grid-cols-12 gap-5">
              <div className="col-span-2">
                <Button
                  text="ADD NEW"
                  className="bg-slate-800 text-white hover:bg-slate-950 w-full"
                  onClick={() => handleModal("modalMasterOccupation", true)}
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
              isLoading={isFetching}
              data={data?.data?.data.map((item, index) => ({
                ...item,
                no: (
                  <span>
                    {(paging.currentPage - 1) * parseInt(selectPageSize) +
                      index +
                      1}
                  </span>
                ),
                action: (
                  <Button
                    text={"Detail"}
                    className="btn-outline-dark py-1"
                    onClick={() =>
                      handleModal("modalMasterOccupation", true, item)
                    }
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
              handlePageChange={handlePage}
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
    title: "Name",
    key: "occupation_name",
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

export default Occupation;