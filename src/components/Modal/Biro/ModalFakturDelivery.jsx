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

const ModalFakturDelivery = ({ type }) => {
  const modalState = createStore((state) => state.modal.modalFakturDelivery);
  const handleModal = createStore((state) => state.handleModal);
  const [selectDealer, setSelectedDealer] = useState(null);
  const [errorDealer, setErrorDealer] = useState("");

  const navigate = useNavigate();

  const onSubmit = () => {
    if (selectDealer === null) {
      setErrorDealer("Dealer wajib dipilih");
      return;
    }
    navigate(
      `/biro/faktur-delivery/add?dealer_id=${selectDealer?.value?.dealer_id}&dealer_name=${selectDealer?.value?.dealer_name}&dealer_code=${selectDealer?.value?.dealer_code}`
    );
    handleModal("modalFakturDelivery", false);
  };

  return (
    <Modal
      centered={true}
      activeModal={modalState}
      onClose={() => handleModal("modalFakturDelivery", false)}
      title={"Faktur Delivery"}
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
            onClick={() => handleModal("modalFakturDelivery", false)}
          />
        </div>
      }
    >
      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12">
          <SelectDealer
            type={type}
            error={errorDealer}
            value={selectDealer}
            include={["faktur_received"]}
            onChange={(value) => setSelectedDealer(value)}
          />
        </div>
      </div>
    </Modal>
  );
};

export default ModalFakturDelivery;
