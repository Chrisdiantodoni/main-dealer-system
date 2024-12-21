import Card from "@/components/ui/Card";
import createStore from "@/context";
import Table from "@/pages/table/Table";
import shippingOrder from "@/services/API/shippingOrder";
import { dayJsFormatDate } from "@/utils/dayjs";
import { useEffect } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";

const ShippingOrderDetail = () => {
  const setTitle = createStore((state) => state.setTitle);

  const { id } = useParams();

  useEffect(() => {
    setTitle("Shipping Order Detail");
  }, []);

  const { data, isFetching } = useQuery({
    queryKey: ["getShippingOrderbyId"],
    queryFn: async () => {
      const response = await shippingOrder.detailShippingOrder(id);
      return response;
    },
  });

  const dataShipping = data?.data;

  return (
    <div className="space-y-5">
      <Card
        title={`Shipping Order Detail - ${dataShipping?.dealer?.dealer_name}`}
      >
        <div className="grid grid-cols-12 gap-5">
          <div className="col-span-12 lg:col-span-3">
            <p className="detail-label">Tanggal Shipping</p>
          </div>
          <div className="col-span-12 lg:col-span-9 flex items-center gap-2">
            <p className="hidden lg:block">:</p>
            <p className="detail-value">
              {dayJsFormatDate(dataShipping?.created_at)}
            </p>
          </div>
          <div className="col-span-12 lg:col-span-3">
            <p className="detail-label">Sales Order</p>
          </div>
          <div className="col-span-12 lg:col-span-9 flex items-center gap-2">
            <p className="hidden lg:block">:</p>
            <p className="detail-value">
              {dataShipping?.shipping_order_number}
            </p>
          </div>
          <div className="col-span-12 lg:col-span-3">
            <p className="detail-label">No. Delivery</p>
          </div>
          <div className="col-span-12 lg:col-span-9 flex items-center gap-2">
            <p className="hidden lg:block">:</p>
            <p className="detail-value">
              {dataShipping?.shipping_order_delivery_number}
            </p>
          </div>
          <div className="col-span-12 lg:col-span-3">
            <p className="detail-label">Dealer Tujuan</p>
          </div>
          <div className="col-span-12 lg:col-span-9 flex items-center gap-2">
            <p className="hidden lg:block">:</p>
            <p className="detail-value">{dataShipping?.dealer?.dealer_name}</p>
          </div>
          <div className="col-span-12 lg:col-span-3">
            <p className="detail-label">Jumlah Unit</p>
          </div>
          <div className="col-span-12 lg:col-span-9 flex items-center gap-2">
            <p className="hidden lg:block">:</p>
            <p className="detail-value">{dataShipping?.unit_total}</p>
          </div>
          <div className="col-span-12 lg:col-span-3">
            <p className="detail-label">Jumlah Unit Diterima</p>
          </div>
          <div className="col-span-12 lg:col-span-9 flex items-center gap-2">
            <p className="hidden lg:block">:</p>
            <p className="detail-value">
              {
                dataShipping?.unit?.filter(
                  (filter) => filter?.unit_status === "delivered"
                )?.length
              }
            </p>
          </div>
        </div>
      </Card>
      <Card title={"List Unit"}>
        <div className="grid grid-cols-12 gap-5">
          <div className="col-span-12">
            <Table
              isLoading={isFetching}
              data={dataShipping?.unit.map((item, index) => ({
                ...item,
                no: <div>{index + 1}</div>,
              }))}
              headers={headers}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

const headers = [
  {
    title: "No.",
    key: "no",
  },
  { title: "TIPE MOTOR", key: "motor.motor_name" },
  { title: "NO. RANGKA", key: "unit_frame" },
  { title: "NO. MESIN", key: "unit_engine" },
  { title: "WARNA", key: "unit_color" },
  { title: "STATUS", key: "unit_status" },
];

export default ShippingOrderDetail;
