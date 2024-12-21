import { ControllerInput } from "@/components/ui/ControllerInput";
import Modal from "@/components/ui/Modal";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import Textinput from "@/components/ui/Textinput";
import createStore from "@/context";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "@/components/ui/Button";
import { useMutation, useQueryClient } from "react-query";
import master from "@/services/API/master";
import { SweetAlert } from "@/utils/Swal";
import { useEffect, useState } from "react";
import SelectComponent from "@/components/ui/Select/Select";
import { v4 as uuidv4 } from "uuid";
import apiKey from "@/services/API/apiKey";

const formValidation = yup.object({
  api_key_secret: yup.string().required("Api Key Secret Wajib terisi"),
  api_key_name: yup.string().required("Api Key Name wajib diisi"),
  base_url: yup.string().required("Base Url wajib diisi"),
  database_name: yup.string().required("Nama Database wajib diisi"),
  dealer: yup
    .array()
    .of(
      yup.object().shape({
        label: yup.string().required("Label is required"),
        value: yup.object().required("Value is required"),
      })
    )
    .required("Dealer wajib dipilih")
    .nullable(),
});

const ModalMasterApiKey = () => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(formValidation),
    mode: "all",
    defaultValues: {
      api_key_secret: uuidv4(),
      api_key_name: "",
      dealer: [],
    },
  });

  const selectedDealers = watch("dealer");

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [modalItemDefined, setModalItemDefined] = useState(false);
  const [dealers, setDealers] = useState([]);
  const queryClient = useQueryClient();
  const modalState = createStore((state) => state.modal.modalMasterApiKey);
  const handleModal = createStore((state) => state.handleModal);
  const { modalItem } = createStore();

  const { isLoading, mutate: onSubmit } = useMutation({
    mutationFn: async (data) => {
      data = {
        ...data,
        dealer: data?.dealer?.map((item) => item.value?.dealer_id),
      };
      if (modalItem?.dealer_api_key_secret_id) {
        return await apiKey.updateApiKey(
          modalItem?.dealer_api_key_secret_id,
          data
        );
      }
      const response = await apiKey.apiKeyCreate(data);
      return response;
    },
    onSuccess: (res) => {
      if (res?.meta?.code === 200) {
        SweetAlert(
          "success",
          modalItem?.dealer_api_key_secret_id
            ? "Api Key Edit Successfully"
            : "Api Key created Successfully",
          "Success"
        );
        handleModal("modalMasterApiKey", false);
        if (modalItem) {
          queryClient.invalidateQueries({ queryKey: ["getApiKeyById"] });
          return;
        }
        queryClient.invalidateQueries({
          queryKey: ["getApiKeyList"],
        });

        reset();
      } else {
        SweetAlert("error", `Api Key failed to create`, "error");
      }
    },
    onError: (res) => {
      SweetAlert("error", res?.data, "error");
    },
  });

  useEffect(() => {
    if (modalItem?.dealer_api_key_secret_id) {
      setModalItemDefined(true);
      console.log("jalan");
      setValue("api_key_secret", modalItem.api_key_secret);
      setValue("api_key_name", modalItem.api_key_name);
      setValue("base_url", modalItem.base_url);
      setValue("database_name", modalItem.database_name);
      setValue(
        "dealer",
        modalItem.dealer.map((item) => ({
          label: item.dealer_name,
          value: item,
        }))
      );
    }
  }, [modalItem?.dealer_api_key_secret_id, modalState]);

  const { mutate: getDealer, isLoading: isFetchingMasterDealer } = useMutation({
    mutationFn: async () => {
      const response = await master.getDealerList("limit=999");
      setDealers(
        response?.data?.data
          ?.filter((filter) => filter.dealer_api_key_secret_id === null)
          .map((item) => ({
            label: `${item?.dealer_name} - ${item?.dealer_code}`,
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
    if (!modalItem && modalState) {
      const uuid = uuidv4();
      setValue("api_key_secret", uuid);
    }
  }, [modalState]);

  const availableDealers = dealers.filter(
    (dealer) =>
      !selectedDealers.some(
        (selectedDealer) =>
          selectedDealer.value.dealer_id === dealer.value.dealer_id
      )
  );

  return (
    <Modal
      centered={true}
      activeModal={modalState}
      onClose={() => handleModal("modalMasterApiKey", false)}
      title={
        modalItem?.dealer_api_key_secret_id ? `Edit Api Key` : `Add New Api Key`
      }
      themeClass="bg-white dark:bg-slate-800 dark:border-b dark:border-slate-700"
      footerContent={
        <>
          <Button
            isLoading={isLoading}
            text={modalItem?.dealer_api_key_secret_id ? "Edit" : "Submit"}
            className="btn-dark py-2 px-4"
            onClick={handleSubmit(onSubmit)}
          />
        </>
      }
    >
      <div className="grid grid-cols-12 gap-5">
        {!modalItem ? (
          <div className="col-span-12">
            <SelectComponent
              isMulti
              label={"Pilih Dealer"}
              options={availableDealers}
              form={true}
              control={control}
              name={"dealer"}
              isClearable
              onMenuOpen={() => setIsMenuOpen(true)}
              isLoading={isFetchingMasterDealer}
              error={errors.dealer}
              closeMenuOnSelect={false}
            />
          </div>
        ) : null}
        <div className="col-span-12">
          <Textinput
            placeholder="Api Key Secret"
            label={"Api Key Secret"}
            description={"API KEY AUTO GENERATE BY SYSTEM"}
            register={register}
            disabled={true}
            name={"api_key_secret"}
            error={errors.api_key_secret}
          />
        </div>
        <div className="col-span-12">
          <Textinput
            placeholder="Url Dealer"
            label={"Url Dealer"}
            register={register}
            name={"api_key_name"}
            error={errors.api_key_name}
            description={
              "Contoh penamaan Url Dealer : http://xxx.xxx.xxx.xx:xxx atau https://xxxxxxx.net"
            }
            classDescription={"text-red-500 font-medium italic"}
          />
        </div>
        <div className="col-span-12">
          <Textinput
            placeholder="Base URL"
            label={"Base URL"}
            register={register}
            name={"base_url"}
            error={errors.base_url}
            description={
              "Contoh penamaan base url : http://xxx.xxx.xxx.xx:xxx atau https://xxxxxxx.net"
            }
            classDescription={"text-red-500 font-medium italic"}
          />
        </div>
        <div className="col-span-12">
          <Textinput
            placeholder="Database"
            label={"Database Name"}
            register={register}
            name={"database_name"}
            error={errors.database_name}
          />
        </div>
      </div>
    </Modal>
  );
};

export default ModalMasterApiKey;
