import Loading from "@/components/Loading";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Pagination from "@/components/ui/Pagination";
import Search from "@/components/ui/Search";
import SelectComponent from "@/components/ui/Select/Select";
import Table from "@/pages/table/Table";
import biro from "@/services/API/biro";
import { dayJsFormatDate } from "@/utils/dayjs";
import { formatRupiah } from "@/utils/formatter";
import { SweetAlert } from "@/utils/Swal";
import { useState } from "react";
import { useMutation, useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

const SamsatDeliveryDetail = () => {
  const ITEMS_PER_PAGE = 10;
  const { id } = useParams();
  const [samsatDev, setSamsatDev] = useState({});
  const [spkData, setSpkData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchSpk, setSearchSpk] = useState("");

  const { isLoading, refetch } = useQuery({
    queryKey: ["getSamsatDevDetailById"],
    queryFn: async () => {
      const response = await biro.getSamsatDeliveryDetail(id);
      return response;
    },
    onSuccess: (res) => {
      if (res?.meta?.code === 200) {
        setSamsatDev(res?.data);
        setSpkData(res?.data?.samsat_dev_unit);
      }
    },
  });

  const filteredSpkData = spkData.filter((item) => {
    const searchTerm = searchSpk.toLowerCase();
    return (
      item.dealer_receive_unit.spk_number.toLowerCase().includes(searchTerm) ||
      item.dealer_receive_unit.no_faktur_unit
        .toLowerCase()
        .includes(searchTerm) ||
      item.dealer_receive_unit.name_legal.toLowerCase().includes(searchTerm) ||
      item.dealer_receive_unit.no_hp.toLowerCase().includes(searchTerm) ||
      item.dealer_receive_unit.frame_number
        .toLowerCase()
        .includes(searchTerm) ||
      item.dealer_receive_unit.engine_number.toLowerCase().includes(searchTerm)
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

  const { mutate: updateStatus, isLoading: loadingUpdateStatus } = useMutation({
    mutationFn: async () => {
      const body = {
        samsat_dev_unit: spkData?.map((item) => ({
          samsat_dev_unit_id: item?.samsat_dev_unit_id,
          dealer_receive_unit_id: item?.dealer_receive_unit_id,
          bbn: item.bbn,
          note: item.note,
        })),
      };
      const response = await biro.updateSamsatDeliveryDetail(id, body);
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
  const navigate = useNavigate();

  const { mutate: deleteSamsatDev, isLoading: loadingDeleteSamsatDev } =
    useMutation({
      mutationFn: async () => {
        const response = await biro.deleteSamsatDelivery(id);
        return response;
      },
      onSuccess: (res) => {
        if (res?.meta?.code === 200) {
          SweetAlert("success", "Berhasil", "Sukses");
          navigate("/biro/samsat-delivery");
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

  const handlePrintSamsatDev = async (id) => {
    try {
      setLoading(true);
      const pdfData = await biro.getPdfSamsatDelivery(id);
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
      <Card title={`Samsat Delivery - ${samsatDev?.samsat_dev_number}`}>
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
                  {dayJsFormatDate(samsatDev?.created_at)}
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
                  {samsatDev?.samsat_dev_number}
                </p>
              </div>
              <div className="col-span-12 lg:col-span-3">
                <p className="text-base font-semibold text-slate-800">Biro</p>
              </div>
              <div className="col-span-12 lg:col-span-9 flex items-center gap-2">
                <p className="hidden lg:block">:</p>
                <p className="text-base font-normal text-slate-800">
                  {samsatDev?.biro?.biro_name}
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
                  {samsatDev?.samsat_unit_dev_total}
                </p>
              </div>
              <div className="col-span-12 lg:col-span-3">
                <p className="text-base font-semibold text-slate-800">Status</p>
              </div>
              <div className="col-span-12 lg:col-span-9 flex items-center gap-2">
                <p className="hidden lg:block">:</p>
                <p className="text-base font-normal text-slate-800">
                  {samsatDev?.samsat_dev_status}
                </p>
              </div>
            </div>
          </div>
          <div className="col-span-1">
            <Table
              headers={headersLog}
              data={samsatDev?.samsat_dev_log?.map((item) => ({
                ...item,
                tanggal: dayJsFormatDate(item.created_at),
              }))}
            />
          </div>
        </div>
        <div className="col-span-2 mt-8 lg:flex gap-x-2">
          <Button
            text={"BACK"}
            className="btn-outline-dark py-1"
            link="/biro/samsat-delivery"
          />
          {samsatDev?.samsat_dev_status === "create" ? (
            <>
              <Button
                text={"EDIT"}
                className="btn-info py-1"
                link={`/biro/samsat-delivery/add?biro_name=${samsatDev?.biro?.biro_name}&biro_id=${samsatDev?.biro_id}&samsat_dev_id=${samsatDev?.samsat_dev_id}`}
              />
              <Button
                text={"CONFIRM"}
                className="btn-dark py-1"
                isLoading={loadingUpdateStatus}
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
                      updateStatus();
                    }
                  });
                }}
              />
              <Button
                text={"DELETE"}
                className="btn-danger py-1"
                isLoading={loadingDeleteSamsatDev}
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
                      deleteSamsatDev();
                    }
                  });
                }}
              />
            </>
          ) : (
            <Button
              text={"PRINT"}
              isLoading={loading}
              className="btn-warning py-1"
              onClick={() => handlePrintSamsatDev(id)}
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
                bbn: <span>{formatRupiah(item.bbn)}</span>,
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
  { title: "NO. SPK", key: "dealer_receive_unit.spk_number" },
  { title: "No. FAKTUR", key: "dealer_receive_unit.no_faktur_unit" },
  { title: "NAMA STNK", key: "dealer_receive_unit.name_legal" },
  { title: "No. HP", key: "dealer_receive_unit.no_hp" },
  { title: "No. Rangka", key: "dealer_receive_unit.frame_number" },
  { title: "No. Mesin", key: "dealer_receive_unit.engine_number" },
  { title: "BIAYA", key: "bbn" },
  { title: "NOTE", key: "note" },
];

export default SamsatDeliveryDetail;
