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
import ModalMasterDealerNeq from "@/components/Modal/Master/ModalMasterDealerNeq";
import Dropdown from "@/components/ui/Dropdown";
import Icons from "@/components/ui/Icon";
import { Menu } from "@headlessui/react";

const DealerNeq = () => {
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
    page: paging.currentPage,
    limit: selectPageSize,
  });
  const { data, isFetching, refetch, isSuccess, isRefetching } = useQuery({
    queryKey: ["getDealerNeqList", resultQueryString],
    queryFn: async () => {
      const response = await master.getDealerNeqList(resultQueryString);
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
  }, [isSuccess]);

  const handleSelectPageSize = async (pageSize) => {
    setSelectPageSize(pageSize);
    await setPaging((prevState) => ({
      ...prevState,
      currentPage: 1,
    }));
    await refetch();
  };

  const actions = [
    {
      name: "edit",
      icon: "heroicons:pencil-square",
      onClick: (item) => {
        handleModal("modalMasterDealerNeq", true, item);
      },
    },

    {
      name: "delete",
      icon: "heroicons-outline:trash",
      onClick: () => handleModal("modalMasterDealerNeq", true),
    },
  ];

  const handlePage = async (value) => {
    await setPaging((prevState) => ({
      ...prevState,
      currentPage: value,
    }));
    await refetch();
  };

  return (
    <div>
      <Card>
        <ModalMasterDealerNeq />
        <div className="grid grid-cols-12 gap-5">
          {/* <div className="col-span-12 lg:col-span-3">
            <Select
              placeholder="Pilih Status"
              label={"Status"}
              options={[
                { label: "Semua", value: "all" },
                { label: "Active", value: "Active" },
                { label: "Non-Active", value: "Non-Active" },
              ]}
              value={selectStatus}
              onChange={(value) => setSelectStatus(value)}
            />
          </div> */}
          <div className="col-span-12">
            <div className="grid grid-cols-2 lg:grid-cols-12 gap-5">
              <div className="col-span-2">
                <Button
                  text="ADD NEW"
                  className="bg-slate-800 text-white hover:bg-slate-950 w-full"
                  onClick={() => handleModal("modalMasterDealerNeq", true)}
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
                  onChange={(e) => handleSelectPageSize(e.target.value)}
                />
                <p>entries</p>
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
                  <Dropdown
                    classMenuItems="left-0 w-[140px] top-[110%] "
                    label={
                      <span className="text-xl text-center block w-full">
                        <Icons icon="heroicons-outline:dots-vertical" />
                      </span>
                    }
                  >
                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                      {actions.map((action, i) => (
                        <Menu.Item key={i} onClick={() => action.onClick(item)}>
                          <div
                            className={`
                
                  ${
                    action.name === "delete"
                      ? "bg-danger-500 text-danger-500 bg-opacity-30   hover:bg-opacity-100 hover:text-white"
                      : "hover:bg-slate-900 hover:text-white dark:hover:bg-slate-600 dark:hover:bg-opacity-50"
                  }
                   w-full border-b border-b-gray-500 border-opacity-10 px-4 py-2 text-sm  last:mb-0 cursor-pointer 
                   first:rounded-t last:rounded-b flex  space-x-2 actions-center rtl:space-x-reverse `}
                          >
                            <span className="text-base">
                              <Icons icon={action.icon} />
                            </span>
                            <span>{action.name}</span>
                          </div>
                        </Menu.Item>
                      ))}
                    </div>
                  </Dropdown>
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
    title: "Dealer",
    key: "dealer.dealer_name",
  },
  {
    title: "Name",
    key: "dealer_neq_name",
  },
  {
    title: "Address",
    key: "dealer_neq_address",
  },
  {
    title: "Action",
    key: "action",
  },
];

export default DealerNeq;
