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
    leasing_name: yup.string().required("Nama wajib diisi"),
  })
  .required();

const ModalLeasing = () => {
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
      leasing_name: "",
    },
  });
  const modalState = createStore((state) => state.modal.modalMasterLeasing);
  const modalItem = createStore((state) => state.modalItem);

  const handleModalClose = createStore((state) => state.handleModal);

  const queryClient = useQueryClient();

  const { mutate: onSubmit, isLoading } = useMutation({
    mutationFn: async (data) => {
      if (modalItem) {
        const response = await master.updateLeasing(
          modalItem?.leasing_id,
          data
        );
        return response;
      }
      const response = await master.createLeasing(data);
      return response;
    },
    onSuccess: (res) => {
      if (res?.meta?.code === 200) {
        SweetAlert(
          "success",
          modalItem
            ? `Leasing Edited Successfully`
            : `Leasing Created Successfully `,
          "Success"
        );
        handleModalClose("modalMasterLeasing", false, modalItem);
        queryClient.invalidateQueries({ queryKey: ["getLeasingList"] });
        reset();
      } else {
        SweetAlert("error", `Leasing failed to create`, "error");
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
          type: "leasing",
        };
        const response = await master.updateMasterStatus(
          modalItem.leasing_id,
          data
        );
        return response;
      },
      onSuccess: (res) => {
        if (res?.meta?.code === 200) {
          SweetAlert("success", "Status Changed Successfully", "Success");
          handleModalClose("modalMasterLeasing", false, modalItem);
          queryClient.invalidateQueries({ queryKey: ["getLeasingList"] });
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
      setValue("leasing_name", modalItem?.leasing_name);
    } else {
      reset();
    }
  }, [modalItem]);

  return (
    <Modal
      activeModal={modalState}
      onClose={() => handleModalClose("modalMasterLeasing", false, modalItem)}
      centered
      title={modalItem ? "Edit Leasing" : "Add New Leasing"}
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
              text={modalItem?.status === "active" ? "Inactive" : "Active"}
              className={
                modalItem?.status === "active"
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
            name={"leasing_name"}
            register={register}
            error={errors.leasing_name}
          />
        </div>
      </div>
    </Modal>
  );
};

export default ModalLeasing;
