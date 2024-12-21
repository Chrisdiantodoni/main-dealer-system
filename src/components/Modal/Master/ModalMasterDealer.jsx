import { ControllerInput } from "@/components/ui/ControllerInput";
import Modal from "@/components/ui/Modal";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import Textinput from "@/components/ui/Textinput";
import createStore from "@/context";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "@/components/ui/Button";
import { useMutation, useQuery, useQueryClient } from "react-query";
import master from "@/services/API/master";
import { SweetAlert } from "@/utils/Swal";
import { useEffect, useState } from "react";
import SelectComponent from "@/components/ui/Select/Select";
import user from "@/services/API/user";

const formValidation = yup.object({
  dealer_name: yup.string().required("Nama Dealer wajib diisi"),
  // main_dealer: yup.string().required("Main Dealer wajib dipilih"),
  dealer_code: yup.string().required("Kode Dealer wajib diisi"),
  dealer_alias: yup.string().required("Prefix Dealer wajib diisi."),
});

const ModalMasterDealer = () => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(formValidation),
    mode: "all",
    defaultValues: {
      dealer_type: "mds",
      dealer_name: "",
      dealer_code: "",
      dealer_phone_number: "",
      dealer_address: "",
      dealer_alias: "",
      main_dealer: "",
    },
  });

  console.log(errors);

  const queryClient = useQueryClient();
  const modalState = createStore((state) => state.modal.modalMasterDealer);
  const handleModal = createStore((state) => state.handleModal);
  const { modalItem } = createStore();
  const [mainDealer, setMainDealer] = useState("");
  const { isLoading, mutate: onSubmit } = useMutation({
    mutationFn: async (data) => {
      data = {
        ...data,
        main_dealer_id: data?.main_dealer?.value,
      };
      if (modalItem?.dealer_id) {
        return await master.updateDealer(modalItem?.dealer_id, data);
      }
      const response = await master.createDealer(data);
      return response;
    },
    onSuccess: (res) => {
      if (res?.meta?.code === 200) {
        SweetAlert(
          "success",
          modalItem?.dealer_id
            ? "Dealer Edit Successfully"
            : "Dealer created Successfully",
          "Success"
        );
        handleModal("modalMasterDealer", false, modalItem);
        reset();
        queryClient.invalidateQueries({ queryKey: ["getDealerList"] });
      } else {
        SweetAlert("error", `Dealer failed to create`, "error");
      }
    },
    onError: (res) => {
      SweetAlert("error", res?.data, "error");
    },
  });
  const users = JSON.parse(localStorage.getItem("user_md"));

  const { isLoading: isFetchingMasterDealer } = useQuery({
    queryFn: async () => {
      const response = await user.getOwnUserDetail(users.user_id);
      console.log(response);
      setMainDealer({
        label:
          response?.data?.user_by_main_dealer?.main_dealer?.main_dealer_name,
        value: response?.data?.user_by_main_dealer,
      });
      setValue("main_dealer", {
        label:
          response?.data?.user_by_main_dealer?.main_dealer?.main_dealer_name,
        value: response?.data?.user_by_main_dealer?.main_dealer_id,
      });
      return response;
    },
  });

  useEffect(() => {
    if (modalItem?.dealer_id) {
      setValue("dealer_name", modalItem.dealer_name);
      setValue("dealer_code", modalItem.dealer_code);
      setValue("dealer_type", modalItem.dealer_type);
      setValue("dealer_phone_number", modalItem.dealer_phone_number);
      setValue("dealer_address", modalItem.dealer_address);
      setValue("dealer_base_api", modalItem.dealer_base_api);
      setValue("dealer_alias", modalItem.dealer_alias || modalItem.dealer_code);
      setMainDealer("main_dealer", {
        label: modalItem?.main_dealer?.main_dealer_name,
        value: modalItem?.main_dealer?.main_dealer_id,
      });
    } else {
      reset();
    }
  }, [modalItem?.dealer_id]);

  return (
    <Modal
      centered={true}
      activeModal={modalState}
      onClose={() => handleModal("modalMasterDealer", false, modalItem)}
      title={modalItem?.dealer_id ? `Edit Dealer` : `Add New Dealer`}
      themeClass="bg-white dark:bg-slate-800 dark:border-b dark:border-slate-700"
      footerContent={
        <>
          <Button
            disabled={isFetchingMasterDealer}
            isLoading={isLoading}
            text={modalItem?.dealer_id ? "Edit" : "Submit"}
            className="btn-dark py-2 px-4"
            onClick={handleSubmit(onSubmit)}
          />
        </>
      }
    >
      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12">
          <Textinput
            placeholder="Nama Dealer"
            label={"Nama Dealer"}
            register={register}
            name={"dealer_name"}
            error={errors.dealer_name}
          />
        </div>
        <div className="col-span-12">
          <Textinput
            placeholder="Kode Dealer"
            label={"Kode Dealer"}
            register={register}
            name={"dealer_code"}
            error={errors.dealer_code}
          />
        </div>
        <div className="col-span-12">
          <Textinput
            placeholder="Kode Dealer"
            label={"Prefix Dealer"}
            register={register}
            name={"dealer_alias"}
            error={errors.dealer_alias}
          />
        </div>
        <div className="col-span-12">
          <Select
            label={"Jenis Dealer"}
            options={[
              { label: "MDS", value: "mds" },
              { label: "Independent", value: "independent" },
            ]}
            register={register}
            name={"dealer_type"}
          />
        </div>
        <div className="col-span-12">
          <Textinput
            placeholder="Nomor Telepon/Nomor Hp"
            label={"Nomor Telepon/Nomor Hp"}
            name={"dealer_phone_number"}
            register={register}
          />
        </div>

        <div className="col-span-12">
          <Textinput
            onChange={() => {}}
            placeholder="Main dealer"
            label={"Main Dealer"}
            disabled={true}
            value={mainDealer?.label}
          />
        </div>
        {/* <div className="col-span-12">
          <Textinput
            placeholder="Base API dealer"
            label={"Base API"}
            name={"dealer_base_api"}
            register={register}
            error={errors.dealer_base_api}
          />
        </div> */}
        <div className="col-span-12">
          <Textarea
            placeholder="Alamat Dealer"
            label={"Alamat Dealer"}
            className="min-h-[90px]"
            name={"dealer_address"}
            register={register}
          />
        </div>
      </div>
    </Modal>
  );
};

export default ModalMasterDealer;
