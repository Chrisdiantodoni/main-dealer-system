import Modal from "@/components/ui/Modal";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import Textinput from "@/components/ui/Textinput";
import createStore from "@/context";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "@/components/ui/Button";
import { useMutation, useQuery, useQueryClient } from "react-query";
import master from "@/services/API/master";
import { SweetAlert } from "@/utils/Swal";
import { useEffect, useState } from "react";
import SelectComponent from "@/components/ui/Select/Select";
import apiKey from "@/services/API/apiKey";
import LoaderCircle from "@/components/Loader-circle";

const formValidation = yup.object({
  dealer_api_key_secret_id: yup
    .object()
    .nullable()
    .required("Dealer API key wajib dipilih"),
});

const ModalMasterAssignDealer = () => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    // resolver: yupResolver(formValidation),
    mode: "all",
    defaultValues: {
      dealer_api_key_secret_id: "",
    },
  });

  const queryClient = useQueryClient();
  const modalState = createStore(
    (state) => state.modal.modalMasterAssignDealer
  );
  const handleModal = createStore((state) => state.handleModal);
  const { modalItem } = createStore();

  const { isLoading, mutate: onSubmit } = useMutation({
    mutationFn: async (data) => {
      data = {
        ...data,
        dealer_api_key_secret_id:
          data?.dealer_api_key_secret_id?.value?.dealer_api_key_secret_id,
      };
      const response = await master.assignUserDealer(
        modalItem?.dealer_id,
        data
      );
      return response;
    },
    onSuccess: (res) => {
      if (res?.meta?.code === 200) {
        SweetAlert("success", "Assign Api Key Successfully", "Success");
        handleModal("modalMasterAssignDealer", false, modalItem);
        reset();
        queryClient.invalidateQueries({ queryKey: ["getDealerList"] });
      } else {
        SweetAlert("error", `Assign Api Key Failed`, "error");
      }
    },
    onError: (res) => {
      SweetAlert("error", res?.data, "error");
    },
  });

  const { mutate, isLoading: isLoadingApiKey } = useMutation({
    mutationFn: async () => {
      const response = await apiKey.getApiKeyDetail(
        modalItem?.dealer_api_key_secret_id
      );
      const dealer_api_key = response?.data;
      if (dealer_api_key) {
        setValue("dealer_api_key_secret_id", {
          value: dealer_api_key?.dealer_api_key_secret_id,
          label: `${dealer_api_key?.api_key_name} - (${dealer_api_key?.dealer
            ?.map((dealer_api) => dealer_api.dealer_name)
            .join(", ")})`,
        });
      }
      return response;
    },
  });

  useEffect(() => {
    if (modalItem?.dealer_id) {
      mutate();
    } else {
      reset();
    }
  }, [modalItem?.dealer_id]);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dealerApiKey, setDealerApiKey] = useState([]);

  const { mutate: getDealer, isLoading: isFetchingMasterDealer } = useMutation({
    mutationFn: async () => {
      const response = await apiKey.getListAPIkey("limit=999");
      setDealerApiKey(
        response?.data?.data?.map(
          (item) =>
            ({
              label: `${item?.api_key_name} - (${item?.dealer
                ?.map((dealer_api) => dealer_api.dealer_name)
                .join(", ")})`,
              value: item,
            } || [])
        )
      );
      return response;
    },
  });

  useEffect(() => {
    if (isMenuOpen) {
      getDealer();
    }
  }, [isMenuOpen]);

  return (
    <Modal
      centered={true}
      activeModal={modalState}
      onClose={() => handleModal("modalMasterAssignDealer", false, modalItem)}
      title={`Assign API Key`}
      themeClass="bg-white dark:bg-slate-800 dark:border-b dark:border-slate-700"
      footerContent={
        <>
          <Button
            isLoading={isLoading}
            text={"Assign API Key"}
            className="btn-dark py-2 px-4"
            onClick={handleSubmit(onSubmit)}
          />
        </>
      }
    >
      {isLoadingApiKey ? (
        <LoaderCircle />
      ) : (
        <div className="grid grid-cols-12 gap-5">
          <div className="col-span-12">
            <SelectComponent
              isLoading={isFetchingMasterDealer}
              placeholder="Dealer API Key"
              label={"Dealer API Key"}
              name={"dealer_api_key_secret_id"}
              control={control}
              form={true}
              options={dealerApiKey}
              // error={errors?.dealer_api_key_secret_id}
              onMenuOpen={() => setIsMenuOpen(true)}
            />
          </div>
        </div>
      )}
    </Modal>
  );
};

export default ModalMasterAssignDealer;
