import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Checkbox from "@/components/ui/Checkbox";
import Icons from "@/components/ui/Icon";
import Pagination from "@/components/ui/Pagination";
import Search from "@/components/ui/Search";
import SelectComponent from "@/components/ui/Select/Select";
import { useDebounce } from "@/hooks/useDebounce";
import Table from "@/pages/table/Table";
import biro from "@/services/API/biro";
import { dayJsFormatDate } from "@/utils/dayjs";
import { SweetAlert } from "@/utils/Swal";
import dayjs from "dayjs";
import queryStrings from "query-string";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const FakturDelivery = () => {
  const { dealer_id, dealer_name, dealer_code, faktur_delivery_id } =
    queryStrings.parse(location.search);
  const [fakturReceive, setFakturReceive] = useState([]);
  const [search, setSearch] = useState("");
  const debouncedSearchValue = useDebounce(search, 500);
  const [selectedSpk, setSelectedSpk] = useState([]);
  const [addedSpk, setAddedSpk] = useState([]);
  const [paging, setPaging] = useState({
    currentPage: 1,
    totalPage: 1,
  });

  console.log({ paging });
  const resultQueryString = queryStrings.stringify({
    dealer_id: dealer_id,
    faktur_received_status: "received",
    limit: 10,
    page: paging.currentPage,
    q: debouncedSearchValue,
    is_faktur_dev: false,
  });
  const navigate = useNavigate();
  const { refetch, isLoading } = useQuery({
    queryKey: ["getFakturReceiveByDealer", debouncedSearchValue],
    queryFn: async () => {
      const response = await biro.getFakturReceive(resultQueryString);
      return response;
    },
    onSuccess: (res) => {
      if (res?.meta?.code === 200) {
        let faktur_data = res?.data?.data?.filter(
          (filter) => filter?.is_faktur_delivered === 0
        );

        // if (!faktur_delivery_id) {
        //   if (faktur_data?.length === 0) {
        //     SweetAlert("warning", "Data Dealer tidak ditemukan", "Perhatian");
        //     navigate("/biro/faktur-delivery");
        //     return;
        //   }
        // }
        setFakturReceive(res?.data);
        setPaging((state) => ({
          ...state,
          totalPage: res?.data?.last_page,
          currentPage: res?.data?.current_page,
        }));
      }
    },
  });

  const now = dayjs();

  // const { isLoading: isLoadingGetFakturDelivery } = useQuery({
  //   queryKey: ["getFakturDeliveryById"],
  //   queryFn: async () => {
  //     const response = await biro.getFakturDeliveredDetail(faktur_delivery_id);
  //     return response;
  //   },
  //   onSuccess: (res) => {
  //     if (res?.meta?.code == 200) {
  //       console.log("jalan-jalan");
  //     }
  //   },
  // });

  const getFakturDeliveredDetail = async () => {
    await biro
      .getFakturDeliveredDetail(faktur_delivery_id)
      .then((res) => {
        if (res?.meta?.code === 200) {
          const spkData = res?.data?.faktur_delivered_unit?.map((item) => ({
            ...item,
            is_delete: false,
            spk_number: item?.faktur_received?.spk_number,
            no_faktur_unit: item?.faktur_received?.no_faktur_unit,
            name_legal: item?.faktur_received?.name_legal,
            no_hp: item?.faktur_received?.no_hp,
            number_frame: item?.faktur_received?.number_frame,
            number_engine: item?.faktur_received?.number_engine,
          }));
          setAddedSpk(spkData);
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (faktur_delivery_id) {
      getFakturDeliveredDetail();
      // console.log("HAHAHAHA");
    }
  }, [faktur_delivery_id]);

  const headersSPK = [
    { title: "NO", key: "no" },
    { title: "NO. SPK", key: "spk_number" },
    { title: "No. FAKTUR", key: "no_faktur_unit" },
    { title: "NAMA STNK", key: "name_legal" },
    { title: "No. HP", key: "no_hp" },
    { title: "No. Rangka", key: "number_frame" },
    { title: "No. Mesin", key: "number_engine" },
  ];

  const handleSearch = async (value) => {
    await setSearch(value);
    await setPaging((prevState) => ({
      ...prevState,
      currentPage: 1,
    }));
    // await refetch();
  };

  useEffect(() => {}, [debouncedSearchValue]);

  const handleSelectPage = async (e) => {
    await setPaging((prev) => ({
      ...prev,
      currentPage: e,
    }));
    await refetch();
  };

  const handleAddedSpk = (items) => {
    const newSpk = items
      .filter(
        (item) =>
          !addedSpk.some(
            (addedItem) =>
              addedItem.faktur_received_id === item.faktur_received_id
          )
      )
      .map((item) => ({
        ...item,
        is_delete: false,
      }));

    setAddedSpk((prevState) => [...prevState, ...newSpk]);
    setSelectedSpk([]);
  };

  const { mutate: createFakturDelivery, isLoading: isLoadingFakturDelivery } =
    useMutation({
      mutationFn: async () => {
        const body = {
          dealer_id: dealer_id,
          dealer_code: dealer_code,
          faktur_delivered_unit: addedSpk
            ?.filter((item) => !item?.is_delete) // Filter out items with is_delete set to true
            ?.map((item) => ({
              faktur_delivered_unit_id: item?.faktur_delivered_unit_id,
              faktur_received_id: item?.faktur_received_id,
            })),
        };
        if (faktur_delivery_id) {
          const response = await biro.updateFakturDelivered(
            faktur_delivery_id,
            body
          );
          return response;
        }
        const response = await biro.createFakturDelivery(body);
        return response;
      },
      onSuccess: (res) => {
        if (res?.meta?.code === 200) {
          SweetAlert("success", "Berhasil", "Sukses");
          if (faktur_delivery_id) {
            navigate(`/biro/faktur-delivery/${faktur_delivery_id}`);
          } else {
            navigate(
              `/biro/faktur-delivery/${res?.data?.faktur_delivered?.faktur_delivered_id}`
            );
          }
        } else {
          SweetAlert("error", "Gagal", "Gagal");
        }
      },
    });

  const handleDeleteFakturDeliveredSpk = (item) => {
    if (faktur_delivery_id) {
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
          let addedSpks = addedSpk?.map((faktur) => {
            if (faktur?.faktur_received_id === item?.faktur_received_id) {
              return {
                ...faktur,
                is_delete: !item.is_delete,
              };
            } else {
              return faktur;
            }
          });
          setAddedSpk(addedSpks);
        }
      });
    } else {
      setAddedSpk((prevState) =>
        prevState.filter(
          (filter) => filter?.faktur_received_id !== item?.faktur_received_id
        )
      );
    }
  };

  const handleClear = () => {
    // Map over addedData to mark items with samsat_dev_unit_id for deletion
    let clearedData = addedData
      ?.map((item) => {
        if (item?.faktur_received_id) {
          return {
            ...item,
            is_delete: true,
          };
        } else {
          // Keep items without samsat_dev_unit_id as they are
          return item;
        }
      })
      // Filter out items that do not have is_delete set to true
      .filter((item) => item.is_delete);

    setAddedData(clearedData);
  };

  return (
    <div className="space-y-5">
      <Card title={`Faktur Delivery`}>
        <div className="grid lg:grid-cols-2 grid-cols-1 gap-3">
          <div className="col-span-1">
            <div className="grid grid-cols-12 gap-5">
              <div className="col-span-12 lg:col-span-3">
                <p className="text-base font-semibold text-slate-800">
                  Tanggal
                </p>
              </div>
              <div className="col-span-12 lg:col-span-9 flex items-center gap-2">
                <p className="hidden lg:block">:</p>
                <p className="text-base font-normal text-slate-800">
                  {dayJsFormatDate(now.toISOString())}
                </p>
              </div>
              <div className="col-span-12 lg:col-span-3">
                <p className="text-base font-semibold text-slate-800">Dealer</p>
              </div>
              <div className="col-span-12 lg:col-span-9 flex items-center gap-2">
                <p className="hidden lg:block">:</p>
                <p className="text-base font-normal text-slate-800">
                  {dealer_name}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
      <Card
        title={"List SPK"}
        headerslot={
          <div className="w-[300px]">
            <Search value={search} onChange={(value) => handleSearch(value)} />
          </div>
        }
      >
        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-12">
            <Table
              headers={headersSPK}
              isLoading={isLoading}
              data={fakturReceive?.data?.map((item, index) => ({
                ...item,
                no: (
                  <div className="flex items-center gap-1">
                    {!addedSpk?.some(
                      (some) =>
                        some?.faktur_received_id === item?.faktur_received_id
                    ) && (
                      <Checkbox
                        value={selectedSpk?.some(
                          (some) =>
                            some?.faktur_received_id ===
                            item?.faktur_received_id
                        )}
                        onChange={() => {
                          const isSelected = selectedSpk?.some(
                            (some) =>
                              some?.faktur_received_id ===
                              item?.faktur_received_id
                          );
                          if (isSelected) {
                            setSelectedSpk(
                              selectedSpk?.filter(
                                (filter) =>
                                  filter?.faktur_received_id !==
                                  item?.faktur_received_id
                              )
                            );
                          } else {
                            setSelectedSpk([...selectedSpk, item]);
                          }
                        }}
                      />
                    )}
                    <span>
                      {(paging.currentPage - 1) * parseInt(10) + index + 1}
                    </span>
                  </div>
                ),
              }))}
            />
          </div>
          <div className="col-span-12">
            <Pagination
              currentPage={fakturReceive?.current_page}
              totalPages={paging?.totalPage}
              currentPageItems={
                fakturReceive.data?.filter(
                  (filter) => filter?.is_faktur_delivered === 0
                ).length
              }
              totalItems={fakturReceive?.total}
              handlePageChange={handleSelectPage}
            />
          </div>
          <div className="col-span-12 mt-8 lg:flex gap-x-2 space-y-2 lg:space-y-0">
            <Button
              text={"CANCEL"}
              className="btn-outline-dark py-1 w-full lg:w-auto"
              link="/biro/faktur-delivery"
            />
            <Button
              disabled={selectedSpk?.length === 0}
              text={"ADD"}
              className={`btn-dark py-1 transition-opacity w-full lg:w-auto ${
                selectedSpk?.length > 0 ? "opacity-100" : "opacity-30"
              }`}
              onClick={() => handleAddedSpk(selectedSpk)}
            />
          </div>
        </div>
      </Card>

      <Card title={"Added SPK"}>
        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-12">
            <Table
              headers={headersAddedSPK}
              data={addedSpk?.map((item, index) => ({
                ...item,
                no: <span>{index + 1}</span>,
                action: item?.is_delete ? (
                  <Button
                    icon={"heroicons:x-mark"}
                    className="btn-success w-auto p-2 rounded-full"
                    onClick={() => handleDeleteFakturDeliveredSpk(item)}
                  />
                ) : (
                  <Button
                    icon={"mdi:trash"}
                    className="btn-danger w-auto p-2 rounded-full"
                    onClick={() => handleDeleteFakturDeliveredSpk(item)}
                  />
                ),
              }))}
            />
          </div>
          <div className="col-span-12 mt-8 lg:flex gap-x-2 space-y-2 lg:space-y-0">
            <Button
              disabled={addedSpk?.length === 0}
              text={"CLEAR"}
              className={`btn-outline-dark py-1 w-full lg:w-auto ${
                addedSpk?.length > 0 ? "opacity-100" : "opacity-30"
              }`}
              onClick={handleClear}
            />
            <Button
              disabled={addedSpk?.length === 0}
              text={faktur_delivery_id ? "EDIT" : "CREATE"}
              className={`btn-dark py-1 w-full lg:w-auto ${
                addedSpk?.length > 0 ? "opacity-100" : "opacity-30"
              }`}
              isLoading={isLoadingFakturDelivery}
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
                    createFakturDelivery();
                  }
                });
              }}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

const headersAddedSPK = [
  { title: "NO", key: "no" },
  { title: "NO. SPK", key: "spk_number" },
  { title: "No. FAKTUR", key: "no_faktur_unit" },
  { title: "NAMA STNK", key: "name_legal" },
  { title: "No. HP", key: "no_hp" },
  { title: "No. Rangka", key: "number_frame" },
  { title: "No. Mesin", key: "number_engine" },
  { title: "AKSI", key: "action" },
];

export default FakturDelivery;
