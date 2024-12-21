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
import SelectComponent from "@/components/ui/Select/Select";
import { useQuery } from "react-query";
import master from "@/services/API/master";
import SelectBiro from "@/components/Select/SelectBiro";

const ModalSamsat = ({ type }) => {
  const modalState = createStore((state) => state.modal.modalSamsat);
  const handleModal = createStore((state) => state.handleModal);
  const [selectBiro, setSelectedBiro] = useState(null);
  const [errorDealer, setErrorDealer] = useState("");

  const navigate = useNavigate();

  const onSubmit = () => {
    if (selectBiro === null) {
      setErrorDealer("Biro wajib dipilih");
      return;
    }
    if (type === "delivery") {
      navigate(
        `/biro/samsat-delivery/add?biro_name=${selectBiro?.value?.biro_name}&biro_id=${selectBiro?.value?.biro_id}`
      );
      handleModal("modalSamsat", false);
    } else {
      navigate(
        `/biro/samsat-receive/add?biro_name=${selectBiro?.value?.biro_name}&biro_id=${selectBiro?.value?.biro_id}`
      );
      handleModal("modalSamsat", false);
    }
  };

  return (
    <Modal
      centered={true}
      activeModal={modalState}
      onClose={() => handleModal("modalSamsat", false)}
      title={type === "receive" ? "Samsat Receive" : "Samsat Delivery"}
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
            onClick={() => handleModal("modalSamsat", false)}
          />
        </div>
      }
    >
      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12">
          <SelectBiro
            type={type}
            label={"Biro"}
            onChange={(value) => setSelectedBiro(value)}
          />
        </div>
      </div>
    </Modal>
  );
};

export default ModalSamsat;
