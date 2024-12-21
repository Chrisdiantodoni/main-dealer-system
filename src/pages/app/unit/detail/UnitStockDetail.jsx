import Loading from "@/components/Loading";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Table from "@/pages/table/Table";
import unit from "@/services/API/unit";
import {
  dayJsFormatDate,
  dayjsFormatDateTime,
  dayjsFormatInputDate,
} from "@/utils/dayjs";
import { SweetAlert } from "@/utils/Swal";
import { useMutation, useQuery } from "react-query";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";

const UnitStockDetail = () => {
  const { id } = useParams();

  const { data, isFetching, refetch } = useQuery({
    queryKey: ["getDetailStockById"],
    queryFn: async () => {
      const response = await unit.getDetailUnit(id);
      return response;
    },
  });

  const dataStock = data?.data;

  const { mutate, isLoading } = useMutation({
    mutationFn: async () => {
      const response = await unit.returUnitMds(id);
      return response;
    },
    onSuccess: (res) => {
      if (res?.meta?.code === 200) {
        SweetAlert("success", `Retur Unit Created Successfully `, "Success");
        refetch();
      } else {
        SweetAlert("error", `Failed to retur`, "error");
      }
    },
    onError: (res) => {
      SweetAlert("error", res?.data, "error");
    },
  });

  const { mutate: updateToSPK, isLoading: loadingUpdateToSPK } = useMutation({
    mutationFn: async () => {
      const response = await unit.changeUnitToSPK(id);
      return response;
    },
    onSuccess: (res) => {
      if (res?.meta?.code === 200) {
        SweetAlert("success", res?.data, "Success");
        refetch();
      } else {
        SweetAlert("error", `Failed to update`, "error");
      }
    },
    onError: (res) => {
      SweetAlert("error", res?.data, "error");
    },
  });

  return isFetching ? (
    <Loading />
  ) : (
    <div className="space-y-4">
      <Card title={`Unit Detail`}>
        <div className="grid grid-cols-12 gap-5">
          <div className="col-span-12 lg:col-span-3">
            <p className="detail-label">Status</p>
          </div>
          <div className="col-span-12 lg:col-span-9 items-center gap-2 flex">
            <p className="hidden lg:block">:</p>
            <p className="detail-value">{dataStock?.unit_status}</p>
          </div>
          <div className="col-span-12 lg:col-span-3">
            <p className="detail-label">Tanggal Shipping</p>
          </div>
          <div className="col-span-12 lg:col-span-9 items-center gap-2 flex">
            <p className="hidden lg:block">:</p>
            <p className="detail-value">
              {dayJsFormatDate(
                dataStock?.shipping_order?.shipping_order_shipping_date
              )}
            </p>
          </div>
          <div className="col-span-12 lg:col-span-3">
            <p className="detail-label">Nomor Delivery</p>
          </div>
          <div className="col-span-12 lg:col-span-9 items-center gap-2 flex">
            <p className="hidden lg:block">:</p>
            <p className="detail-value">
              {dataStock?.shipping_order?.shipping_order_number}
            </p>
          </div>
          <div className="col-span-12 lg:col-span-3">
            <p className="detail-label">Tipe Motor</p>
          </div>
          <div className="col-span-12 lg:col-span-9 items-center gap-2 flex">
            <p className="hidden lg:block">:</p>
            <p className="detail-value">{dataStock?.motor?.motor_name}</p>
          </div>
          <div className="col-span-12 lg:col-span-3">
            <p className="detail-label">No. Rangka</p>
          </div>
          <div className="col-span-12 lg:col-span-9 items-center gap-2 flex">
            <p className="hidden lg:block">:</p>
            <p className="detail-value">{dataStock?.unit_frame}</p>
          </div>
          <div className="col-span-12 lg:col-span-3">
            <p className="detail-label">No. Mesin</p>
          </div>
          <div className="col-span-12 lg:col-span-9 items-center gap-2 flex">
            <p className="hidden lg:block">:</p>
            <p className="detail-value">{dataStock?.unit_engine}</p>
          </div>
          <div className="col-span-12 lg:col-span-3">
            <p className="detail-label">Warna</p>
          </div>
          <div className="col-span-12 lg:col-span-9 items-center gap-2 flex">
            <p className="hidden lg:block">:</p>
            <p className="detail-value">{dataStock?.unit_color}</p>
          </div>
          <div className="col-span-12 lg:col-span-3">
            <p className="detail-label">Dealer</p>
          </div>
          <div className="col-span-12 lg:col-span-9 items-center gap-2 flex">
            <p className="hidden lg:block">:</p>
            <p className="detail-value">
              {dataStock?.shipping_order?.dealer?.dealer_name}
            </p>
          </div>
          <div className="col-span-12 ">
            {dataStock?.shipping_order?.dealer?.dealer_type === "mds" &&
              dataStock?.unit_status === "on_hand" && (
                <Button
                  className="btn-success py-2 px-4 w-full lg:w-auto lg:mr-2"
                  text={"RETUR"}
                  isLoading={isLoading}
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
                        //  onUpdateRejectReturUnit();
                      }
                    });
                  }}
                />
              )}
            {/* {(dataStock?.unit_status === "on_hand" ||
              dataStock?.unit_status === "delivered") && (
              <Button
                className="btn-warning py-2 px-4 w-full lg:w-auto"
                text={"CHANGE TO SPK"}
                isLoading={loadingUpdateToSPK}
                onClick={() => {
                
                }}
              />
            )} */}
          </div>
        </div>
      </Card>
      <Card title={"History Unit"}>
        <Table
          data={dataStock?.unit_logs?.map((item, index) => ({
            ...item,
            no: <span>{index + 1}</span>,
            date: <span>{dayjsFormatDateTime(item?.created_at)}</span>,
          }))}
          headers={headersUnit}
        />
      </Card>
    </div>
  );
};

const headersUnit = [
  { title: "NO.", key: "no" },
  { title: "Tanggal", key: "date" },
  { title: "Description", key: "unit_log_action" },
];

export default UnitStockDetail;
