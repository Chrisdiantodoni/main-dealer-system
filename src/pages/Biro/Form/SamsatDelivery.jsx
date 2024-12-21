import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Checkbox from "@/components/ui/Checkbox";
import Pagination from "@/components/ui/Pagination";
import Search from "@/components/ui/Search";
import SelectComponent from "@/components/ui/Select/Select";
import Table from "@/pages/table/Table";
import queryStrings from "query-string";
import queryString from "@/utils/queryString";
import dayjs from "dayjs";
import { dayJsFormatDate, dayjsFormatDateTime } from "@/utils/dayjs";
import { useMutation, useQuery } from "react-query";
import biro from "@/services/API/biro";
import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import Swal from "sweetalert2";
import { SweetAlert } from "@/utils/Swal";
import { useNavigate } from "react-router-dom";
import { formatRupiah } from "../../../utils/formatter";

const FakturDelivery = () => {
  const { biro_name, biro_id, samsat_dev_id } = queryStrings.parse(
    location.search
  );
  const [selectedSpk, setSelectedSpk] = useState([]);
  const [dateSamsatDev, setDateSamsatDev] = useState(null);
  const [search, setSearch] = useState("");
  const debouncedSearchValue = useDebounce(search, 500);
  const [addedData, setAddedData] = useState([]);
  const [paging, setPaging] = useState({
    currentPage: 1,
    totalPage: 1,
  });

  const getDetail = async () => {
    try {
      const response = await biro.getSamsatDeliveryDetail(samsat_dev_id);
      setAddedData(
        response?.data?.samsat_dev_unit?.map((item) => ({
          ...item,
          is_delete: false,
        }))
      );
      setDateSamsatDev(response?.data);
      return response;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (samsat_dev_id) {
      getDetail();
    }
  }, [samsat_dev_id]);

  const date = () => {
    if (samsat_dev_id) {
      return dateSamsatDev?.created_at;
    } else {
      return dayjs();
    }
  };

  const resultQueryString = queryString.stringified({
    q: debouncedSearchValue,
    limit: 10,
    page: paging.currentPage,
    is_samsat_dev: false,
  });

  const { isLoading, data, refetch } = useQuery({
    queryKey: ["getDealerReceiveUnit", debouncedSearchValue],
    queryFn: async () => {
      const response = await biro.getListDealerReceiveUnit(resultQueryString);
      return response;
    },
    onSuccess: (res) => {
      setPaging((state) => ({
        ...state,
        totalPage: res?.data?.last_page,
        currentPage: res?.data?.current_page,
      }));
    },
  });

  // useEffect(() => {
  //   setPaging((prevState) => ({
  //     ...prevState,
  //     currentPage: 1,
  //   }));
  //   refetch();
  // }, [debouncedSearchValue]);

  const handleSearch = async (value) => {
    await setSearch(value);
    await setPaging((prevState) => ({
      ...prevState,
      currentPage: 1,
    }));
    // await refetch();
  };

  const handleSelectPage = async (e) => {
    await setPaging((prev) => ({
      ...prev,
      currentPage: e,
    }));
    await refetch();
  };

  const handleAddSpk = (items) => {
    const spkData = items
      ?.filter(
        (item) =>
          !addedData.some(
            (addedItem) =>
              addedItem.dealer_receive_unit_id === item.dealer_receive_unit_id
          )
      )
      ?.map((item) => ({
        ...item,
        is_delete: false,
      }));
    setAddedData((prev) => [...prev, ...spkData]);
    setSelectedSpk([]);
  };

  const handleDeleteSamsatDeliverySpk = (item) => {
    if (item?.samsat_dev_unit_id) {
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
          let addedSpks = addedData?.map((data) => {
            if (data?.samsat_dev_unit_id === item?.samsat_dev_unit_id) {
              return {
                ...data,
                is_delete: !item.is_delete,
              };
            } else {
              return data;
            }
          });
          setAddedData(addedSpks);
        }
      });
    } else {
      setAddedData((prevState) =>
        prevState.filter(
          (filter) =>
            filter?.dealer_receive_unit_id !== item?.dealer_receive_unit_id
        )
      );
    }
  };

  const navigate = useNavigate();

  const { mutate: createSamsatDev, isLoading: isLoadingSamsatDev } =
    useMutation({
      mutationFn: async () => {
        const body = {
          biro_id,
          samsat_dev_unit: addedData
            ?.filter((filter) => filter?.is_delete === false)
            ?.map((item) => ({
              dealer_receive_unit_id: item.dealer_receive_unit_id,
              samsat_dev_unit_id: item?.samsat_dev_unit_id,
              bbn: item.bbn,
              note: item.note ? item.note : "-",
              dealer_id: item?.dealer_id || item?.dealer_receive?.dealer_id,
            })),
        };
        if (samsat_dev_id) {
          const response = await biro.updateSamsatDelivery(samsat_dev_id, body);
          return response;
        }
        const response = await biro.createSamsatDelivery(body);
        return response;
      },
      onSuccess: (res) => {
        if (res?.meta?.code === 200) {
          SweetAlert("success", "Berhasil", "Sukses");
          if (samsat_dev_id) {
            navigate(`/biro/samsat-delivery/${samsat_dev_id}`);
          } else {
            navigate(
              `/biro/samsat-delivery/${res?.data?.samsat_dev?.samsat_dev_id}`
            );
          }
        } else {
          SweetAlert("error", "Gagal", "Gagal");
        }
      },
    });

  console.log({ addedData });

  const handleClear = () => {
    // Map over addedData to mark items with samsat_dev_unit_id for deletion
    let clearedData = addedData
      ?.map((item) => {
        if (item?.samsat_dev_unit_id) {
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
      <Card title={`Samsat Delivery`}>
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
                <p className="text-base font-semibold text-slate-800">Biro</p>
              </div>
              <div className="col-span-12 lg:col-span-9 flex items-center gap-2">
                <p className="hidden lg:block">:</p>
                <p className="text-base font-normal text-slate-800">
                  {biro_name}
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
              data={data?.data?.data?.map((item, index) => ({
                ...item,
                no: (
                  <div className="flex items-center gap-1">
                    {!addedData?.some(
                      (some) =>
                        some?.dealer_receive_unit_id ===
                        item?.dealer_receive_unit_id
                    ) && (
                      <Checkbox
                        value={selectedSpk?.some(
                          (some) =>
                            some?.dealer_receive_unit_id ===
                            item?.dealer_receive_unit_id
                        )}
                        onChange={() => {
                          const isSelected = selectedSpk?.some(
                            (some) =>
                              some?.dealer_receive_unit_id ===
                              item?.dealer_receive_unit_id
                          );
                          if (isSelected) {
                            setSelectedSpk(
                              selectedSpk?.filter(
                                (filter) =>
                                  filter?.dealer_receive_unit_id !==
                                  item?.dealer_receive_unit_id
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
                tanggal: <span>{dayJsFormatDate(item?.created_at)}</span>,
                bbn: <span>{formatRupiah(item?.bbn)}</span>,
              }))}
            />
          </div>
          <div className="col-span-12">
            <Pagination
              currentPage={data?.data?.current_page}
              totalPages={paging?.totalPage}
              currentPageItems={data?.data.data.length}
              totalItems={data?.data?.total}
              handlePageChange={handleSelectPage}
            />
          </div>
          <div className="col-span-2 mt-8 lg:flex gap-x-2">
            <Button
              text={"CANCEL"}
              className="btn-outline-dark py-1"
              link="/biro/samsat-delivery"
            />
            <Button
              disabled={selectedSpk?.length === 0}
              text={"ADD"}
              className={`btn-dark py-1 transition-opacity w-full lg:w-auto ${
                selectedSpk?.length > 0 ? "opacity-100" : "opacity-30"
              }`}
              onClick={() => handleAddSpk(selectedSpk)}
            />
          </div>
        </div>
      </Card>

      <Card title={"Added SPK"}>
        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-12">
            <Table
              headers={headersAddedSPK}
              data={addedData?.map((item, index) => ({
                ...item,
                no: <span>{index + 1}</span>,
                tanggal: <span>{dayJsFormatDate(item.created_at)}</span>,
                spk_number: (
                  <span>
                    {item?.spk_number || item?.dealer_receive_unit?.spk_number}
                  </span>
                ),
                note: (
                  <span>{item?.note || item?.dealer_receive_unit?.note}</span>
                ),
                no_faktur_unit: (
                  <span>
                    {item?.no_faktur_unit ||
                      item?.dealer_receive_unit?.no_faktur_unit}
                  </span>
                ),
                name_legal: (
                  <span>
                    {item?.name_legal || item?.dealer_receive_unit?.name_legal}
                  </span>
                ),
                no_hp: (
                  <span>{item?.no_hp || item?.dealer_receive_unit?.no_hp}</span>
                ),
                frame_number: (
                  <span>
                    {item?.frame_number ||
                      item?.dealer_receive_unit?.frame_number}
                  </span>
                ),
                engine_number: (
                  <span>
                    {item?.engine_number ||
                      item?.dealer_receive_unit?.engine_number}
                  </span>
                ),
                bbn: (
                  <span>
                    {formatRupiah(item?.bbn || item?.dealer_receive_unit?.bbn)}
                  </span>
                ),
                action: item?.is_delete ? (
                  <Button
                    icon={"heroicons:x-mark"}
                    className="btn-success w-auto p-2 rounded-full"
                    onClick={() => handleDeleteSamsatDeliverySpk(item)}
                  />
                ) : (
                  <Button
                    icon={"mdi:trash"}
                    className="btn-danger w-auto p-2 rounded-full"
                    onClick={() => handleDeleteSamsatDeliverySpk(item)}
                  />
                ),
              }))}
            />
          </div>
          <div className="col-span-2 mt-8 lg:flex gap-x-2">
            <Button
              disabled={addedData?.length === 0}
              text={"CLEAR"}
              className={`btn-outline-dark py-1 w-full lg:w-auto ${
                addedData?.length > 0 ? "opacity-100" : "opacity-30"
              }`}
              onClick={handleClear}
            />
            <Button
              disabled={addedData?.length === 0}
              text={samsat_dev_id ? "EDIT" : "CREATE"}
              className={`btn-dark py-1 w-full lg:w-auto ${
                addedData?.length > 0 ? "opacity-100" : "opacity-30"
              }`}
              isLoading={isLoadingSamsatDev}
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
                    createSamsatDev();
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

const headersLog = [
  { title: "NO", key: "no" },
  { title: "USERNAME", key: "no" },
  { title: "AKSI", key: "no" },
];

const headersSPK = [
  { title: "NO", key: "no" },
  { title: "TANGGAL", key: "tanggal" },
  { title: "NO. SPK", key: "spk_number" },
  { title: "No. FAKTUR", key: "no_faktur_unit" },
  { title: "NAMA STNK", key: "name_legal" },
  { title: "No. HP", key: "no_hp" },
  { title: "No. Rangka", key: "frame_number" },
  { title: "No. Mesin", key: "engine_number" },
  { title: "BIAYA BBN", key: "bbn" },
  { title: "CATATAN", key: "note" },
];

const headersAddedSPK = [
  { title: "NO", key: "no" },
  { title: "TANGGAL", key: "tanggal" },
  { title: "NO. SPK", key: "spk_number" },
  { title: "No. FAKTUR", key: "no_faktur_unit" },
  { title: "NAMA STNK", key: "name_legal" },
  { title: "No. HP", key: "no_hp" },
  { title: "No. Rangka", key: "frame_number" },
  { title: "No. Mesin", key: "engine_number" },
  { title: "BIAYA BBN", key: "bbn" },
  { title: "CATATAN", key: "note" },
  { title: "AKSI", key: "action" }, // Assuming "AKSI" means "action"
];

export default FakturDelivery;
