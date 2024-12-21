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
import ModalMasterDealer from "@/components/Modal/Master/ModalMasterDealer";
import Dropdown from "@/components/ui/Dropdown";
import Icons from "@/components/ui/Icon";
import { Menu } from "@headlessui/react";
import apiKey from "@/services/API/apiKey";
import ModalMasterApiKey from "@/components/Modal/Master/ModalMasterApiKey";
import { Link, useNavigate } from "react-router-dom";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "react-toastify";
import Tooltip from "@/components/ui/Tooltip";
import Badge from "@/components/ui/Badge";

const ApiKey = () => {
  const [selectStatus, setSelectStatus] = useState("all");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dealers, setDealers] = useState([]);
  const { handleModal } = createStore();
  const [visibleKeys, setVisibleKeys] = useState({});
  const [isSuccessCopy, setIsSuccessCopy] = useState(false);

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
    queryKey: ["getApiKeyList", resultQueryString],
    queryFn: async () => {
      const response = await apiKey.getListAPIkey(resultQueryString);
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

  const handlePage = async (value) => {
    setPaging((prevState) => ({
      ...prevState,
      currentPage: value,
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

  const handleSearch = async (e) => {
    await setSelectStatus(e.target.value);
    await setPaging((prevState) => ({
      ...prevState,
      currentPage: 1,
    }));
    await refetch();
  };

  const handleToggleVisibility = (key) => {
    setVisibleKeys((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  const actions = [
    {
      name: "edit",
      icon: "heroicons:pencil-square",
      onClick: (item) => {
        handleModal("modalMasterApiKey", true, item);
      },
    },
    {
      name: "Assign User",
      icon: "heroicons:user",
      onClick: () => handleModal("modalMasterApiKey", true),
    },
  ];

  const navigate = useNavigate();

  //   const handleCopy = (dealer) => {
  //     console.log(dealer);
  //     setCopiedKeys({
  //       copied: true,
  //       value: dealer.api_key_secret,
  //     });
  //     console.log(data);
  //     toast.success("API key copied!");
  //   };

  const handleCopy = (key) => {
    setIsSuccessCopy((prevState) => ({
      ...prevState,
      [key]: true,
    }));
    setTimeout(() => {
      setIsSuccessCopy((prevState) => ({
        ...prevState,
        [key]: false,
      }));
    }, 500);
    toast.success("API key copied");
  };

  return (
    <div>
      <ModalMasterApiKey />
      <Card>
        <div className="grid grid-cols-12 gap-5">
          <div className="col-span-12">
            <div className="grid grid-cols-2 lg:grid-cols-12 gap-5">
              <div className="col-span-2">
                <Button
                  text="ADD NEW"
                  className="bg-slate-800 text-white hover:bg-slate-950 w-full"
                  onClick={() => handleModal("modalMasterApiKey", true)}
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
                  onChange={(value) => setSelectPageSize(value)}
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
              data={data?.data?.data.map((dealer, index) => ({
                ...dealer,
                no: (
                  <span>
                    {(paging.currentPage - 1) * parseInt(selectPageSize) +
                      index +
                      1}
                  </span>
                ),
                api_key_name: (
                  <a
                    target="__blank"
                    href={dealer?.api_key_name}
                    className="btn-link text-primary-500"
                  >
                    {dealer?.api_key_name}
                  </a>
                ),
                api_key_secret: (
                  <div className="flex whitespace-nowrap items-center space-x-1">
                    <span>
                      {visibleKeys[dealer.api_key_secret]
                        ? dealer.api_key_secret
                        : "●●●●●●●●"}
                    </span>
                    <div className="flex items-center">
                      <Button
                        onClick={() =>
                          handleToggleVisibility(dealer.api_key_secret)
                        }
                        className="py-1 pr-0"
                        icon={
                          visibleKeys[dealer.api_key_secret]
                            ? "mdi:eye"
                            : "heroicons:eye-slash"
                        }
                        iconPosition="right"
                      ></Button>
                      <CopyToClipboard
                        text={dealer?.api_key_secret}
                        onCopy={handleCopy}
                      >
                        <Button
                          icon={
                            isSuccessCopy[dealer.api_key_secret]
                              ? "mdi:check"
                              : "material-symbols:content-copy"
                          }
                          text={
                            isSuccessCopy[dealer.api_key_secret]
                              ? "Copied!"
                              : "Copy"
                          }
                          className={"pl-2 font-normal "}
                        />
                      </CopyToClipboard>
                    </div>
                  </div>
                ),
                is_sync: (
                  <Badge
                    className={
                      dealer?.is_sync
                        ? "bg-success-500 text-white"
                        : "bg-danger-500 text-white"
                    }
                    label={dealer.is_sync ? "Synced" : "Not Synced"}
                  ></Badge>
                ),
                dealer: (
                  <span>
                    {dealer?.dealer?.map((item) => (
                      <Badge
                        label={item?.dealer_name}
                        className="bg-slate-700 text-white m-0.5"
                      />
                    ))}
                    {/* {dealer?.dealer
                      ?.map((item) => item?.dealer_name)
                      .join(", ") || "-"} */}
                  </span>
                ),
                is_sync: (
                  <Badge
                    className={
                      dealer?.is_sync
                        ? "bg-success-500 text-white"
                        : "bg-danger-500 text-white"
                    }
                    label={dealer.is_sync ? "Synced" : "Not Synced"}
                  ></Badge>
                ),
                username: <span>{dealer?.user_dealer?.username}</span>,
                action: (
                  <Button
                    text={"Detail"}
                    className="btn-outline-dark py-1"
                    link={`/master-data/api-key/${dealer?.dealer_api_key_secret_id}`}
                  />
                  //   <Dropdown
                  //     classMenuItems="left-0 w-[140px] top-[110%]"
                  //     label={
                  //       <span className="text-xl text-center block w-full">
                  //         <Icons icon="heroicons-outline:dots-vertical" />
                  //       </span>
                  //     }
                  //   >
                  //     <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  //       {actions.map((item, i) => (
                  //         <Menu.Item key={i} onClick={() => item.onClick(dealer)}>
                  //           <div
                  //             className={`

                  //   ${
                  //     item.name === "delete"
                  //       ? "bg-danger-500 text-danger-500 bg-opacity-30   hover:bg-opacity-100 hover:text-white"
                  //       : "hover:bg-slate-900 hover:text-white dark:hover:bg-slate-600 dark:hover:bg-opacity-50"
                  //   }
                  //    w-full border-b border-b-gray-500 border-opacity-10 px-4 py-2 text-sm  last:mb-0 cursor-pointer
                  //    first:rounded-t last:rounded-b flex  space-x-2 items-center rtl:space-x-reverse `}
                  //           >
                  //             <span className="text-base">
                  //               <Icons icon={item.icon} />
                  //             </span>
                  //             <span>{item.name}</span>
                  //           </div>
                  //         </Menu.Item>
                  //       ))}
                  //     </div>
                  //   </Dropdown>
                ),
              }))}
              headers={headers}
            />
          </div>
          <div className="col-span-12">
            <Pagination
              currentPage={paging.currentPage}
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
    title: "URL DEALER",
    key: "api_key_name",
  },
  {
    title: "API KEY",
    key: "api_key_secret",
  },
  {
    title: "Dealer",
    key: "dealer",
  },
  {
    title: "Username",
    key: "username",
  },
  {
    title: "Sync Status",
    key: "is_sync",
  },
  {
    title: "Action",
    key: "action",
  },
];

export default ApiKey;
