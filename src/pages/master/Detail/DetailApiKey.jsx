import ModalMasterAddUserDealer from "@/components/Modal/Master/ModalMasterAddUserDealer";
import ModalMasterApiKey from "@/components/Modal/Master/ModalMasterApiKey";
import ModalAuthenticationPassword from "@/components/Modal/ModalAuthenticationPassword";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import createStore from "@/context";
import Table from "@/pages/table/Table";
import apiKey from "@/services/API/apiKey";
import shippingOrder from "@/services/API/shippingOrder";
import { dayJsFormatDate } from "@/utils/dayjs";
import { useEffect, useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const DetailApiKey = () => {
  const setTitle = createStore((state) => state.setTitle);
  const handleModal = createStore((state) => state.handleModal);
  const [isSuccessCopy, setIsSuccessCopy] = useState(false);

  const [visibleApiKey, setVisibleApiKey] = useState(false);

  const { id } = useParams();

  useEffect(() => {
    setTitle("Api Key Detail");
  }, []);

  const { data, isFetching } = useQuery({
    queryKey: ["getApiKeyById"],
    queryFn: async () => {
      const response = await apiKey.getApiKeyDetail(id);
      return response;
    },
  });

  const dataApiKey = data?.data;

  return (
    <div className="space-y-5">
      <ModalMasterApiKey />
      <ModalMasterAddUserDealer />
      <ModalAuthenticationPassword item={dataApiKey} />

      <Card title={`Api Key Detail`}>
        <div className="grid grid-cols-12 gap-5">
          <div className="col-span-12 lg:col-span-3">
            <p className="detail-label">URL Dealer</p>
          </div>
          <div className="col-span-12 lg:col-span-9 flex items-center gap-2">
            <p className="hidden lg:block">:</p>
            <p className="detail-value">
              <a
                target="__blank"
                href={dataApiKey?.api_key_name}
                className="btn-link text-primary-500"
              >
                {dataApiKey?.api_key_name}
              </a>
            </p>
          </div>
          <div className="col-span-12 lg:col-span-3 flex items-center">
            <p className="detail-label">API Key</p>
          </div>
          <div className="col-span-12 lg:col-span-9 flex items-center gap-2">
            <p className="hidden lg:block">:</p>
            <p className="detail-value">
              {visibleApiKey
                ? dataApiKey?.api_key_secret
                : "●●●●●●●●●●●●●●●●●●●●●●●●"}
            </p>
            <div className="flex justify-around items-center">
              <Button
                icon={visibleApiKey ? "mdi:eye" : "heroicons:eye-slash"}
                onClick={() => setVisibleApiKey(!visibleApiKey)}
                className="py-1 pr-0"
              />
              <CopyToClipboard
                text={dataApiKey?.api_key_secret}
                onCopy={() => {
                  toast.success("API key copied!!");
                  setIsSuccessCopy(true);
                  setTimeout(() => {
                    setIsSuccessCopy(false);
                  }, 500);
                }}
              >
                <Button
                  icon={
                    isSuccessCopy
                      ? "mdi:check"
                      : "material-symbols:content-copy"
                  }
                  text={isSuccessCopy ? "Copied!" : "Copy"}
                  className={"font-normal"}
                />
              </CopyToClipboard>
            </div>
          </div>
          <div className="col-span-12 lg:col-span-3">
            <p className="detail-label">Username</p>
          </div>
          <div className="col-span-12 lg:col-span-9 flex items-center gap-2">
            <p className="hidden lg:block">:</p>
            <p className="detail-value">
              {dataApiKey?.user_dealer?.username || "-"}
            </p>
          </div>
          <div className="col-span-12 lg:col-span-3">
            <p className="detail-label">Database</p>
          </div>
          <div className="col-span-12 lg:col-span-9 flex items-center gap-2">
            <p className="hidden lg:block">:</p>
            <p className="detail-value">{dataApiKey?.database_name}</p>
          </div>
          <div className="col-span-12 lg:col-span-3">
            <p className="detail-label">Base URL</p>
          </div>
          <div className="col-span-12 lg:col-span-9 flex items-center gap-2">
            <p className="hidden lg:block">:</p>
            <p className="detail-value">{dataApiKey?.base_url || "-"}</p>
          </div>
          <div className="col-span-12 lg:flex gap-x-2 space-y-2 lg:space-y-0">
            <Button
              text={"EDIT API KEY"}
              className="btn-warning py-1 w-full lg:w-auto"
              onClick={() => handleModal("modalAuthenticationPassword", true)}
            />
            {!dataApiKey?.user_dealer && (
              <Button
                text={"ADD USER"}
                className="btn-success py-1 w-full lg:w-auto"
                onClick={() =>
                  handleModal("modalMasterUserDealer", true, dataApiKey)
                }
              />
            )}
          </div>
        </div>
      </Card>
      <Card title={"List Dealer"}>
        <div className="grid grid-cols-12 gap-5">
          <div className="col-span-12">
            <Table
              isLoading={isFetching}
              data={dataApiKey?.dealer.map((item, index) => ({
                ...item,
                no: <div>{index + 1}</div>,
              }))}
              headers={headers}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

const headers = [
  {
    title: "No.",
    key: "no",
  },
  { title: "NAMA DEALER", key: "dealer_name" },
  { title: "KODE DEALER", key: "dealer_code" },
  { title: "TIPE", key: "dealer_type" },
];

export default DetailApiKey;
