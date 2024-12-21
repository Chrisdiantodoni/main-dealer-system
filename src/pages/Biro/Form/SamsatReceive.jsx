import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Checkbox from "@/components/ui/Checkbox";
import Pagination from "@/components/ui/Pagination";
import Search from "@/components/ui/Search";
import SelectComponent from "@/components/ui/Select/Select";
import Textinput from "@/components/ui/Textinput";
import Table from "@/pages/table/Table";
import { useEffect, useState } from "react";
import queryStrings from "query-string";
import queryString from "@/utils/queryString";
import { dayJsFormatDate } from "@/utils/dayjs";
import dayjs from "dayjs";
import { useDebounce } from "@/hooks/useDebounce";
import { useMutation, useQuery } from "react-query";
import biro from "@/services/API/biro";
import { formatRupiah } from "@/utils/formatter";
import { SweetAlert } from "@/utils/Swal";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

const SamsatReceive = () => {
  const { biro_name, biro_id, samsat_receive_id } = queryStrings.parse(
    location.search
  );
  const ITEMS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const debouncedSearchValue = useDebounce(search, 500);
  const [dateSamsatReceive, setDateSamsatReceive] = useState(null);
  const [errors, setErrors] = useState({
    stnk: false,
    no_plat: false,
    bpkb: false,
    // Add more fields as needed
  });
  const setFieldError = (field, hasError) => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: hasError,
    }));
  };

  const getDetail = async () => {
    try {
      const response = await biro.getSamsatReceiveDetail(samsat_receive_id);
      const dataSamsatReceive = response?.data;
      setAddedSpk(
        response?.data?.samsat_receive_unit?.map((item) => ({
          ...item,
          samsat_receive_unit_id: item?.samsat_receive_unit_id,
          is_delete: false,
          validate_stnk: item?.stnk ?? "", // Initialize stnk if not set
          validate_plat: item?.plat ?? "", // Initialize plat if not set
          validate_bpkb: item?.bpkb ?? "", // Initialize bpkb if not set,
          // is_edit: true,
          can_edit_stnk:
            item?.samsat_dev_unit?.number_receive_stnk ===
            dataSamsatReceive?.samsat_receive_number
              ? false
              : item?.samsat_dev_unit?.number_receive_stnk === null
              ? false
              : true,
          can_edit_bpkb:
            item?.samsat_dev_unit?.number_receive_bpkb ===
            dataSamsatReceive?.samsat_receive_number
              ? false
              : item?.samsat_dev_unit?.number_receive_bpkb === null
              ? false
              : true,
          can_edit_plat:
            item?.samsat_dev_unit?.number_receive_plat ===
            dataSamsatReceive?.samsat_receive_number
              ? false
              : item?.samsat_dev_unit?.number_receive_plat === null
              ? false
              : true,
          can_submit: item?.plat || item?.bpkb || item?.stnk ? true : false,
        }))
      );
      setDateSamsatReceive(response?.data);
      return response;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (samsat_receive_id) {
      getDetail();
    }
  }, [samsat_receive_id]);

  const date = () => {
    if (samsat_receive_id) {
      return dateSamsatReceive?.created_at;
    } else {
      return dayjs();
    }
  };
  const [selectedSpk, setSelectedSpk] = useState([]);
  const [addedSpk, setAddedSpk] = useState([]);
  const [paging, setPaging] = useState({
    currentPage: 1,
    totalPage: 1,
  });
  const [dataSPK, setDataSPK] = useState([]);

  const onAddSpk = () => {
    const newAddedSpk = selectedSpk.map((spk) => ({
      ...spk,
      is_added: true,
      stnk: spk.receive_number?.stnk ?? "", // Initialize stnk if not set
      plat: spk.receive_number?.plat ?? "", // Initialize plat if not set
      bpkb: spk.receive_number?.bpkb ?? "", // Initialize bpkb if not set,
      validate_stnk: spk.receive_number?.stnk ?? "", // Initialize stnk if not set
      validate_plat: spk.receive_number?.plat ?? "", // Initialize plat if not set
      validate_bpkb: spk.receive_number?.bpkb ?? "", // Initialize bpkb if not set,
      is_delete: false,
      can_submit: false,
      error_submit: false,
      is_have_stnk: spk.receive_number?.stnk ?? "", // Initialize stnk if not set
      is_have_plat: spk.receive_number?.plat ?? "", // Initialize plat if not set
      is_have_bpkb: spk.receive_number?.bpkb ?? "", // Initialize bpkb if not set,
    }));
    setAddedSpk((prevState) => [...prevState, ...newAddedSpk]);

    // setDataSPK(
    //   dataSPK?.data?.map((spk) =>
    //     selectedSpk.some(
    //       (selected) => selected.samsat_dev_unit_id === spk.samsat_dev_unit_id
    //     )
    //       ? { ...spk, is_added: true }
    //       : spk
    //   )
    // );
    setSelectedSpk([]);
  };

  const handleChangeAddedSpk = (index, field, value, id) => {
    const specialCharacterPattern = /[!@#$%^&*(),.?":{}|<>]/g;

    // Initialize an object for errors
    const newErrors = { ...errors };

    // Check for special characters or "-" and update the error state for the specific field
    if (value === "-" || specialCharacterPattern.test(value)) {
      if (!newErrors[id]) {
        newErrors[id] = {}; // Initialize if the id does not exist
      }
      newErrors[id][field] = true; // Set the error for the specific field
    } else {
      if (newErrors[id]) {
        newErrors[id][field] = false; // Clear the error for the specific field and id
      }
    }

    // Update the errors state
    setErrors(newErrors);

    // Update the state for addedSpk if there are no errors for the field
    if (!newErrors[id] || !newErrors[id][field]) {
      setAddedSpk((prevData) => {
        // Create a copy of the previous data
        const newData = [...prevData];

        // Update the specific item at the given index
        if (newData[index]) {
          newData[index][field] = value;
        }

        // Check and update can_submit separately for each type (stnk, plat, bpkb)
        const updatedData = newData.map((item, idx) => {
          if (idx === index) {
            if (field === "stnk") {
              return {
                ...item,
                can_submit_stnk: !!item.stnk,
                error_submit: false,
                // can_submit_plat: !!item.plat ? true : false,
                // can_submit_bpkb: !!item.bpkb ? true : false,
              };
            } else if (field === "plat") {
              return {
                ...item,
                can_submit_plat: !!item.plat,
                error_submit: false,
                // can_submit_stnk: !!item.stnk ? true : false,
                // can_submit_bpkb: !!item.bpkb ? true : false,
              };
            } else if (field === "bpkb") {
              return {
                ...item,
                can_submit_bpkb: !!item.bpkb,
                error_submit: false,
              };
            }
          }
          return item;
        });

        return updatedData;
      });
    }
  };

  const resultQueryString = queryString.stringified({
    q: debouncedSearchValue,
    limit: 10,
    page: paging.currentPage,
    biro_id: biro_id,
    is_samsat_receive: 0,
    is_create_samsat_receive: 0,
  });

  const { isLoading, refetch } = useQuery({
    queryKey: ["getSamsatDeliveredUnit"],
    queryFn: async () => {
      const response = await biro.getSamsatReceiveUnit(resultQueryString);
      return response;
    },
    onSuccess: (res) => {
      if (res.meta.code === 200) {
        setDataSPK(res?.data);
        setPaging((state) => ({
          ...state,
          totalPage: res?.data?.last_page,
          currentPage: res?.data?.current_page,
        }));
      }
    },
  });

  const filteredSpkData = dataSPK.filter((item) => {
    const searchTerm = search.toLowerCase();
    return (
      item?.dealer_receive_unit?.spk_number
        ?.toLowerCase()
        .includes(searchTerm) ||
      item?.dealer_receive_unit?.no_faktur_unit
        .toLowerCase()
        .includes(searchTerm) ||
      item?.dealer_receive_unit?.name_legal
        .toLowerCase()
        .includes(searchTerm) ||
      item?.dealer_receive_unit?.no_hp.toLowerCase().includes(searchTerm) ||
      item?.dealer_receive_unit?.frame_number
        .toLowerCase()
        .includes(searchTerm) ||
      item?.dealer_receive_unit?.engine_number
        .toLowerCase()
        .includes(searchTerm) ||
      item?.receive_number?.bpkb?.toLowerCase().includes(searchTerm) ||
      item?.receive_number?.stnk?.toLowerCase().includes(searchTerm) ||
      item?.receive_number?.no_plat?.toLowerCase().includes(searchTerm)
    );
  });
  const paginatedSpkData = filteredSpkData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(filteredSpkData.length / ITEMS_PER_PAGE);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearch = (e) => {
    setSearch(e);
    setCurrentPage(1); // Reset to the first page on new search
  };

  const navigate = useNavigate();

  const { isLoading: loadingSamsatReceive, mutate } = useMutation({
    mutationFn: async () => {
      let body = {
        biro_id,
        samsat_receive_unit: addedSpk?.map((item) => ({
          samsat_dev_unit_id: item?.samsat_dev_unit_id,
          samsat_receive_unit_id: item?.samsat_receive_unit_id,
          stnk:
            item?.samsat_dev_unit?.number_receive_stnk ||
            item?.number_receive_stnk ||
            item?.receive_number?.stnk
              ? ""
              : item?.stnk,
          plat:
            item?.number_receive_plat ||
            item?.samsat_dev_unit?.number_receive_plat ||
            item?.receive_number?.plat
              ? ""
              : item?.plat,

          bpkb:
            item?.samsat_dev_unit?.number_receive_bpkb ||
            item?.number_receive_bpkb ||
            item?.receive_number?.bpkb
              ? ""
              : item?.bpkb,
          is_delete: item?.is_delete,
        })),
      };

      if (samsat_receive_id) {
        return await biro.updateSamsatReceive(samsat_receive_id, body);
      }
      const response = await biro.createSamsatReceive(body);
      console.log({ body });
      return response;
    },
    onSuccess: (res) => {
      if (res?.meta?.code === 200) {
        SweetAlert("success", "Berhasil", "Sukses");
        if (samsat_receive_id) {
          navigate(`/biro/samsat-receive/${samsat_receive_id}`);
        } else {
          navigate(
            `/biro/samsat-receive/${res?.data?.samsat_receive?.samsat_receive_id}`
          );
        }
      } else {
        SweetAlert("error", "Gagal", "Gagal");
      }
    },
  });

  console.log({ addedSpk });

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

  console.log({ dataSPK });

  const handleDeleteSamsatReceiveUnit = (item) => {
    if (item?.samsat_receive_unit_id) {
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
            if (data?.samsat_receive_unit_id === item?.samsat_receive_unit_id) {
              return {
                ...data,
                is_delete: !data.is_delete,
              };
            } else {
              return { ...data };
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
        if (item?.samsat_receive_unit_id) {
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
  const findValue = (type, id) => {
    // Temukan data awal berdasarkan samsat_dev_unit_id
    let initialData = dataSPK?.find((find) => find.samsat_dev_unit_id === id);

    if (type === "stnk") {
      return initialData?.receive_number?.stnk;
    } else if (type === "bpkb") {
      return initialData?.receive_number?.bpkb;
    } else {
      return initialData?.receive_number?.plat;
    }
  };

  const disablingInput = (id, receiveDocs, samsat_receive_unit_id, type) => {
    const newDataSpk = dataSPK
      ?.filter((filter) => filter.samsat_dev_unit_id === id)
      ?.map((item) => ({
        receive_number: item.receive_number,
        samsat_dev_unit_id: item?.samsat_dev_unit_id,
      }));

    const isObjectSamsatDevUnit = newDataSpk?.find(
      (find) => find.samsat_dev_unit_id === id
    );

    console.log({ isObjectSamsatDevUnit });

    if (type === "stnk") {
      if (
        isObjectSamsatDevUnit?.receive_number?.samsat_receive_unit_id_stnk ===
          samsat_receive_unit_id ||
        isObjectSamsatDevUnit?.receive_number?.samsat_receive_unit_id_stnk ===
          null
      ) {
        return false;
      } else {
        return true;
      }
    }
    if (type === "plat") {
      if (
        isObjectSamsatDevUnit?.receive_number?.samsat_receive_unit_id_plat ===
          samsat_receive_unit_id ||
        isObjectSamsatDevUnit?.receive_number?.samsat_receive_unit_id_plat ===
          null
      ) {
        return false;
      } else {
        return true;
      }
    }
    if (type === "bpkb") {
      if (
        isObjectSamsatDevUnit?.receive_number?.samsat_receive_unit_id_bpkb ===
          samsat_receive_unit_id ||
        isObjectSamsatDevUnit?.receive_number?.samsat_receive_unit_id_bpkb ===
          null
      ) {
        return false;
      } else {
        return true;
      }
    }

    // let docs = receiveDocs ?? "-";
    // const initialData = dataSPK?.data?.find(
    //   (find) => find.samsat_dev_unit_id === id
    // );
    // // Here you might want to check for the presence of samsat_receive_unit_id

    // const receiveNumberValues = Object.values({
    //   ...(initialData?.receive_number || {}),
    //   // You can add other key-value pairs here if needed
    // });

    // // Replace null values with empty strings
    // const cleanedValues = receiveNumberValues.map((value) =>
    //   value === null ? "-" : value
    // );

    // // Check if receiveDocs is present in the cleaned values
    // const isValueFound = cleanedValues.some((item) => item === docs);

    // console.log(receiveNumberValues, docs);

    // return !isValueFound;
    // return hasDifferentSamsatReceiveId;
  };

  return (
    <div className="space-y-5">
      <Card title={`Samsat Receive`}>
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
                  {dayJsFormatDate(date())}{" "}
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
              data={paginatedSpkData
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
                              some?.samsat_dev_unit_id ===
                              item?.samsat_dev_unit_id
                          )}
                          onChange={() => {
                            const isSelectedSpk = selectedSpk?.some(
                              (some) =>
                                some?.samsat_dev_unit_id ===
                                item?.samsat_dev_unit_id
                            );
                            if (isSelectedSpk) {
                              const filteredSpk = selectedSpk.filter(
                                (filter) =>
                                  filter?.samsat_dev_unit_id !==
                                  item?.samsat_dev_unit_id
                              );
                              setSelectedSpk(filteredSpk);
                            } else {
                              setSelectedSpk([...selectedSpk, item]);
                            }
                          }}
                        />
                      )}

                      <span>
                        {index + 1}
                        {/* {(paging.currentPage - 1) * parseInt(10) + index + 1} */}
                      </span>
                    </div>
                  ),
                  tanggal: <span>{dayJsFormatDate(item?.created_at)}</span>,
                  bbn: <span>{formatRupiah(item?.bbn)}</span>,
                  no_plat: <span>{item?.receive_number?.plat || "-"}</span>,
                  bpkb: <span>{item?.receive_number?.bpkb || "-"}</span>,
                  stnk: <span>{item?.receive_number?.stnk || "-"}</span>,
                }))}
            />
          </div>
          <div className="col-span-12">
            {/* <Pagination
              currentPage={dataSPK?.current_page}
              totalPages={paging?.totalPage}
              currentPageItems={dataSPK?.data?.length}
              totalItems={dataSPK?.total}
              handlePageChange={handleSelectPage}
            /> */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              handlePageChange={handlePageChange}
              currentPageItems={paginatedSpkData.length}
              totalItems={dataSPK?.length}
            />
          </div>
          <div className="col-span-2 mt-8 lg:flex gap-x-2">
            <Button
              text={"CANCEL"}
              className="btn-outline-dark py-1"
              link="/biro/samsat-receive"
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
              data={addedSpk?.map((item, index) => ({
                ...item,
                no: <span>{index + 1}</span>,
                tanggal: <span>{dayJsFormatDate(item?.created_at)}</span>,
                bbn: (
                  <span>
                    {formatRupiah(item?.samsat_dev_unit?.bbn || item?.bbn)}
                  </span>
                ),
                no_spk: (
                  <span>
                    {item?.samsat_dev_unit?.dealer_receive_unit?.spk_number ||
                      item?.dealer_receive_unit?.spk_number}
                  </span>
                ),
                no_faktur: (
                  <span>
                    {item?.samsat_dev_unit?.dealer_receive_unit
                      ?.no_faktur_unit ||
                      item?.dealer_receive_unit?.no_faktur_unit}
                  </span>
                ),
                no_hp: (
                  <span>
                    {item?.samsat_dev_unit?.dealer_receive_unit?.no_hp ||
                      item?.dealer_receive_unit?.no_hp}
                  </span>
                ),
                nama_stnk: (
                  <span>
                    {item?.samsat_dev_unit?.dealer_receive_unit?.name_legal ||
                      item?.dealer_receive_unit?.name_legal}
                  </span>
                ),
                no_rangka: (
                  <span>
                    {item?.samsat_dev_unit?.dealer_receive_unit?.frame_number ||
                      item?.dealer_receive_unit?.frame_number}
                  </span>
                ),
                no_mesin: (
                  <span>
                    {item?.samsat_dev_unit?.dealer_receive_unit
                      ?.engine_number ||
                      item?.dealer_receive_unit?.engine_number}
                  </span>
                ),
                // stnk: (
                //   <div className="flex">
                //     <input value={item.stnk} />
                //   </div>
                // ),
                stnk: (
                  <div className="flex">
                    <Textinput
                      disabled={
                        disablingInput(
                          item?.samsat_dev_unit_id,
                          item?.validate_stnk,
                          item?.samsat_receive_unit_id,
                          "stnk"
                        ) ||
                        item?.is_have_stnk ||
                        item?.can_edit_stnk
                      }
                      placeholder="STNK"
                      error={
                        errors[item?.samsat_dev_unit_id]?.["stnk"] ||
                        errors.stnk ||
                        item?.error_submit
                      }
                      className="w-40"
                      value={
                        item?.stnk === ""
                          ? ""
                          : item?.stnk ||
                            item?.samsat_dev_unit?.stnk ||
                            findValue("stnk", item?.samsat_dev_unit_id)
                      }
                      onChange={(e) =>
                        handleChangeAddedSpk(
                          index,
                          "stnk",
                          e.target.value,
                          item?.samsat_dev_unit_id
                        )
                      }
                    />
                  </div>
                ),
                plat: (
                  <div className="flex">
                    <Textinput
                      disabled={
                        disablingInput(
                          item?.samsat_dev_unit_id,
                          item?.validate_plat,
                          item?.samsat_receive_unit_id,
                          "plat"
                        ) ||
                        item?.is_have_plat ||
                        item?.can_edit_plat
                      }
                      placeholder="No. Plat"
                      error={
                        errors[item?.samsat_dev_unit_id]?.["no_plat"] ||
                        errors.no_plat ||
                        item?.error_submit
                      }
                      className="w-40"
                      value={
                        item?.plat === ""
                          ? ""
                          : item?.plat ||
                            item?.samsat_dev_unit?.no_plat ||
                            findValue("plat", item?.samsat_dev_unit_id)
                      }
                      onChange={(e) =>
                        handleChangeAddedSpk(
                          index,
                          "plat",
                          e.target.value,
                          item?.samsat_dev_unit_id
                        )
                      }
                    />
                  </div>
                ),
                bpkb: (
                  <div className="flex">
                    <Textinput
                      disabled={
                        disablingInput(
                          item?.samsat_dev_unit_id,
                          item?.validate_bpkb,
                          item?.samsat_receive_unit_id,
                          "bpkb"
                        ) ||
                        item?.is_have_bpkb ||
                        item?.can_edit_bpkb
                      }
                      placeholder="BPKB"
                      error={
                        errors[item?.samsat_dev_unit_id]?.["bpkb"] ||
                        errors.bpkb ||
                        item?.error_submit
                      }
                      className="w-40"
                      value={
                        item?.bpkb === ""
                          ? ""
                          : item?.bpkb ||
                            item?.samsat_dev_unit?.bpkb ||
                            findValue("bpkb", item?.samsat_dev_unit_id)
                      }
                      onChange={(e) =>
                        handleChangeAddedSpk(
                          index,
                          "bpkb",
                          e.target.value,
                          item?.samsat_dev_unit_id
                        )
                      }
                    />
                  </div>
                ),
                action: (
                  <div className="flex gap-x-2 justify-center items-center">
                    {item?.is_delete ? (
                      <Button
                        icon={"heroicons:x-mark"}
                        className="btn-success w-auto p-2 rounded-full"
                        onClick={() => handleDeleteSamsatReceiveUnit(item)}
                      />
                    ) : (
                      <Button
                        icon={"mdi:trash"}
                        className="btn-danger w-auto p-2 rounded-full"
                        onClick={() => handleDeleteSamsatReceiveUnit(item)}
                      />
                    )}
                  </div>
                ),
              }))}
            />
          </div>
          <div className="col-span-2 mt-8 lg:flex gap-x-2">
            <Button
              text={"CLEAR"}
              className="btn-outline-dark py-1"
              onClick={handleClear}
            />
            <Button
              disabled={addedSpk?.length === 0}
              text={samsat_receive_id ? "EDIT" : "CREATE"}
              className={`btn-dark py-1 w-full lg:w-auto ${
                addedSpk?.length > 0 ? "opacity-100" : "opacity-30"
              }`}
              isLoading={loadingSamsatReceive}
              onClick={() => {
                let checkValidation = addedSpk?.some((some) => {
                  if (!samsat_receive_id) {
                    return (
                      !some?.is_delete &&
                      !some?.can_submit_stnk &&
                      !some?.can_submit_plat &&
                      !some?.can_submit_bpkb
                    );
                  } else if (!some?.samsat_receive_unit_id) {
                    return (
                      !some?.is_delete &&
                      !some?.can_submit_stnk &&
                      !some?.can_submit_plat &&
                      !some?.can_submit_bpkb
                    );
                  } else if (some?.is_delete) {
                    return false;
                  }
                  return !some?.stnk && !some?.plat && !some?.bpkb;
                });

                if (checkValidation) {
                  let data = addedSpk?.map((item) => {
                    if (item?.is_delete) {
                      return item; // Skip if is_delete is true
                    }

                    if (!samsat_receive_id) {
                      if (
                        !item?.can_submit_stnk &&
                        !item?.can_submit_plat &&
                        !item?.can_submit_bpkb
                      ) {
                        return { ...item, error_submit: true };
                      }
                    } else if (!item?.samsat_receive_unit_id) {
                      return { ...item, error_submit: true };
                    } else {
                      // console.log("jalan");
                      if (!item?.stnk && !item?.plat && !item?.bpkb) {
                        return { ...item, error_submit: true };
                      } else {
                        return item;
                      }
                    }

                    return item;
                  });

                  toast.error("Input tidak boleh kosong.");
                  setAddedSpk(data);
                  return;

                  // return setErrors((prev) => ({
                  //   ...prev,
                  //   stnk: true,
                  //   bpkb: true,
                  //   no_plat: true,
                  // }));
                }
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

const headersLog = [
  { title: "NO", key: "no" },
  { title: "USERNAME", key: "no" },
  { title: "AKSI", key: "no" },
];

const headersSPK = [
  { title: "NO", key: "no" },
  // { title: "TANGGAL", key: "tanggal" },
  { title: "NO. SPK", key: "dealer_receive_unit.spk_number" },
  { title: "No. FAKTUR", key: "dealer_receive_unit.no_faktur_unit" },
  { title: "NAMA STNK", key: "dealer_receive_unit.name_legal" },
  { title: "No. HP", key: "dealer_receive_unit.no_hp" },
  { title: "No. Rangka", key: "dealer_receive_unit.frame_number" },
  { title: "No. Mesin", key: "dealer_receive_unit.engine_number" },
  // { title: "BIAYA BBN", key: "bbn" },
  { title: "PLAT", key: "no_plat" },
  { title: "STNK", key: "stnk" },
  { title: "BPKB", key: "bpkb" },
];

const headersAddedSPK = [
  { title: "NO", key: "no" },
  // { title: "TANGGAL", key: "tanggal" },
  { title: "NO. SPK", key: "no_spk" },
  {
    title: "No. FAKTUR",
    key: "no_faktur",
  },
  { title: "NAMA STNK", key: "nama_stnk" },
  { title: "No. HP", key: "no_hp" },
  {
    title: "No. Rangka",
    key: "no_rangka",
  },
  {
    title: "No. Mesin",
    key: "no_mesin",
  },
  // { title: "BIAYA BBN", key: "bbn" },
  { title: "PLAT", key: "plat" },
  { title: "STNK", key: "stnk" },
  { title: "BPKB", key: "bpkb" },
  { title: "AKSI", key: "action" }, // Assuming "AKSI" means "action"
];

export default SamsatReceive;
