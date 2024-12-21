import Loading from "@/components/Loading";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Pagination from "@/components/ui/Pagination";
import Search from "@/components/ui/Search";
import SelectComponent from "@/components/ui/Select/Select";
import Table from "@/pages/table/Table";
import biro from "@/services/API/biro";
import { dayJsFormatDate, dayjsFormatDateTime } from "@/utils/dayjs";
import { useState } from "react";
import { useMutation, useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { formatRupiah } from "../../../utils/formatter";
import { SweetAlert } from "@/utils/Swal";
import Swal from "sweetalert2";

const DeliveryDealer = () => {
  const { id } = useParams();
  const ITEMS_PER_PAGE = 10;
  const [deliveryDealer, setDeliveryDealer] = useState({});
  const [spkData, setSpkData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchSpk, setSearchSpk] = useState("");

  const { isLoading, refetch } = useQuery({
    queryKey: ["getDeliveryDealerById"],
    queryFn: async () => {
      const response = await biro.getDetailDeliveryDealer(id);
      return response;
    },
    onSuccess: (res) => {
      if (res?.meta?.code === 200) {
        setDeliveryDealer(res?.data);
        setSpkData(res?.data?.delivery_dealer_unit);
      }
    },
  });

  const headersSPK = [
    { title: "NO", key: "no" },
    { title: "NO. SPK", key: "samsat_dev_unit.dealer_receive_unit.spk_number" },
    {
      title: "No. FAKTUR",
      key: "samsat_dev_unit.dealer_receive_unit.no_faktur_unit",
    },
    {
      title: "NAMA STNK",
      key: "samsat_dev_unit.dealer_receive_unit.name_legal",
    },
    { title: "No. HP", key: "samsat_dev_unit.dealer_receive_unit.no_hp" },
    {
      title: "No. Rangka",
      key: "samsat_dev_unit.dealer_receive_unit.frame_number",
    },
    {
      title: "No. Mesin",
      key: "samsat_dev_unit.dealer_receive_unit.engine_number",
    },
    {
      title: "Biaya",
      key: "bbn",
    },
    { title: deliveryDealer?.type_document, key: "document_type" },
  ];

  function documentType(item) {
    let document;
    if (deliveryDealer?.type_document === "stnk") {
      document = item?.stnk;
    } else if (deliveryDealer?.type_document === "bpkb") {
      document = item?.bpkb;
    } else {
      document = item?.no_plat;
    }
    return document;
  }
  const filteredSpkData = spkData.filter((item) => {
    const searchTerm = searchSpk.toLowerCase();
    return (
      item?.samsat_dev_unit?.dealer_receive_unit.spk_number
        .toLowerCase()
        .includes(searchTerm) ||
      item?.samsat_dev_unit?.dealer_receive_unit.no_faktur_unit
        .toLowerCase()
        .includes(searchTerm) ||
      item?.samsat_dev_unit?.dealer_receive_unit.name_legal
        .toLowerCase()
        .includes(searchTerm) ||
      item?.samsat_dev_unit?.dealer_receive_unit.no_hp
        .toLowerCase()
        .includes(searchTerm) ||
      item?.samsat_dev_unit?.dealer_receive_unit.frame_number
        .toLowerCase()
        .includes(searchTerm) ||
      item?.samsat_dev_unit?.dealer_receive_unit.engine_number
        .toLowerCase()
        .includes(searchTerm)
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
    setSearchSpk(e);
    setCurrentPage(1);
  };

  const navigate = useNavigate();

  const { mutate: confirmDevDealer, isLoading: loadingConfirm } = useMutation({
    mutationFn: async () => {
      const response = await biro.confirmDeliveryDealer(id);
      return response;
    },
    onSuccess: (res) => {
      if (res?.meta?.code === 200) {
        SweetAlert("success", "Berhasil", "Sukses");
        refetch();
      } else {
        SweetAlert("error", "Gagal", "Gagal");
      }
    },
    onError: (res) => {
      console.log(res);
      SweetAlert("error", "Gagal", "Gagal");
    },
  });

  const {
    mutate: deleteDeliveryDealer,
    isLoading: loadingDeleteDeliveryDealer,
  } = useMutation({
    mutationFn: async () => {
      const response = await biro.deleteDeliveryDealer(id);
      return response;
    },
    onSuccess: (res) => {
      if (res?.meta?.code === 200) {
        SweetAlert("success", "Berhasil", "Sukses");
        navigate("/biro/delivery-dealer");
      } else {
        SweetAlert("error", "Gagal", "Gagal");
      }
    },
    onError: (res) => {
      console.log(res);
      SweetAlert("error", "Gagal", "Gagal");
    },
  });

  const [loading, setLoading] = useState(false);
  const handlePrintDeliveryDealer = async (id) => {
    try {
      setLoading(true);
      const pdfData = await biro.getPdfDeliveryDealer(id);
      const pdfObjectUrl = URL.createObjectURL(pdfData);
      setLoading(false);
      window.open(pdfObjectUrl, "_blank"); // Open PDF in a new tab
    } catch (error) {
      setLoading(false);
      console.error("Error generating PDF:", error);
    }
  };

  return isLoading ? (
    <Loading />
  ) : (
    <div className="space-y-5">
      <Card
        title={`Delivery Detail - ${deliveryDealer?.deliver_dealer_number}`}
      >
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
                  {dayJsFormatDate(deliveryDealer?.created_at)}
                </p>
              </div>
              <div className="col-span-12 lg:col-span-3">
                <p className="text-base font-semibold text-slate-800">
                  No. Tanda Terima
                </p>
              </div>
              <div className="col-span-12 lg:col-span-9 flex items-center gap-2">
                <p className="hidden lg:block">:</p>
                <p className="text-base font-normal text-slate-800">
                  {deliveryDealer?.deliver_dealer_number}
                </p>
              </div>
              <div className="col-span-12 lg:col-span-3">
                <p className="text-base font-semibold text-slate-800">Dealer</p>
              </div>
              <div className="col-span-12 lg:col-span-9 flex items-center gap-2">
                <p className="hidden lg:block">:</p>
                <p className="text-base font-normal text-slate-800">
                  {deliveryDealer?.dealer?.dealer_name}
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
                  {deliveryDealer?.type_document}
                </p>
              </div>
              <div className="col-span-12 lg:col-span-3">
                <p className="text-base font-semibold text-slate-800">
                  Jumlah Berkas
                </p>
              </div>
              <div className="col-span-12 lg:col-span-9 flex items-center gap-2">
                <p className="hidden lg:block">:</p>
                <p className="text-base font-normal text-slate-800">
                  {deliveryDealer?.delivery_dealer_unit_total}
                </p>
              </div>
              <div className="col-span-12 lg:col-span-3">
                <p className="text-base font-semibold text-slate-800">Status</p>
              </div>
              <div className="col-span-12 lg:col-span-9 flex items-center gap-2">
                <p className="hidden lg:block">:</p>
                <p className="text-base font-normal text-slate-800">
                  {deliveryDealer?.delivery_dealer_status}
                </p>
              </div>
            </div>
          </div>
          <div className="col-span-1">
            <Table
              headers={headersLog}
              data={deliveryDealer?.delivery_dealer_log?.map((item) => ({
                ...item,
                tanggal: <span>{dayjsFormatDateTime(item?.created_at)}</span>,
              }))}
            />
          </div>
        </div>
        <div className="col-span-2 mt-8 lg:flex gap-x-2">
          <Button
            text={"BACK"}
            className="btn-outline-dark py-1"
            link="/biro/delivery-dealer"
          />
          {deliveryDealer?.delivery_dealer_status === "create" && (
            <>
              <Button
                text={"EDIT"}
                className="btn-info py-1"
                link={`/biro/delivery-dealer/add?dealer_id=${deliveryDealer?.dealer_id}&dealer_name=${deliveryDealer?.dealer?.dealer_name}&dealer_code=${deliveryDealer?.dealer?.dealer_code}&delivery_dealer_id=${id}&type=${deliveryDealer?.type_document}`}
              />
              <Button
                text={"CONFIRM"}
                className="btn-dark py-1"
                isLoading={loadingConfirm}
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
                      confirmDevDealer();
                    }
                  });
                }}
              />
              <Button
                text={"DELETE"}
                className="btn-danger py-1"
                isLoading={loadingDeleteDeliveryDealer}
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
                      deleteDeliveryDealer();
                    }
                  });
                }}
              />
            </>
          )}
          {deliveryDealer?.delivery_dealer_status === "confirm" && (
            <Button
              text={"PRINT"}
              className="btn-warning py-1"
              isLoading={loading}
              onClick={() => handlePrintDeliveryDealer(id)}
            />
          )}
        </div>
      </Card>
      <Card
        title={"List SPK"}
        headerslot={
          <div className="w-[300px]">
            <Search value={searchSpk} onChange={handleSearch} />
          </div>
        }
      >
        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-12">
            <Table
              headers={headersSPK}
              data={paginatedSpkData?.map((item, index) => ({
                ...item,
                no: (currentPage - 1) * ITEMS_PER_PAGE + index + 1,
                bbn: <span>{formatRupiah(item?.samsat_dev_unit?.bbn)}</span>,
                document_type: (
                  <span>{documentType(item?.samsat_dev_unit)}</span>
                ),
              }))}
            />
          </div>
          <div className="col-span-12">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              handlePageChange={handlePageChange}
              currentPageItems={paginatedSpkData.length}
              totalItems={spkData?.length}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

const headersLog = [
  { title: "TGL", key: "tanggal" },
  { title: "USERNAME", key: "user.username" },
  { title: "AKSI", key: "action" },
];

export default DeliveryDealer;
