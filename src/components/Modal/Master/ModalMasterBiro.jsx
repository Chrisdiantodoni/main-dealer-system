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
import Textarea from "@/components/ui/Textarea";

const formValidation = yup
  .object({
    biro_name: yup.string().required("Nama Biro wajib diisi"),
    biro_address: yup.string().required("Alamat Biro wajib diisi"),
  })
  .required();

const ModalBiro = () => {
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
      biro_name: "",
      biro_address: "",
      biro_telp: "",
      biro_phone_number: "",
    },
  });
  const modalState = createStore((state) => state.modal.modalMasterBiro);
  const modalItem = createStore((state) => state.modalItem);

  const handleModalClose = createStore((state) => state.handleModal);

  const queryClient = useQueryClient();

  const { mutate: onSubmit, isLoading } = useMutation({
    mutationFn: async (data) => {
      if (modalItem) {
        const response = await master.updateBiro(modalItem?.biro_id, data);
        return response;
      }
      const response = await master.createBiro(data);
      return response;
    },
    onSuccess: (res) => {
      if (res?.meta?.code === 200) {
        SweetAlert(
          "success",
          modalItem ? `Biro Edited Successfully` : `Biro Created Successfully `,
          "Success"
        );
        handleModalClose("modalMasterBiro", false, modalItem);
        queryClient.invalidateQueries({ queryKey: ["getBiro"] });
        reset();
      } else {
        SweetAlert("error", `Biro failed to create`, "error");
      }
    },
    onError: (res) => {
      SweetAlert("error", res?.data, "error");
    },
  });

  const { mutate: onUpdateStatus, isLoading: isLoadingUpdateStatus } =
    useMutation({
      mutationFn: async () => {
        const data = {
          type: "biro",
        };
        const response = await master.updateMasterStatus(
          modalItem.biro_id,
          data
        );
        return response;
      },
      onSuccess: (res) => {
        if (res?.meta?.code === 200) {
          SweetAlert("success", "Status Changed Successfully", "Success");
          handleModalClose("modalMasterBiro", false, modalItem);
          queryClient.invalidateQueries({ queryKey: ["getBiro"] });
          reset();
        } else {
          SweetAlert("error", `Failed to change status`, "error");
        }
      },
      onError: (res) => {
        SweetAlert("error", res?.data, "error");
      },
    });

  useEffect(() => {
    if (modalItem) {
      setValue("biro_name", modalItem?.biro_name);
      setValue("biro_address", modalItem?.biro_address);
      setValue("biro_telp", modalItem?.biro_telp);
      setValue("biro_phone_number", modalItem?.biro_phone_number);
    } else {
      reset();
    }
  }, [modalItem]);

  return (
    <Modal
      activeModal={modalState}
      onClose={() => handleModalClose("modalMasterBiro", false, modalItem)}
      centered
      title={modalItem ? "Edit Biro" : "Add New Biro"}
      footerContent={
        <div className="gap-2 flex">
          <Button
            isLoading={isLoading}
            text={modalItem ? "Edit" : "Submit"}
            className="btn-dark py-2 px-4"
            onClick={handleSubmit(onSubmit)}
          />
          {modalItem && (
            <Button
              isLoading={isLoadingUpdateStatus}
              text={modalItem?.biro_status === "active" ? "Inactive" : "Active"}
              className={
                modalItem?.biro_status === "active"
                  ? "btn-danger py-2 px-4"
                  : "btn-success py-2 px-4"
              }
              onClick={handleSubmit(onUpdateStatus)}
            />
          )}
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
            name={"biro_name"}
            register={register}
            error={errors.biro_name}
          />
        </div>
        <div className="col-span-12">
          <Textarea
            control={control}
            label={"Alamat"}
            placeholder="Alamat"
            name={"biro_address"}
            register={register}
            error={errors.biro_address}
          />
        </div>
        <div className="col-span-12">
          <Textinput
            control={control}
            label={"No. Telp"}
            placeholder="Nama"
            name={"biro_telp"}
            register={register}
            error={errors.biro_telp}
          />
        </div>
        <div className="col-span-12">
          <Textinput
            control={control}
            label={"No. Hp"}
            placeholder="No. Hp"
            name={"biro_phone_number"}
            register={register}
            error={errors.biro_phone_number}
          />
        </div>
      </div>
    </Modal>
  );
};

export default ModalBiro;
