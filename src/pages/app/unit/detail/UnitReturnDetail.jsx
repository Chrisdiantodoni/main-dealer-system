import Loading from "@/components/Loading";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import createStore from "@/context";
import Table from "@/pages/table/Table";
import unitReturn from "@/services/API/unitReturn";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { dayJsFormatDate } from "../../../../utils/dayjs";
import Checkbox from "@/components/ui/Checkbox";
import { SweetAlert } from "@/utils/Swal";
import Swal from "sweetalert2";

const UnitReturnDetail = () => {
  const setTitle = createStore((state) => state.setTitle);
  const { id } = useParams();

  const [selected, setSelected] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  // const handleSelectedUnit = (isChecked, unit) => {
  //   if (isChecked) {
  //     setSelectedUnit((prevSelected) => [...prevSelected, unit]);
  //   } else {
  //     setSelectedUnit((prevSelected) => prevSelected != unit);
  //   }
  // };

  useEffect(() => {
    setTitle("Detail Retur Unit");
  }, []);

  const { data, isFetching } = useQuery({
    queryKey: ["getReturnDetailById"],
    queryFn: async () => {
      return await unitReturn.getDetailReturUnit(id);
    },
  });

  const dataRetur = data?.data;

  const headersWithCheckbox = [
    {
      title: (
        <div className="flex">
          {dataRetur?.retur_unit_list?.some(
            (unit) => unit.retur_unit_list_status === "request"
          ) && (
            <Checkbox
              value={selectAll}
              onChange={() => {
                setSelectAll(!selectAll);
                if (!selectAll) {
                  setSelected(
                    dataRetur?.retur_unit_list.filter(
                      (filter) => filter.retur_unit_list_status === "request"
                    )
                  );
                } else {
                  setSelected([]);
                }
              }}
            />
          )}
          NO.
        </div>
      ),
      key: "no",
    },
    { title: "TIPE MOTOR", key: "retur_unit_list_motor" },
    { title: "NO. RANGKA", key: "retur_unit_list_frame_number" },
    { title: "NO. MESIN", key: "retur_unit_list_engine_number" },
    { title: "WARNA", key: "retur_unit_list_color" },
    { title: "STATUS", key: "retur_unit_list_status" },
  ];

  const navigate = useNavigate();

  const { mutate: onUpdateReturUnit, isLoading } = useMutation({
    mutationFn: async () => {
      const retur_unit_list = selected.map((item) => ({
        retur_unit_list_status: "approved",
        retur_unit_list_frame_number: item?.retur_unit_list_frame_number,
        shipping_order_delivery_number: item?.shipping_order_delivery_number,
        retur_unit_list_dealer_id: item?.retur_unit_list_dealer_id,
      }));

      const requestBody = {
        retur_unit_list: retur_unit_list,
      };
      // console.log({ retur_unit });
      // return;
      const response = await unitReturn.updateReturUnitStatus(requestBody);
      return response;
    },
    onSuccess: (res) => {
      console.log({ res });
      if (res?.meta?.code === 200) {
        SweetAlert("success", `Unit Retur Diapprove`, "Sukses");
        navigate("/unit-return");
      } else {
        SweetAlert("error", res?.data, "Error");
      }
    },
    onError: (res) => {
      SweetAlert("error", res?.data, "Error");
    },
  });

  const { mutate: onUpdateRejectReturUnit, isLoading: isLoadingReject } =
    useMutation({
      mutationFn: async () => {
        const retur_unit_list = selected.map((item) => ({
          ...item,
          retur_unit_list_status: "reject",
          retur_unit_list_frame_number: item?.retur_unit_list_frame_number,
          shipping_order_delivery_number: item?.shipping_order_delivery_number,
        }));
        const requestBody = {
          retur_unit_list: retur_unit_list,
        };
        // console.log({ retur_unit });
        // return;
        const response = await unitReturn.updateReturUnitStatus(requestBody);
        return response;
      },
      onSuccess: (res) => {
        if (res?.meta?.code === 200) {
          SweetAlert("success", `Unit Retur Direject`, "Sukses");
          navigate("/unit-return");
        } else {
          SweetAlert("error", res?.data, "Error");
        }
      },
      onError: (res) => {
        SweetAlert("error", res?.data, "Error");
      },
    });

  const handleRequestReject = () => {
    if (selected.length == 0) {
      SweetAlert("warning", "Tidak ada unit yang dipilih", "Perhatian");
      return;
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
        onUpdateRejectReturUnit();
      }
    });
  };

  const handleRequestApprove = () => {
    if (selected.length == 0) {
      SweetAlert("warning", "Tidak ada unit yang dipilih", "Perhatian");
      return;
    }
    Swal.fire({
      title: "Apakah Anda Yakin?",
      icon: "info",
      showCancelButton: true,
      cancelButtonText: "NO",
      confirmButtonText: "YES",
    }).then((result) => {
      if (result.isConfirmed) {
        onUpdateReturUnit();
      }
    });
  };

  return isFetching ? (
    <Loading />
  ) : (
    <div className="space-y-5">
      <Card title={`Detail Retur Unit - ${dataRetur?.dealer_name}`}>
        <div className="grid grid-cols-12 gap-5">
          <div className="col-span-12 lg:col-span-3">
            <p className="text-base font-semibold text-slate-800">
              Status Retur
            </p>
          </div>
          <div className="col-span-12 lg:col-span-9 flex items-center gap-2">
            <p className="hidden lg:block">:</p>
            <p className="text-base font-normal text-slate-800">
              {dataRetur?.retur_unit_status}
            </p>
          </div>
          <div className="col-span-12 lg:col-span-3">
            <p className="text-base font-semibold text-slate-800">
              No. Retur Dealer
            </p>
          </div>
          <div className="col-span-12 lg:col-span-9 flex items-center gap-2">
            <p className="hidden lg:block">:</p>
            <p className="text-base font-normal text-slate-800">
              {dataRetur?.retur_unit_number_dealer}
            </p>
          </div>
          <div className="col-span-12 lg:col-span-3">
            <p className="text-base font-semibold text-slate-800">Tanggal</p>
          </div>
          <div className="col-span-12 lg:col-span-9 flex items-center gap-2">
            <p className="hidden lg:block">:</p>
            <p className="text-base font-normal text-slate-800">
              {dayJsFormatDate(dataRetur?.created_at)}
            </p>
          </div>
          <div className="col-span-12 lg:col-span-3">
            <p className="text-base font-semibold text-slate-800">Retur Ke</p>
          </div>
          <div className="col-span-12 lg:col-span-9 flex items-center gap-2">
            <p className="hidden lg:block">:</p>
            <p className="text-base font-normal text-slate-800">
              {dataRetur?.main_dealer?.main_dealer_name}
            </p>
          </div>
          <div className="col-span-12 lg:col-span-3">
            <p className="text-base font-semibold text-slate-800">Dealer</p>
          </div>
          <div className="col-span-12 lg:col-span-9 flex items-center gap-2">
            <p className="hidden lg:block">:</p>
            <p className="text-base font-normal text-slate-800">
              {dataRetur?.dealer_destination?.dealer_type}
            </p>
          </div>
          <div className="col-span-12 lg:col-span-3">
            <p className="text-base font-semibold text-slate-800">
              Dealer Tujuan
            </p>
          </div>
          <div className="col-span-12 lg:col-span-9 flex items-center gap-2">
            <p className="hidden lg:block">:</p>
            <p className="text-base font-normal text-slate-800">
              {dataRetur?.retur_unit_dealer_destination_name}
            </p>
          </div>
          <div className="col-span-12 lg:col-span-3">
            <p className="text-base font-semibold text-slate-800">
              Alasan Retur
            </p>
          </div>
          <div className="col-span-12 lg:col-span-9 flex items-center gap-2">
            <p className="hidden lg:block">:</p>
            <p className="text-base font-normal text-slate-800">
              {dataRetur?.retur_unit_reason}
            </p>
          </div>
        </div>
      </Card>
      <Card title={"List Unit"}>
        <div className="grid grid-cols-12 gap-5">
          <div className="col-span-12">
            <Table
              isLoading={isFetching}
              checkbox={true}
              data={dataRetur?.retur_unit_list.map((item, index) => ({
                ...item,
                no: (
                  <div className="flex">
                    {item?.retur_unit_list_status === "request" && (
                      <Checkbox
                        name={"selected_unit"}
                        value={selected.includes(item)} // Include entire item object
                        onChange={() => {
                          if (selected.includes(item)) {
                            setSelected(
                              selected.filter(
                                (selectedItem) => selectedItem !== item
                              )
                            );
                          } else {
                            setSelected([...selected, item]);
                          }
                        }}
                      />
                    )}
                    {index + 1}
                  </div>
                ),
              }))}
              headers={headersWithCheckbox}
            />
          </div>
          <div className="col-span-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 lg:flex gap-5">
              {dataRetur?.retur_unit_list?.some(
                (unit) => unit.retur_unit_list_status === "request"
              ) && (
                <>
                  <Button
                    text={"CANCEL"}
                    className="btn-outline-dark py-2"
                    link={`/unit-return`}
                  />
                  <Button
                    text={"APPROVE"}
                    className="btn-success py-2"
                    onClick={() => handleRequestApprove()}
                    isLoading={isLoading}
                  />
                  <Button
                    text={"REJECT"}
                    className="btn-danger py-2"
                    onClick={() => handleRequestReject()}
                    isLoading={isLoadingReject}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

const headers = [{ title: "NO.", key: "no" }];
export default UnitReturnDetail;
