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
import { useMutation, useQueryClient } from "react-query";
import master from "@/services/API/master";
import { SweetAlert } from "@/utils/Swal";
import { useEffect, useState } from "react";
import SelectComponent from "@/components/ui/Select/Select";

const formValidation = yup.object({
  dealer_neq_name: yup.string().required("Nama Dealer NEQ wajib diisi"),
  dealer_neq_code: yup.string().required("Kode Dealer NEQ wajib diisi"),
  dealer: yup.object().nullable().required("Dealer wajib dipilih"),
});

const ModalMasterDealerNeq = () => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(formValidation),
    mode: "all",
    defaultValues: {
      dealer_neq_name: "",
      dealer_neq_address: "",
      dealer: null,
      dealer_neq_phone_number: "",
      dealer_neq_code: "",
    },
  });
  const queryClient = useQueryClient();
  const modalState = createStore((state) => state.modal.modalMasterDealerNeq);
  const handleModal = createStore((state) => state.handleModal);
  const { modalItem } = createStore();

  const { isLoading, mutate: onSubmit } = useMutation({
    mutationFn: async (data) => {
      data = {
        ...data,
        dealer_id: data?.dealer?.value?.dealer_id,
      };
      if (modalItem?.dealer_neq_id) {
        return await master.updateDealerNeq(modalItem?.dealer_neq_id, data);
      }
      const response = await master.createDealerNeq(data);
      return response;
    },
    onSuccess: (res) => {
      if (res?.meta?.code === 200) {
        SweetAlert(
          "success",
          modalItem?.dealer_neq_id
            ? "Dealer NEQ Edit Successfully"
            : "Dealer NEQ created Successfully",
          "Success"
        );
        handleModal("modalMasterDealerNeq", false, modalItem);
        reset();
        queryClient.invalidateQueries({ queryKey: ["getDealerNeqList"] });
      } else {
        SweetAlert("error", `Dealer NEQ failed to create`, "error");
      }
    },
    onError: (res) => {
      SweetAlert("error", res?.data, "error");
    },
  });

  useEffect(() => {
    if (modalItem?.dealer_neq_id) {
      setValue("dealer_neq_name", modalItem?.dealer_neq_name);
      setValue("dealer_neq_code", modalItem?.dealer_neq_code);
      setValue("dealer", {
        label: modalItem?.dealer?.dealer_name,
        value: {
          dealer_id: modalItem?.dealer?.dealer_id,
        },
      });
      setValue("dealer_neq_phone_number", modalItem?.dealer_neq_phone_number);
      setValue("dealer_neq_address", modalItem?.dealer_neq_address);
    } else {
      reset();
    }
  }, [modalItem?.dealer_neq_id]);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dealers, setDealers] = useState([]);

  const { mutate: getDealer, isLoading: isFetchingMasterDealer } = useMutation({
    mutationFn: async () => {
      const response = await master.getDealerList("limit=999");
      setDealers(
        response?.data?.data?.map((item) => ({
          label: item?.dealer_name,
          value: item,
        }))
      );
      return response;
    },
  });

  useEffect(() => {
    if (isMenuOpen) {
      getDealer();
    }
  }, [isMenuOpen]);

  return (
    <Modal
      centered={true}
      activeModal={modalState}
      onClose={() => handleModal("modalMasterDealerNeq", false, modalItem)}
      title={
        modalItem?.dealer_neq_id ? `Edit Dealer NEQ` : `Add New Dealer NEQ`
      }
      themeClass="bg-white dark:bg-slate-800 dark:border-b dark:border-slate-700"
      footerContent={
        <>
          <Button
            isLoading={isLoading}
            text={modalItem?.dealer_neq_id ? "Edit" : "Submit"}
            className="btn-dark py-2 px-4"
            onClick={handleSubmit(onSubmit)}
          />
        </>
      }
    >
      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12">
          <Textinput
            placeholder="Nama Dealer NEQ"
            label={"Nama Dealer NEQ"}
            register={register}
            name={"dealer_neq_name"}
            error={errors.dealer_neq_name}
          />
        </div>
        <div className="col-span-12">
          <Textinput
            placeholder="Kode Dealer"
            label={"Kode Dealer NEQ"}
            register={register}
            name={"dealer_neq_code"}
            error={errors.dealer_neq_code}
          />
        </div>
        <div className="col-span-12">
          <SelectComponent
            label={" Dealer"}
            options={dealers}
            form={true}
            control={control}
            name={"dealer"}
            isClearable
            onMenuOpen={() => setIsMenuOpen(true)}
            isLoading={isFetchingMasterDealer}
            error={errors.dealer}
          />
        </div>
        <div className="col-span-12">
          <Textinput
            placeholder="Nomor Telepon/Nomor Hp"
            label={"Nomor Telepon/Nomor Hp"}
            name={"dealer_neq_phone_number"}
            register={register}
          />
        </div>
        <div className="col-span-12">
          <Textarea
            placeholder="Alamat Dealer"
            label={"Alamat Dealer"}
            className="min-h-[90px]"
            name={"dealer_neq_address"}
            register={register}
          />
        </div>
      </div>
    </Modal>
  );
};

export default ModalMasterDealerNeq;
