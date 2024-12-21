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
import SelectDistrict from "@/components/Select/SelectDistrict";

const formValidation = yup
  .object({
    sub_district_name: yup.string().required("Nama wajib diisi"),
    district: yup.object().nullable().required("District wajib dipilih"),
  })
  .required();

const ModalMasterSubDistrict = () => {
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
      sub_district_name: "",
    },
  });
  const modalState = createStore((state) => state.modal.modalMasterSubDistrict);
  const modalItem = createStore((state) => state.modalItem);
  const [loading, setLoading] = useState(false);
  const [districtData, setDistrictData] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const handleModalClose = createStore((state) => state.handleModal);

  const queryClient = useQueryClient();

  const { mutate: onSubmit, isLoading } = useMutation({
    mutationFn: async (data) => {
      data = {
        ...data,
        district_id: data?.district?.value?.district_id,
      };
      if (modalItem) {
        const response = await master.updateSubDistrict(
          modalItem?.sub_district_id,
          data
        );
        return response;
      }
      const response = await master.createSubDistrict(data);
      return response;
    },
    onSuccess: (res) => {
      if (res?.meta?.code === 200) {
        SweetAlert(
          "success",
          modalItem
            ? `Sub District Edited Successfully`
            : `Sub District Created Successfully `,
          "Success"
        );
        handleModalClose("modalMasterSubDistrict", false, modalItem);
        queryClient.invalidateQueries({ queryKey: ["getSubDistrict"] });
        reset();
      } else {
        SweetAlert("error", `Sub District failed to create`, "error");
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
          type: "method-sales",
        };
        const response = await master.updateMasterStatus(
          modalItem.method_sales_id,
          data
        );
        return response;
      },
      onSuccess: (res) => {
        if (res?.meta?.code === 200) {
          SweetAlert("success", "Status Changed Successfully", "Success");
          handleModalClose("modalMasterPoolingSource", false, modalItem);
          queryClient.invalidateQueries({ queryKey: ["getMethodSales"] });
          reset();
        } else {
          SweetAlert("error", `Failed to change status`, "error");
        }
      },
      onError: (res) => {
        SweetAlert("error", res?.data, "error");
      },
    });

  const getDistrictList = async () => {
    try {
      setLoading(true);
      const response = await master.getMasterDistrictList("limit=99999");
      if (response?.meta?.code === 200) {
        setDistrictData(
          response?.data?.data?.map((item) => ({
            label: item?.district_name,
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
      setValue("sub_district_name", modalItem?.sub_district_name);
      setValue("district", {
        label: modalItem?.district?.district_name,
        value: {
          district_name: modalItem?.district?.district_name,
          district_id: modalItem?.district?.district_id,
        },
      });
    } else {
      reset();
    }
  }, [modalItem]);

  useEffect(() => {
    if (isMenuOpen) {
      getDistrictList();
    }
  }, [isMenuOpen]);

  return (
    <Modal
      activeModal={modalState}
      onClose={() =>
        handleModalClose("modalMasterSubDistrict", false, modalItem)
      }
      centered
      title={modalItem ? "Edit Sub District" : "Add New Sub District"}
      footerContent={
        <div className="gap-2 flex">
          <Button
            isLoading={isLoading}
            text={modalItem ? "Edit" : "Submit"}
            className="btn-dark py-2 px-4"
            onClick={handleSubmit(onSubmit)}
          />
          {/* {modalItem && (
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
          )} */}
        </div>
      }
      themeClass="bg-white dark:bg-slate-800 dark:border-b dark:border-slate-700"
    >
      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12">
          <SelectDistrict
            options={districtData}
            form={true}
            control={control}
            name={"district"}
            isClearable
            onMenuOpen={() => setIsMenuOpen(true)}
            isLoading={loading}
            error={errors.district}
          />
        </div>
        <div className="col-span-12">
          <Textinput
            control={control}
            label={"Nama"}
            placeholder="Nama"
            name={"sub_district_name"}
            register={register}
            error={errors.sub_district_name}
          />
        </div>
      </div>
    </Modal>
  );
};

export default ModalMasterSubDistrict;
