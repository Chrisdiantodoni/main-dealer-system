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

const formValidation = yup
  .object({
    city: yup.string().required("City is required"),
  })
  .required();

const ModalSyncShippingOrder = ({ label, labelClass, centered, title }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(formValidation),
    mode: "all",
    defaultValues: {
      targetDate: new Date(),
      city: "",
    },
  });
  const modalState = createStore((state) => state.modal.modalSyncShippingOrder);

  const handleModalClose = createStore((state) => state.handleModal);

  const city = useWatch({
    control,
    name: "city",
  });

  const queryClient = useQueryClient();

  const { mutate: onSubmit, isLoading } = useMutation({
    mutationFn: async (data) => {
      const body = {
        city: data?.city,
        targetDate: dayjsFormatInputDate(data?.targetDate),
      };
      //   console.log(body);
      //   return;
      const response = await shippingOrder.syncShippingOrder(body);
      return response;
    },
    onSuccess: (res) => {
      if (res?.meta?.code === 200) {
        SweetAlert(
          "success",
          `Sync data city ${city.toUpperCase()} Successful `,
          "Success"
        );
        handleModalClose("modalSyncShippingOrder", false);
        queryClient.invalidateQueries({ queryKey: ["getShippingOrder"] });
        reset();
      } else {
        SweetAlert("error", `Sync data Failed `, "error");
      }
    },
    onError: (res) => {
      SweetAlert("error", res?.data, "error");
    },
  });

  return (
    <Modal
      activeModal={modalState}
      onClose={() => handleModalClose("modalSyncShippingOrder", false)}
      centered
      title={"Sync Shipping Order Data"}
      footerContent={
        <>
          <Button
            isLoading={isLoading}
            text="Sync"
            className="btn-dark py-2 px-4"
            onClick={handleSubmit(onSubmit)}
          />
        </>
      }
      themeClass="bg-white dark:bg-slate-800 dark:border-b dark:border-slate-700"
    >
      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12">
          <DatePicker
            control={control}
            label={"Select Date"}
            name={"targetDate"}
            form={true}
          />
        </div>
        <div className="col-span-12">
          <Controller
            control={control}
            name="city"
            render={({ field: { onChange, value } }) => (
              <Select
                label={"Select City"}
                placeholder="Select City MD"
                onChange={onChange}
                value={value}
                error={errors.city}
                options={[
                  { label: "MDN", value: "mdn" },
                  { label: "PKU", value: "pku" },
                  { label: "BTM", value: "btm" },
                ]}
              />
            )}
          />
        </div>
      </div>
    </Modal>
  );
};

export default ModalSyncShippingOrder;
