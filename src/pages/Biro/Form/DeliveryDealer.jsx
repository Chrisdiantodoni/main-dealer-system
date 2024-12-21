import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Pagination from "@/components/ui/Pagination";
import Search from "@/components/ui/Search";
import SelectComponent from "@/components/ui/Select/Select";
import { useDebounce } from "@/hooks/useDebounce";
import Table from "@/pages/table/Table";
import biro from "@/services/API/biro";
import { dayJsFormatDate } from "@/utils/dayjs";
import dayjs from "dayjs";
import queryStrings from "query-string";
import queryString from "@/utils/queryString";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { formatRupiah } from "@/utils/formatter";
import Checkbox from "@/components/ui/Checkbox";
import Swal from "sweetalert2";
import { SweetAlert } from "@/utils/Swal";
import { useNavigate } from "react-router-dom";

const DeliveryDealer = () => {
  const { dealer_name, dealer_id, type, delivery_dealer_id } =
    queryStrings.parse(location.search);

  const [samsatReceive, setSamsatReceive] = useState([]);
  const [search, setSearch] = useState("");
  const debouncedSearchValue = useDebounce(search, 500);
  const [dateDevDealer, setDateDevDealer] = useState(null);
  const [selectedSpk, setSelectedSpk] = useState([]);
  const [addedSpk, setAddedSpk] = useState([]);
  const [paging, setPaging] = useState({
    currentPage: 1,
    totalPage: 1,
  });
  const headersSPK = [
    { title: "NO", key: "no" },
    { title: "NO. SPK", key: "dealer_receive_unit.spk_number" },
    {
      title: "No. FAKTUR",
      key: "dealer_receive_unit.no_faktur_unit",
    },
    {
      title: "NAMA STNK",
      key: "dealer_receive_unit.name_legal",
    },
    { title: "No. HP", key: "dealer_receive_unit.no_hp" },
    {
      title: "No. Rangka",
      key: "dealer_receive_unit.frame_number",
    },
    {
      title: "No. Mesin",
      key: "dealer_receive_unit.engine_number",
    },
    { title: "BIAYA", key: "bbn" },
    { title: type, key: "document" },
  ];

  const headersAddedSPK = [
    { title: "NO", key: "no" },
    { title: "NO. SPK", key: "dealer_receive_unit.spk_number" },
    {
      title: "No. FAKTUR",
      key: "dealer_receive_unit.no_faktur_unit",
    },
    {
      title: "NAMA STNK",
      key: "dealer_receive_unit.name_legal",
    },
    { title: "No. HP", key: "dealer_receive_unit.no_hp" },
    {
      title: "No. Rangka",
      key: "dealer_receive_unit.frame_number",
    },
    {
      title: "No. Mesin",
      key: "dealer_receive_unit.engine_number",
    },
    { title: "BIAYA", key: "bbn" },
    { title: type, key: "document_type" },
    { title: "AKSI", key: "action" },
  ];

  function documentType(item) {
    let document;
    if (type === "stnk") {
      document = item?.stnk;
    } else if (type === "bpkb") {
      document = item?.bpkb;
    } else {
      document = item?.no_plat;
    }
    return document;
  }
  const getDetail = async () => {
    try {
      const response = await biro.getDetailDeliveryDealer(delivery_dealer_id);
      setAddedSpk(
        response?.data?.delivery_dealer_unit?.map((item) => ({
          ...item,
          is_delete: false,
        }))
      );
      setDateDevDealer(response?.data);
      return response;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (delivery_dealer_id) {
      getDetail();
    }
  }, [delivery_dealer_id]);

  const date = () => {
    if (delivery_dealer_id) {
      return dateDevDealer?.created_at;
    } else {
      return dayjs();
    }
  };

  console.log(dealer_id);

  const resultQueryString = queryString.stringified({
    dealer_id: dealer_id,
    limit: 10,
    document_type:
      type === "plat" || type === "no_plat"
        ? "no_plat"
        : type === "stnk"
        ? "stnk"
        : "bpkb",
    page: paging.currentPage,
    q: debouncedSearchValue,
  });

  const { isLoading, data, refetch } = useQuery({
    queryKey: ["getDeliveryDealer", debouncedSearchValue],
    queryFn: async () => {
      const response = await biro.getDeliveryDealerUnit2(resultQueryString);
      return response;
    },
    onSuccess: (res) => {
      if (res.meta.code === 200) {
        setSamsatReceive(res?.data);
        setPaging((state) => ({
          ...state,
          totalPage: res?.data?.last_page,
          currentPage: res?.data?.current_page,
        }));
      }
    },
  });

  const handleSearch = async (value) => {
    await setSearch(value);
    await setPaging((prevState) => ({
      ...prevState,
      currentPage: 1,
    }));
    // await refetch();
  };

  // useEffect(() => {
  //   setPaging((prevState) => ({
  //     ...prevState,
  //     currentPage: 1,
  //   }));
  //   refetch();
  // }, [debouncedSearchValue]);

  const handleSelectPage = async (e) => {
    await setPaging((prev) => ({
      ...prev,
      currentPage: e,
    }));
    await refetch();
  };

  function document() {
    let document;
    if (type === "no_plat" || type === "plat") {
      document = "PLAT";
    } else {
      document = type;
    }
    return document;
  }

  const onAddSpk = () => {
    const newAddedSpk = selectedSpk.map((spk) => ({
      ...spk,
      is_added: true,
      document_type: documentType(spk), // Initialize stnk if not set
      is_delete: false,
    }));
    setAddedSpk((prevState) => [...prevState, ...newAddedSpk]);
    setSelectedSpk([]);
  };

  const handleDeleteAddedSpk = (item) => {
    if (item?.delivery_dealer_unit_id) {
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
          let addedSpks = addedSpk?.map((data) => {
            if (
              data?.delivery_dealer_unit_id === item?.delivery_dealer_unit_id
            ) {
              return {
                ...data,
                is_delete: !item.is_delete,
              };
            } else {
              return data;
            }
          });
          setAddedSpk(addedSpks);
        }
      });
    } else {
      setAddedSpk((prevState) =>
        prevState.filter(
          (filter) => filter?.samsat_dev_unit_id !== item?.samsat_dev_unit_id
        )
      );
    }
  };

  const handleClear = () => {
    // Map over addedData to mark items with samsat_dev_unit_id for deletion
    let clearedData = addedSpk
      ?.map((item) => {
        if (item?.delivery_dealer_unit_id) {
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

    setAddedSpk(clearedData);
  };
  const navigate = useNavigate();

  const { mutate, isLoading: loadingDeliveryDealer } = useMutation({
    mutationFn: async () => {
      const body = {
        dealer_id,
        type_document: document(), //stnk, plat, bpkb,
        delivery_dealer_unit: addedSpk?.map((item) => ({
          samsat_dev_unit_id: item?.samsat_dev_unit_id,
          delivery_dealer_unit_id: item?.delivery_dealer_unit_id,
          is_delete: item?.is_delete,
        })),
      };
      if (delivery_dealer_id) {
        const response = await biro.updateDeliveryDealer(
          delivery_dealer_id,
          body
        );
        return response;
      }
      const response = await biro.createDeliveryDealer(body);
      return response;
    },
    onSuccess: (res) => {
      if (res?.meta?.code === 200) {
        SweetAlert("success", "Berhasil", "Sukses");
        if (delivery_dealer_id) {
          navigate(`/biro/delivery-dealer/${delivery_dealer_id}`);
        } else {
          navigate(
            `/biro/delivery-dealer/${res?.data?.delivery_dealer?.delivery_dealer_id}`
          );
        }
      } else {
        SweetAlert("error", "Gagal", "Gagal");
      }
    },
  });

  console.log({ addedSpk });

  return (
    <div className="space-y-5">
      <Card title={`Delivery to Dealer`}>
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
                  {dayJsFormatDate(date())}
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
              <div className="col-span-12 lg:col-span-3">
                <p className="text-base font-semibold text-slate-800">
                  Jenis Dokumen
                </p>
              </div>
              <div className="col-span-12 lg:col-span-9 flex items-center gap-2">
                <p className="hidden lg:block">:</p>
                <p className="text-base font-normal text-slate-800 uppercase">
                  {document()}
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
              data={samsatReceive?.data
                ?.map((item) => ({ ...item, is_added: false }))
                ?.filter((filter) => filter.is_added === false)
                ?.map((item, index) => ({
                  ...item,
                  no: (
                    <div className="flex items-center">
                      {!addedSpk?.some(
                        (some) =>
                          some?.samsat_dev_unit_id === item?.samsat_dev_unit_id
                      ) && (
                        <Checkbox
                          name={"select_spk"}
                          value={selectedSpk?.some(
                            (some) =>
                              some.samsat_dev_unit_id ===
                              item.samsat_dev_unit_id
                          )}
                          onChange={() => {
                            const isSelectedSpk = selectedSpk?.some(
                              (some) =>
                                some.samsat_dev_unit_id ===
                                item.samsat_dev_unit_id
                            );
                            if (isSelectedSpk) {
                              const filteredSpk = selectedSpk.filter(
                                (filter) =>
                                  filter?.samsat_dev_unit_id !==
                                  item.samsat_dev_unit_id
                              );
                              setSelectedSpk(filteredSpk);
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
                  tanggal: <span>{dayJsFormatDate(item?.created_at)}</span>,
                  bbn: <span>{formatRupiah(item?.bbn)}</span>,
                  document: <span>{documentType(item)}</span>,
                }))}
            />
          </div>
          <div className="col-span-12">
            <Pagination
              currentPage={samsatReceive?.current_page}
              totalPages={paging?.totalPage}
              currentPageItems={samsatReceive?.data?.length}
              totalItems={samsatReceive?.total}
              handlePageChange={handleSelectPage}
            />
          </div>
          <div className="col-span-2 mt-8 lg:flex gap-x-2">
            <Button
              text={"CANCEL"}
              className="btn-outline-dark py-1"
              link="/biro/delivery-dealer"
            />
            <Button
              disabled={selectedSpk?.length === 0}
              text={"ADD"}
              className={`btn-dark py-1 transition-opacity w-full lg:w-auto ${
                selectedSpk?.length > 0 ? "opacity-100" : "opacity-30"
              }`}
              onClick={() => onAddSpk(selectedSpk)}
            />
          </div>
        </div>
      </Card>

      <Card title={"Added SPK"}>
        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-12">
            <Table
              headers={headersAddedSPK}
              data={(addedSpk || [])?.map((item, index) => ({
                ...(item?.samsat_dev_unit || item),
                no: <span>{index + 1}</span>,
                bbn: (
                  <span>
                    {formatRupiah(item?.bbn || item?.samsat_dev_unit?.bbn)}
                  </span>
                ),
                action: item?.is_delete ? (
                  <Button
                    icon={"heroicons:x-mark"}
                    className="btn-success w-auto p-2 rounded-full"
                    onClick={() => handleDeleteAddedSpk(item)}
                  />
                ) : (
                  <Button
                    icon={"mdi:trash"}
                    className="btn-danger w-auto p-2 rounded-full"
                    onClick={() => handleDeleteAddedSpk(item)}
                  />
                ),
                document_type: documentType(item?.samsat_dev_unit || item),
              }))}
            />
          </div>
          <div className="col-span-2 mt-8 lg:flex gap-x-2">
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
              text={delivery_dealer_id ? "EDIT" : "CREATE"}
              className={`btn-dark py-1 w-full lg:w-auto ${
                addedSpk?.length > 0 ? "opacity-100" : "opacity-30"
              }`}
              isLoading={loadingDeliveryDealer}
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
                    mutate();
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

export default DeliveryDealer;
