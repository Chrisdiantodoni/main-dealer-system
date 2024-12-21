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
import { useEffect, useState } from "react";
import user from "@/services/API/user";
import SelectComponent from "@/components/ui/Select/Select";

const formValidation = yup.object({
  name: yup.string().required("Nama Wajib terisi"),
  username: yup.string().required("Username wajib diisi"),
  // main_dealers: yup.object().nullable().required("Dealer wajib dipilih"),
});

const ModalUser = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    register,
    watch,
  } = useForm({
    resolver: yupResolver(formValidation),
    mode: "all",
    defaultValues: {
      name: "",
      username: "",
      main_dealers: [],
    },
  });

  const selectedDealers = watch("main_dealers");

  const modalState = createStore((state) => state.modal.modalMasterAddUser);
  const modalItem = createStore((state) => state.modalItem);

  const handleModalClose = createStore((state) => state.handleModal);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const queryClient = useQueryClient();

  const { mutate: onSubmit, isLoading } = useMutation({
    mutationFn: async (data) => {
      const body = {
        name: data.name,
        username: data.username,
        main_dealers: data?.main_dealers?.map((item) => ({
          main_dealer_id: item?.value?.main_dealer_id,
        })),
      };
      if (modalItem) {
        const response = await user.updateUser(modalItem?.user_id, body);
        return response;
      }
      const response = await user.createUser(body);
      return response;
    },
    onSuccess: (res) => {
      if (res?.meta?.code === 200) {
        if (modalItem) {
          SweetAlert("success", `User Edited Successfully `, "Success");
          handleModalClose("modalMasterAddUser", false, modalItem);
          queryClient.invalidateQueries({ queryKey: ["getUserById"] });
          reset();
          return;
        }
        handleModalClose("modalMasterAddUser", false, modalItem);
        queryClient.invalidateQueries({ queryKey: ["getUserList"] });
        reset();
      } else {
        SweetAlert("error", `User Failed to create`, "error");
      }
    },
    onError: (res) => {
      SweetAlert("error", res?.data, "error");
    },
  });

  const [mainDealers, setMainDealers] = useState([]);

  const { mutate: getDealer, isLoading: isFetchingMasterDealer } = useMutation({
    mutationFn: async () => {
      const response = await master.getMainDealerList("limit=999");
      setMainDealers(
        response?.data?.data?.map((item) => ({
          label: item.main_dealer_name,
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

  useEffect(() => {
    if (modalItem) {
      setValue("name", modalItem?.name);
      setValue("username", modalItem?.username);
      setValue(
        "main_dealers",
        modalItem?.main_dealers?.map((item) => ({
          label: item?.main_dealer?.main_dealer_name,
          value: {
            main_dealer_id: item?.main_dealer?.main_dealer_id,
          },
        }))
      );
    }
  }, [modalItem]);

  const availableDealers = mainDealers?.filter(
    (dealer) =>
      !selectedDealers?.some(
        (selectedDealer) =>
          selectedDealer.value.main_dealer_id === dealer.value.main_dealer_id
      )
  );

  return (
    <Modal
      activeModal={modalState}
      onClose={() => handleModalClose("modalMasterAddUser", false, modalItem)}
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
            label={"Nama"}
            placeholder="nama"
            name={"name"}
            register={register}
            error={errors.name}
          />
        </div>
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
        <div className="col-span-12">
          <div className="col-span-12">
            <SelectComponent
              isMulti
              label={"Main Dealer"}
              options={availableDealers}
              form={true}
              control={control}
              name={"main_dealers"}
              isClearable
              onMenuOpen={() => setIsMenuOpen(true)}
              isLoading={isFetchingMasterDealer}
              error={errors.main_dealers}
              closeMenuOnSelect={false}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ModalUser;
