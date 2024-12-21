import createStore from "@/context";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import Textinput from "../ui/Textinput";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import user from "@/services/API/user";
import { SweetAlert } from "@/utils/Swal";

const ModalChangePassword = (props) => {
  const { handleModal, modal } = createStore();
  const users = JSON.parse(localStorage.getItem("user_md"));
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      old_password: "",
      new_password: "",
      new_password_confirmation: "",
    },
  });

  const { mutate, isLoading } = useMutation({
    mutationFn: async (data) => {
      data = {
        ...data,
      };
      const response = await user.changePassword(users?.user_id, data);
      return response;
    },
    onSuccess: (res) => {
      if (res?.meta?.code === 200) {
        SweetAlert("success", "Successfully Change Password", "Success");
        reset();
        handleModal("modalChangePasswordAuthenticated", false);
        handleModal("modalChangePassword", false);
      } else {
        SweetAlert("error", res?.response?.data?.meta?.message, "Error");
      }
    },
    onError: () => {
      handleModal("modalChangePassword", true);
    },
  });

  return (
    <Modal
      title="Change Password"
      activeModal={
        modal.modalChangePassword || modal.modalChangePasswordAuthenticated
      }
      centered={true}
      onClose={
        modal.modalChangePasswordAuthenticated
          ? () => handleModal("modalChangePasswordAuthenticated", false)
          : null
      }
      themeClass="bg-white dark:bg-slate-800 dark:border-b dark:border-slate-700"
      footerContent={
        <div className=" grid lg:grid-cols-12 grid-cols-1">
          <div>
            <Button
              text={"Submit"}
              isLoading={isLoading}
              className="btn-dark w-full lg:w-auto py-1"
              onClick={handleSubmit(mutate)}
            />
          </div>
        </div>
      }
    >
      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12">
          <Textinput
            label={"Old Password"}
            type={"password"}
            register={register}
            name={"old_password"}
            hasicon={true}
            placeholder="Old Password"
            error={errors.old_password}
          />
        </div>
        <div className="col-span-12">
          <Textinput
            label={"New Password"}
            type={"password"}
            register={register}
            name={"new_password"}
            hasicon={true}
            placeholder="New Password"
            error={errors.new_password}
          />
        </div>
        <div className="col-span-12">
          <Textinput
            label={"Confirm New Password"}
            register={register}
            name={"new_password_confirmation"}
            type={"password"}
            hasicon={true}
            placeholder="Confirm New Password"
            error={errors.new_password_confirmation}
          />
        </div>
      </div>
    </Modal>
  );
};

export default ModalChangePassword;
