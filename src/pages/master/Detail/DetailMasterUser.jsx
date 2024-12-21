import ModalUser from "@/components/Modal/Master/ModalUser";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import SelectComponent from "@/components/ui/Select/Select";
import createStore from "@/context";
import Table from "@/pages/table/Table";
import apiKey from "@/services/API/apiKey";
import shippingOrder from "@/services/API/shippingOrder";
import user from "@/services/API/user";
import { SweetAlert } from "@/utils/Swal";
import { dayJsFormatDate } from "@/utils/dayjs";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";

const DetailApiKey = () => {
  const setTitle = createStore((state) => state.setTitle);
  const handleModal = createStore((state) => state.handleModal);

  const { id } = useParams();

  useEffect(() => {
    setTitle("Detail User");
  }, []);

  const { data, refetch, isFetching } = useQuery({
    queryKey: ["getUserById"],
    queryFn: async () => {
      const response = await user.getDetailUser(id);
      return response;
    },
  });

  const { mutate: resetPassword, isLoading } = useMutation({
    mutationFn: async () => {
      const response = await user.resetPassword(id);
      return response;
    },
    onSuccess: (res) => {
      if (res?.meta?.code) {
        SweetAlert("success", "Sucessfully Reset Password User", "Success");
        refetch();
      } else {
        SweetAlert("error", "Failed Reset Password User", "Error");
      }
    },
    onError: (res) => {
      SweetAlert("error", res?.meta?.message, "Error");
    },
  });
  const { mutate: changeStatus, isLoading: isLoadingStatus } = useMutation({
    mutationFn: async () => {
      const response = await user.changeStatus(id);
      return response;
    },
    onSuccess: (res) => {
      if (res?.meta?.code) {
        SweetAlert("success", "Sucessfully Deactivate User", "Success");
        refetch();
      } else {
        SweetAlert("error", "Failed Deactivate User", "Error");
      }
    },
    onError: (res) => {
      SweetAlert("error", res?.meta?.message, "Error");
    },
  });

  const users = data?.data;

  return (
    <div className="space-y-5">
      <Card title={`Detail User`}>
        <ModalUser />

        <div className="grid grid-cols-12 gap-5">
          <div className="col-span-12 lg:col-span-3">
            <p className="detail-label">Username</p>
          </div>
          <div className="col-span-12 lg:col-span-9 flex items-center gap-2">
            <p className="hidden lg:block">:</p>
            <p className="detail-value">{users?.username}</p>
          </div>
          <div className="col-span-12 lg:col-span-3">
            <p className="detail-label">Name</p>
          </div>

          <div className="col-span-12 lg:col-span-9 flex items-center gap-2">
            <p className="hidden lg:block">:</p>
            <p className="detail-value">{users?.name}</p>
          </div>
          <div className="col-span-12 lg:col-span-3">
            <p className="detail-label">Main Dealer</p>
          </div>

          <div className="col-span-12 lg:col-span-9 flex items-center gap-2">
            <p className="hidden lg:block">:</p>
            <p className="w-full">
              <SelectComponent
                isDisabled={true}
                isMulti
                value={users?.main_dealers?.map((item) => ({
                  label: item?.main_dealer?.main_dealer_name,
                  value: item,
                }))}
              />
            </p>
          </div>

          <div className="col-span-12 lg:flex gap-x-2 space-y-2 lg:space-y-0">
            <Button
              text={"EDIT USER"}
              className="btn-info py-1 w-full lg:w-auto"
              onClick={() => handleModal("modalMasterAddUser", true, users)}
            />
            <Button
              text={"RESET PASSWORD"}
              isLoading={isLoading}
              className="btn-warning py-1 w-full lg:w-auto"
              onClick={() =>
                Swal.fire({
                  title: "Apakah Anda Yakin?",
                  icon: "info",
                  showCancelButton: true,
                  cancelButtonText: "NO",
                  cancelButtonColor: "bg-danger",
                  confirmButtonText: "YES",
                  confirmButtonColor: "bg-success",
                }).then((result) => {
                  if (result.isConfirmed) {
                    resetPassword();
                  }
                })
              }
            />
            <Button
              text={
                users?.user_status === "active"
                  ? "DEACTIVATE USER"
                  : "ACTIVATE USER"
              }
              isLoading={isLoadingStatus}
              className={`${
                users?.user_status === "active" ? "btn-danger" : "btn-success"
              } py-1 w-full lg:w-auto`}
              onClick={() =>
                Swal.fire({
                  title: "Apakah Anda Yakin?",
                  icon: "info",
                  showCancelButton: true,
                  cancelButtonText: "NO",
                  cancelButtonColor: "bg-danger",
                  confirmButtonText: "YES",
                  confirmButtonColor: "bg-success",
                }).then((result) => {
                  if (result.isConfirmed) {
                    changeStatus();
                  }
                })
              }
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DetailApiKey;
