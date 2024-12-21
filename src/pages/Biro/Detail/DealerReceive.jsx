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

const DealerReceiveDetail = () => {
  const ITEMS_PER_PAGE = 10;
  const { id } = useParams();
  const [dealerReceive, setDealerReceive] = useState({});
  const [spkData, setSpkData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchSpk, setSearchSpk] = useState("");
  const [loading, setLoading] = useState(false);

  const { isFetching, refetch } = useQuery({
    queryKey: ["getDealerReceiveById"],
    queryFn: async () => {
      const response = await biro.getDetailDealerReceive(id);
      return response;
    },
    onSuccess: (res) => {
      if (res?.meta?.code === 200) {
        setDealerReceive(res?.data);
        setSpkData(res?.data?.dealer_receive_unit);
      }
    },
  });

  const filteredSpkData = spkData.filter((item) => {
    const searchTerm = searchSpk.toLowerCase();
    return (
      item.spk_number.toLowerCase().includes(searchTerm) ||
      item.no_faktur_unit.toLowerCase().includes(searchTerm) ||
      item.name_legal.toLowerCase().includes(searchTerm) ||
      item.no_hp.toLowerCase().includes(searchTerm) ||
      item.frame_number.toLowerCase().includes(searchTerm) ||
      item.engine_number.toLowerCase().includes(searchTerm)
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

  const handlePrintDealerReceive = async (id) => {
    try {
      setLoading(true);
      const pdfData = await biro.getPdfDealerReceive(id);
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
      <Card title={`Dealer Receive - ${dealerReceive?.dealer_receive_number}`}>
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
                  {dayJsFormatDate(dealerReceive?.created_at)}
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
                  {dealerReceive?.dealer_receive_number}
                </p>
              </div>
              <div className="col-span-12 lg:col-span-3">
                <p className="text-base font-semibold text-slate-800">Dealer</p>
              </div>
              <div className="col-span-12 lg:col-span-9 flex items-center gap-2">
                <p className="hidden lg:block">:</p>
                <p className="text-base font-normal text-slate-800">
                  {dealerReceive?.dealer_name}
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
                  {dealerReceive?.dealer_receive_unit?.length}
                </p>
              </div>
            </div>
          </div>
          <div className="col-span-1">
            <Table
              headers={headersLog}
              data={dealerReceive?.dealer_receive_log?.map((item) => ({
                ...item,
                tanggal: <span>{dayjsFormatDateTime(item?.created_at)}</span>,
              }))}
            />
          </div>
          <div className="col-span-2 mt-8 lg:flex gap-x-2 space-x-2 lg:space-x-0 lg:space-y-0 space-y-2">
            <Button
              text={"BACK"}
              className="btn-outline-dark py-1"
              link="/biro/dealer-receive"
            />

            <Button
              text={"PRINT"}
              className="btn-warning py-1"
              isLoading={loading}
              onClick={() => handlePrintDealerReceive(id)}
            />
          </div>
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
  { title: "NO. SPK", key: "spk_number" },
  { title: "No. FAKTUR", key: "no_faktur_unit" },
  { title: "NAMA STNK", key: "name_legal" },
  { title: "No. HP", key: "no_hp" },
  { title: "No. Rangka", key: "frame_number" },
  { title: "No. Mesin", key: "engine_number" },
];

export default DealerReceiveDetail;
