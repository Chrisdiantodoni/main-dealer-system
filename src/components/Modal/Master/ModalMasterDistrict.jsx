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
import SelectComponent from "@/components/ui/Select/Select";

const formValidation = yup
  .object({
    district_name: yup.string().required("Nama wajib diisi"),
    city: yup.object().nullable().required("City wajib dipilih"),
  })
  .required();

const ModalMasterDistrict = () => {
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
      district_name: "",
    },
  });
  const modalState = createStore((state) => state.modal.modalMasterDistrict);
  const modalItem = createStore((state) => state.modalItem);
  const handleModalClose = createStore((state) => state.handleModal);
  const [loading, setLoading] = useState(false);
  const [cityData, setCityData] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const queryClient = useQueryClient();

  const { mutate: onSubmit, isLoading } = useMutation({
    mutationFn: async (data) => {
      data = {
        ...data,
        city_id: data?.city?.value?.city_id,
      };
      if (modalItem) {
        const response = await master.updateDistrict(
          modalItem?.district_id,
          data
        );
        return response;
      }
      const response = await master.createDistrict(data);
      return response;
    },
    onSuccess: (res) => {
      if (res?.meta?.code === 200) {
        SweetAlert(
          "success",
          modalItem
            ? `District Edited Successfully`
            : `District Created Successfully `,
          "Success"
        );
        handleModalClose("modalMasterDistrict", false, modalItem);
        queryClient.invalidateQueries({ queryKey: ["getDistrict"] });
        reset();
      } else {
        SweetAlert("error", `District failed to create`, "error");
      }
    },
    onError: (res) => {
      SweetAlert("error", res?.data, "error");
    },
  });

  const getCityList = async () => {
    try {
      setLoading(true);
      const response = await master.getMasterCityList("limit=999");
      if (response?.meta?.code === 200) {
        setCityData(
          response?.data?.data?.map((item) => ({
            label: item?.city_name,
            value: item,
          }))
        );
      }
      setLoading(false);
      return response;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (modalItem) {
      setValue("district_name", modalItem?.district_name);
      setValue("city", {
        label: modalItem?.city?.city_name,
        value: {
          city_name: modalItem?.city?.city_name,
          city_id: modalItem?.city?.city_id,
        },
      });
    } else {
      reset();
    }
  }, [modalItem]);

  useEffect(() => {
    if (isMenuOpen) {
      getCityList();
    }
  }, [isMenuOpen]);

  return (
    <Modal
      activeModal={modalState}
      onClose={() => handleModalClose("modalMasterDistrict", false, modalItem)}
      centered
      title={modalItem ? "Edit District" : "Add New District"}
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
          <SelectComponent
            label={"City"}
            options={cityData}
            form={true}
            control={control}
            name={"city"}
            isClearable
            onMenuOpen={() => setIsMenuOpen(true)}
            isLoading={loading}
            error={errors.city}
          />
        </div>
        <div className="col-span-12">
          <Textinput
            control={control}
            label={"Nama"}
            placeholder="Nama"
            name={"district_name"}
            register={register}
            error={errors.district_name}
          />
        </div>
      </div>
    </Modal>
  );
};

export default ModalMasterDistrict;
