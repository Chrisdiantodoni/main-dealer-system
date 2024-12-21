import Loading from "@/components/Loading";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Pagination from "@/components/ui/Pagination";
import Search from "@/components/ui/Search";
import SelectComponent from "@/components/ui/Select/Select";
import Table from "@/pages/table/Table";
import biro from "@/services/API/biro";
import { dayJsFormatDate, dayjsFormatDateTime } from "@/utils/dayjs";
import { SweetAlert } from "@/utils/Swal";
import { useState } from "react";
import { useMutation, useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

const FakturDeliveryDetail = () => {
  const ITEMS_PER_PAGE = 10;
  const { id } = useParams();
  const [fakturDelivery, setFakturDelivery] = useState({});
  const [spkData, setSpkData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchSpk, setSearchSpk] = useState("");

  const [loading, setLoading] = useState(false);

  const { isFetching, refetch } = useQuery({
    queryKey: ["getFakturDeliveryById"],
    queryFn: async () => {
      const response = await biro.getFakturDeliveredDetail(id);
      return response;
    },
    onSuccess: (res) => {
      if (res?.meta?.code === 200) {
        setFakturDelivery(res?.data);
        setSpkData(res?.data?.faktur_delivered_unit);
      }
    },
  });

  const filteredSpkData = spkData.filter((item) => {
    const searchTerm = searchSpk.toLowerCase();
    return (
      item.faktur_received.spk_number.toLowerCase().includes(searchTerm) ||
      item.faktur_received.no_faktur_unit.toLowerCase().includes(searchTerm) ||
      item.faktur_received.name_legal.toLowerCase().includes(searchTerm) ||
      item.faktur_received.no_hp.toLowerCase().includes(searchTerm) ||
      item.faktur_received.number_frame.toLowerCase().includes(searchTerm) ||
      item.faktur_received.number_engine.toLowerCase().includes(searchTerm)
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
    setCurrentPage(1); // Reset to the first page on new search
  };

  const navigate = useNavigate();

  const { mutate, isLoading: loadingDelete } = useMutation({
    mutationFn: async () => {
      const response = await biro.deleteFakturDelivered(id);
      return response;
    },
    onSuccess: (res) => {
      if (res?.meta?.code === 200) {
        navigate("/biro/faktur-delivery");
        SweetAlert("success", "Faktur Dev Dihapus", "Sukses");
      }
    },
  });

  const { mutate: mutateConfirm, isLoading: loadingConfirm } = useMutation({
    mutationFn: async () => {
      const response = await biro.confirmFakturDelivered(id);
      return response;
    },
    onSuccess: (res) => {
      if (res?.meta?.code === 200) {
        SweetAlert("success", "Faktur Dev Dikirim", "Sukses");
        refetch();
      }
    },
  });

  const handlePrintFakturDelivered = async (id) => {
    try {
      setLoading(true);
      const pdfData = await biro.printFakturDelivered(id);
      const pdfObjectUrl = URL.createObjectURL(pdfData);
      setLoading(false);
      window.open(pdfObjectUrl, "_blank"); // Open PDF in a new tab
    } catch (error) {
      setLoading(false);
      console.error("Error generating PDF:", error);
    }
  };

  return isFetching ? (
    <Loading />
  ) : (
    <div className="space-y-5">
      <Card
        title={`Faktur Delivery - ${fakturDelivery?.faktur_delivered_number}`}
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
                  {dayJsFormatDate(fakturDelivery?.created_at)}
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
                  {fakturDelivery?.faktur_delivered_number}
                </p>
              </div>
              <div className="col-span-12 lg:col-span-3">
                <p className="text-base font-semibold text-slate-800">Dealer</p>
              </div>
              <div className="col-span-12 lg:col-span-9 flex items-center gap-2">
                <p className="hidden lg:block">:</p>
                <p className="text-base font-normal text-slate-800">
                  {fakturDelivery?.dealer?.dealer_name}
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
                  {fakturDelivery?.faktur_delivered_unit?.length}
                </p>
              </div>

              <div className="col-span-12 lg:col-span-3">
                <p className="text-base font-semibold text-slate-800">Status</p>
              </div>
              <div className="col-span-12 lg:col-span-9 flex items-center gap-2">
                <p className="hidden lg:block">:</p>
                <p className="text-base font-normal text-slate-800">
                  {fakturDelivery?.faktur_delivered_status}
                </p>
              </div>
            </div>
          </div>
          <div className="col-span-1">
            <Table
              headers={headersLog}
              data={fakturDelivery?.faktur_delivered_log?.map((item) => ({
                ...item,
                tanggal: <span>{dayjsFormatDateTime(item?.created_at)}</span>,
              }))}
            />
          </div>
        </div>
        <div className="col-span-12 mt-8 lg:flex gap-x-2 space-x-2 lg:space-x-0 lg:space-y-0 space-y-2">
          <Button
            text={"BACK"}
            className="btn-outline-dark py-1"
            link="/biro/faktur-delivery"
          />
          {fakturDelivery?.faktur_delivered_status === "create" && (
            <>
              <Button
                text={"EDIT"}
                className="btn-info py-1"
                link={`/biro/faktur-delivery/add?dealer_id=${fakturDelivery?.dealer_id}&dealer_name=${fakturDelivery?.dealer?.dealer_name}&dealer_code=${fakturDelivery?.dealer?.dealer_code}&faktur_delivery_id=${id}`}
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
                      // mutate();
                      mutateConfirm();
                    }
                  });
                }}
              />
              <Button
                text={"DELETE"}
                isLoading={loadingDelete}
                className="btn-danger py-1"
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
            </>
          )}
          {(fakturDelivery?.faktur_delivered_status === "confirm" ||
            fakturDelivery?.faktur_delivered_status === "received") && (
            <Button
              text={"PRINT"}
              className="btn-warning py-1"
              isLoading={loading}
              onClick={() => handlePrintFakturDelivered(id)}
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
  { title: "TANGGAL", key: "tanggal" },
  { title: "USERNAME", key: "user.username" },
  { title: "AKSI", key: "action" },
];

const headersSPK = [
  { title: "NO", key: "no" },
  { title: "NO. SPK", key: "faktur_received.spk_number" },
  { title: "No. FAKTUR", key: "faktur_received.no_faktur_unit" },
  { title: "NAMA STNK", key: "faktur_received.name_legal" },
  { title: "No. HP", key: "faktur_received.no_hp" },
  { title: "No. Rangka", key: "faktur_received.number_frame" },
  { title: "No. Mesin", key: "faktur_received.number_engine" },
];

export default FakturDeliveryDetail;
