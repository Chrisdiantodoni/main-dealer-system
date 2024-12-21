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
    occupation_name: yup.string().required("Nama wajib diisi"),
  })
  .required();

const ModalOccupation = () => {
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
      occupation_name: "",
    },
  });
  const modalState = createStore((state) => state.modal.modalMasterOccupation);
  const modalItem = createStore((state) => state.modalItem);

  const handleModalClose = createStore((state) => state.handleModal);

  const queryClient = useQueryClient();

  const { mutate: onSubmit, isLoading } = useMutation({
    mutationFn: async (data) => {
      if (modalItem) {
        const response = await master.updateOccupation(
          modalItem?.occupation_id,
          data
        );
        return response;
      }
      const response = await master.createOccupation(data);
      return response;
    },
    onSuccess: (res) => {
      if (res?.meta?.code === 200) {
        SweetAlert(
          "success",
          modalItem
            ? `Occupation Edited Successfully`
            : `Occupation Created Successfully `,
          "Success"
        );
        handleModalClose("modalMasterOccupation", false, modalItem);
        queryClient.invalidateQueries({ queryKey: ["getOccupationList"] });
        reset();
      } else {
        SweetAlert("error", `Occupation failed to create`, "error");
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
          type: "occupation",
        };
        const response = await master.updateMasterStatus(
          modalItem.occupation_id,
          data
        );
        return response;
      },
      onSuccess: (res) => {
        if (res?.meta?.code === 200) {
          SweetAlert("success", "Status Changed Successfully", "Success");
          handleModalClose("modalMasterOccupation", false, modalItem);
          queryClient.invalidateQueries({ queryKey: ["getOccupationList"] });
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
      setValue("occupation_name", modalItem?.occupation_name);
    } else {
      reset();
    }
  }, [modalItem]);

  return (
    <Modal
      activeModal={modalState}
      onClose={() =>
        handleModalClose("modalMasterOccupation", false, modalItem)
      }
      centered
      title={modalItem ? "Edit Occupation" : "Add New Occupation"}
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
            name={"occupation_name"}
            register={register}
            error={errors.occupation_name}
          />
        </div>
      </div>
    </Modal>
  );
};

export default ModalOccupation;
