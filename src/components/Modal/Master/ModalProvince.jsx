import Button from "@/components/ui/Button";
import { ControllerInput } from "@/components/ui/ControllerInput";
import DatePicker from "@/components/ui/DatePicker";
import Modal from "@/components/ui/Modal";
import Select from "@/components/ui/Select";
import Textinput from "@/components/ui/Textinput";
import { Controller, useForm, useWatch } from "react-hook-form";
import Flatpickr from "react-flatpickr";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation, useQueryClient } from "react-query";
import shippingOrder from "@/services/API/shippingOrder";
import { dayjsFormatInputDate } from "@/utils/dayjs";
import createStore from "@/context";
import { SweetAlert } from "@/utils/Swal";
import master from "@/services/API/master";
import { useEffect } from "react";

const formValidation = yup
  .object({
    province_name: yup.string().required("Nama wajib diisi"),
  })
  .required();

const ModalProvince = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    register,
  } = useForm({
    resolver: yupResolver(formValidation),
    mode: "all",
    defaultValues: {
      province_name: "",
    },
  });
  const modalState = createStore((state) => state.modal.modalMasterProvince);
  const modalItem = createStore((state) => state.modalItem);

  const handleModalClose = createStore((state) => state.handleModal);

  const queryClient = useQueryClient();

  const { mutate: onSubmit, isLoading } = useMutation({
    mutationFn: async (data) => {
      if (modalItem) {
        const response = await master.updateProvince(
          modalItem?.province_id,
          data
        );
        return response;
      }
      const response = await master.createProvince(data);
      return response;
    },
    onSuccess: (res) => {
      if (res?.meta?.code === 200) {
        SweetAlert(
          "success",
          modalItem
            ? `Province Edited Successfully`
            : `Province Created Successfully `,
          "Success"
        );
        handleModalClose("modalMasterProvince", false, modalItem);
        queryClient.invalidateQueries({ queryKey: ["getProvinceList"] });
        reset();
      } else {
        SweetAlert("error", `Province failed to create`, "error");
      }
    },
    onError: (res) => {
      SweetAlert("error", res?.data, "error");
    },
  });

  useEffect(() => {
    if (modalItem) {
      setValue("province_name", modalItem?.province_name);
    } else {
      reset();
    }
  }, [modalItem]);

  return (
    <Modal
      activeModal={modalState}
      onClose={() => handleModalClose("modalMasterProvince", false, modalItem)}
      centered
      title={modalItem ? "Edit Province" : "Add New Province"}
      footerContent={
        <div className="gap-2 flex">
          <Button
            isLoading={isLoading}
            text={modalItem ? "Edit" : "Submit"}
            className="btn-dark py-2 px-4"
            onClick={handleSubmit(onSubmit)}
          />
        </div>
      }
      themeClass="bg-white dark:bg-slate-800 dark:border-b dark:border-slate-700"
    >
      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12">
          <Textinput
            control={control}
            label={"Nama"}
            placeholder="Nama"
            name={"province_name"}
            register={register}
            error={errors.province_name}
          />
        </div>
      </div>
    </Modal>
  );
};

export default ModalProvince;
