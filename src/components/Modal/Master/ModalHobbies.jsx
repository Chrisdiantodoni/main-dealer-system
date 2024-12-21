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
    hobbies_name: yup.string().required("Nama Hobi wajib diisi"),
  })
  .required();

const ModalHobbies = () => {
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
      hobbies_name: "",
    },
  });
  const modalState = createStore((state) => state.modal.modalMasterHobbies);
  const modalItem = createStore((state) => state.modalItem);

  const handleModalClose = createStore((state) => state.handleModal);

  const queryClient = useQueryClient();

  const { mutate: onSubmit, isLoading } = useMutation({
    mutationFn: async (data) => {
      if (modalItem) {
        const response = await master.updateHobbies(
          modalItem?.hobbies_id,
          data
        );
        return response;
      }
      const response = await master.createHobbies(data);
      return response;
    },
    onSuccess: (res) => {
      if (res?.meta?.code === 200) {
        SweetAlert(
          "success",
          modalItem
            ? `Hobbies Edited Successfully`
            : `Hobbies Created Successfully `,
          "Success"
        );
        handleModalClose("modalMasterHobbies", false, modalItem);
        queryClient.invalidateQueries({ queryKey: ["getHobbies"] });
        reset();
      } else {
        SweetAlert("error", `Hobbies failed to create`, "error");
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
          type: "hobbies",
        };
        const response = await master.updateMasterStatus(
          modalItem.hobbies_id,
          data
        );
        return response;
      },
      onSuccess: (res) => {
        if (res?.meta?.code === 200) {
          SweetAlert("success", "Status Changed Successfully", "Success");
          handleModalClose("modalMasterHobbies", false, modalItem);
          queryClient.invalidateQueries({ queryKey: ["getHobbies"] });
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
      setValue("hobbies_name", modalItem?.hobbies_name);
    } else {
      reset();
    }
  }, [modalItem]);

  return (
    <Modal
      activeModal={modalState}
      onClose={() => handleModalClose("modalMasterHobbies", false, modalItem)}
      centered
      title={modalItem ? "Edit Hobbies" : "Add New Hobbies"}
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
              text={
                modalItem?.hobbies_status === "active" ? "Inactive" : "Active"
              }
              className={
                modalItem?.hobbies_status === "active"
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
            name={"hobbies_name"}
            register={register}
            error={errors.hobbies_name}
          />
        </div>
      </div>
    </Modal>
  );
};

export default ModalHobbies;
