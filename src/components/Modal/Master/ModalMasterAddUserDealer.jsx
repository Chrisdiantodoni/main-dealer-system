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
import apiKey from "@/services/API/apiKey";

const formValidation = yup
  .object({
    username: yup.string().required("Username wajib diisi"),
  })
  .required();

const modalMasterUserDealer = () => {
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
      username: "",
    },
  });
  const modalState = createStore((state) => state.modal.modalMasterUserDealer);
  const modalItem = createStore((state) => state.modalItem);

  const handleModalClose = createStore((state) => state.handleModal);

  const queryClient = useQueryClient();

  const { mutate: onSubmit, isLoading } = useMutation({
    mutationFn: async (data) => {
      const response = await apiKey.apiKeyAddUser(
        modalItem?.dealer_api_key_secret_id,
        data
      );
      return response;
    },
    onSuccess: (res) => {
      if (res?.meta?.code === 200) {
        SweetAlert("success", `Username Assigned Successfully `, "Success");
        handleModalClose("modalMasterUserDealer", false, modalItem);
        queryClient.invalidateQueries({ queryKey: ["getApiKeyById"] });
        reset();
      } else {
        SweetAlert("error", `User failed to create`, "error");
      }
    },
    onError: (res) => {
      console.log(res);
      SweetAlert("error", res?.data, "error");
    },
  });

  useEffect(() => {
    if (modalItem) {
      setValue("username", modalItem?.username);
    } else {
      reset();
    }
  }, [modalItem]);

  return (
    <Modal
      activeModal={modalState}
      onClose={() =>
        handleModalClose("modalMasterUserDealer", false, modalItem)
      }
      centered
      title={"Add New User"}
      footerContent={
        <div className="gap-2 flex">
          <Button
            isLoading={isLoading}
            text={"Submit"}
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
            label={"Username"}
            placeholder="username"
            name={"username"}
            register={register}
            error={errors.username}
          />
        </div>
      </div>
    </Modal>
  );
};

export default modalMasterUserDealer;
