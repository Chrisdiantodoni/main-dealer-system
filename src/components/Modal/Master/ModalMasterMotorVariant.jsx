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
import SelectMotor from "@/components/Select/SelectMotor";

const formValidation = yup
  .object({
    variant: yup.string().required("Variant wajib diisi"),
    motor: yup.object().nullable().required("Motor wajib dipilih"),
  })
  .required();

const ModalMasterMotorVariant = () => {
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
      variant: "",
      motor: "",
    },
  });
  const modalState = createStore(
    (state) => state.modal.modalMasterMotorVariant
  );
  const modalItem = createStore((state) => state.modalItem);

  const handleModalClose = createStore((state) => state.handleModal);

  const queryClient = useQueryClient();

  const { mutate: onSubmit, isLoading } = useMutation({
    mutationFn: async (data) => {
      data = {
        ...data,
        motor_id: data?.motor?.value?.motor_id,
        motor_variant_name: data?.variant,
      };
      if (modalItem) {
        const response = await master.updateVariant(
          modalItem?.motor_variant_id,
          data
        );
        return response;
      }
      const response = await master.createVariant(data);
      return response;
    },
    onSuccess: (res) => {
      if (res?.meta?.code === 200) {
        SweetAlert(
          "success",
          modalItem
            ? `Motor Variant Edited Successfully`
            : `Motor Variant Created Successfully `,
          "Success"
        );
        handleModalClose("modalMasterMotorVariant", false, modalItem);
        queryClient.invalidateQueries({ queryKey: ["getMotorVariant"] });
        reset();
      } else {
        SweetAlert("error", `Motor Variant failed to create`, "error");
      }
    },
    onError: (res) => {
      SweetAlert("error", res?.data, "error");
    },
  });

  const { mutate: onUpdateStatus, isLoading: isLoadingUpdateStatus } =
    useMutation({
      mutationFn: async () => {
        const response = await master.deleteVariant(modalItem.motor_variant_id);
        return response;
      },
      onSuccess: (res) => {
        if (res?.meta?.code === 200) {
          SweetAlert("success", "Motor Variant Deleted", "Success");
          handleModalClose("modalMasterMotorVariant", false, modalItem);
          queryClient.invalidateQueries({ queryKey: ["getMotorVariant"] });
          reset();
        } else {
          SweetAlert("error", `Failed to delete`, "error");
        }
      },
      onError: (res) => {
        SweetAlert("error", res?.data, "error");
      },
    });

  useEffect(() => {
    if (modalItem) {
      setValue("variant", modalItem?.motor_variant_name);
      setValue("motor", {
        label: modalItem?.motor?.motor_name,
        value: {
          motor_name: modalItem?.motor?.motor_name,
          motor_id: modalItem?.motor?.motor_id,
        },
      });
    } else {
      reset();
    }
  }, [modalItem]);

  return (
    <Modal
      activeModal={modalState}
      onClose={() =>
        handleModalClose("modalMasterMotorVariant", false, modalItem)
      }
      centered
      title={modalItem ? "Edit Motor Variant" : "Add New Motor Variant"}
      footerContent={
        <div className="gap-2 flex">
          <Button
            isLoading={isLoading}
            text={modalItem ? "Edit" : "Submit"}
            className="btn-dark py-2 px-4"
            onClick={handleSubmit(onSubmit)}
          />
          {modalItem?.deleted_at == null && (
            <Button
              isLoading={isLoadingUpdateStatus}
              text={"Delete"}
              className={"btn-danger py-2 px-4"}
              onClick={handleSubmit(onUpdateStatus)}
            />
          )}
        </div>
      }
      themeClass="bg-white dark:bg-slate-800 dark:border-b dark:border-slate-700"
    >
      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12">
          <SelectMotor
            form={true}
            control={control}
            name={"motor"}
            isClearable
            error={errors.motor}
          />
        </div>
        <div className="col-span-12">
          <Textinput
            control={control}
            label={"Nama"}
            placeholder="Nama"
            name={"variant"}
            register={register}
            error={errors.variant}
          />
        </div>
      </div>
    </Modal>
  );
};

export default ModalMasterMotorVariant;
