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
    city_name: yup.string().required("Nama wajib diisi"),
    province: yup.object().nullable().required("Province wajib dipilih"),
  })
  .required();

const ModalMasterCity = () => {
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
      city_name: "",
    },
  });
  const modalState = createStore((state) => state.modal.modalMasterCity);
  const modalItem = createStore((state) => state.modalItem);
  const [provinceData, setProvinceData] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleModalClose = createStore((state) => state.handleModal);

  const queryClient = useQueryClient();

  const { mutate: onSubmit, isLoading } = useMutation({
    mutationFn: async (data) => {
      data = {
        ...data,
        province_id: data?.province?.value?.province_id,
      };
      if (modalItem) {
        const response = await master.updateCity(modalItem?.city_id, data);
        return response;
      }
      const response = await master.createCity(data);
      return response;
    },
    onSuccess: (res) => {
      if (res?.meta?.code === 200) {
        SweetAlert(
          "success",
          modalItem ? `City Edited Successfully` : `City Created Successfully `,
          "Success"
        );
        handleModalClose("modalMasterCity", false, modalItem);
        queryClient.invalidateQueries({ queryKey: ["getCityList"] });
        reset();
      } else {
        SweetAlert("error", `City failed to create`, "error");
      }
    },
    onError: (res) => {
      SweetAlert("error", res?.data, "error");
    },
  });

  const getProvince = async () => {
    try {
      setLoading(true);
      const response = await master.getProvinceList("limit=999");
      if (response?.meta?.code === 200) {
        setProvinceData(
          response?.data?.data?.map((item) => ({
            label: item?.province_name,
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
      setValue("city_name", modalItem?.city_name);
      setValue("province", {
        label: modalItem?.province?.province_name,
        value: {
          province_id: modalItem?.province_id,
          province_name: modalItem?.province?.province_name,
        },
      });
    } else {
      reset();
    }
  }, [modalItem]);

  useEffect(() => {
    if (isMenuOpen) {
      getProvince();
    }
  }, [isMenuOpen]);

  return (
    <Modal
      activeModal={modalState}
      onClose={() => handleModalClose("modalMasterCity", false, modalItem)}
      centered
      title={modalItem ? "Edit City" : "Add New City"}
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
            label={"Province"}
            options={provinceData}
            form={true}
            control={control}
            name={"province"}
            isClearable
            onMenuOpen={() => setIsMenuOpen(true)}
            isLoading={loading}
            error={errors.dealer}
          />
        </div>
        <div className="col-span-12">
          <Textinput
            control={control}
            label={"City Name"}
            placeholder="Nama"
            name={"city_name"}
            register={register}
            error={errors.city_name}
          />
        </div>
      </div>
    </Modal>
  );
};

export default ModalMasterCity;
