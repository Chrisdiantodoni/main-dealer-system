import Modal from "@/components/ui/Modal";
import createStore from "@/context";
import Button from "@/components/ui/Button";
import SelectDealer from "@/components/Select/SelectDealer";
import Table from "@/pages/table/Table";
import Pagination from "@/components/ui/Pagination";
import { useState } from "react";
import Search from "@/components/ui/Search";
import LoaderCircle from "@/components/Loader-circle";
import Loading from "@/components/Loading";
import { useNavigate } from "react-router-dom";
import Select from "@/components/ui/Select";

const ModalDeliveryDealer = () => {
  const modalState = createStore((state) => state.modal.modalDeliveryDealer);
  const handleModal = createStore((state) => state.handleModal);
  const [selectDealer, setSelectedDealer] = useState(null);
  const [errorDealer, setErrorDealer] = useState("");
  const [errorDocument, setErrorDocument] = useState("");
  const [selectDocument, setSelectDocument] = useState("");

  const headers = [
    { title: "NO", key: "no" },
    { title: "Tanggal", key: "Tanggal" },
    { title: "No. Faktur", key: "faktur_no" },
    { title: "Dealer", key: "Dealer" },
    { title: "Nama STNK", key: "stnk_name" },
    { title: "No. Telp", key: "tel_no" },
    { title: "No. Rangka", key: "chassis_no" },
    { title: "No. Mesin", key: "engine_no" },
  ];

  const navigate = useNavigate();

  const onSubmit = () => {
    if (selectDealer === null) {
      setErrorDealer("Dealer wajib dipilih");
      return;
    }
    if (selectDocument === "") {
      setErrorDocument({ message: "Jenis dokumen wajib dipilih" });
      return;
    }
    navigate(
      `/biro/delivery-dealer/add?dealer_id=${selectDealer?.value?.dealer_id}&dealer_name=${selectDealer?.value?.dealer_name}&dealer_code=${selectDealer?.value?.dealer_code}&type=${selectDocument}`
    );
    handleModal("modalDeliveryDealer", false);
  };

  return (
    <Modal
      centered={true}
      activeModal={modalState}
      onClose={() => handleModal("modalDeliveryDealer", false)}
      title={"Delivery Dealer"}
      className="w-4/5 lg:w-2/5"
      themeClass="bg-white dark:bg-slate-800 dark:border-b dark:border-slate-700"
      footerContent={
        <div className="flex justify-start w-full gap-x-2">
          <Button
            text={"SUBMIT"}
            className="btn-dark py-2 px-4"
            onClick={onSubmit}
          />
          <Button
            text={"CANCEL"}
            className="btn-danger py-2 px-4"
            onClick={() => handleModal("modalDeliveryDealer", false)}
          />
        </div>
      }
    >
      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12">
          <Select
            label={"Jenis Dokumen"}
            options={[
              {
                label: "PLAT",
                value: "no_plat",
              },
              {
                label: "STNK",
                value: "stnk",
              },
              {
                label: "BPKB",
                value: "bpkb",
              },
            ]}
            error={errorDocument}
            placeholder="Pilih Jenis Dokumen"
            value={selectDocument}
            onChange={(e) => setSelectDocument(e.target.value)}
          />
        </div>
        <div className="col-span-12">
          <SelectDealer
            documentType={selectDocument}
            type={"delivery-dealer"}
            include={["samsat_dev_unit"]}
            error={errorDealer}
            value={selectDealer}
            onChange={(value) => setSelectedDealer(value)}
          />
        </div>
      </div>
    </Modal>
  );
};

export default ModalDeliveryDealer;
