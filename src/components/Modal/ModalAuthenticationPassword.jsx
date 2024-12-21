import createStore from "@/context";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import Textinput from "../ui/Textinput";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import user from "@/services/API/user";
import { SweetAlert } from "@/utils/Swal";
import { toast } from "react-toastify";
import authentication from "@/services/API/authentication";

const ModalAuthenticationPassword = ({ item }) => {
  const { handleModal, modal } = createStore();
  const users = JSON.parse(localStorage.getItem("user_md"));
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      password: "",
    },
  });

  const { mutate, isLoading } = useMutation({
    mutationFn: async (data) => {
      data = {
        ...data,
      };
      const response = await authentication.passwordAuthentication(data);
      return response;
    },
    onSuccess: (res) => {
      if (res?.meta?.code === 200) {
        toast.success("Success");
        reset();
        handleModal("modalAuthenticationPassword", false);
        handleModal("modalMasterApiKey", true, item);
      } else {
        toast.error("error", res?.response?.data?.meta?.message, "Error");
      }
    },
    onError: () => {
      toast.error("Error");
    },
  });

  return (
    <Modal
      title="Password Authentication"
      activeModal={modal.modalAuthenticationPassword}
      centered={true}
      onClose={() => handleModal("modalAuthenticationPassword", false)}
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
            label={"Password"}
            register={register}
            name={"password"}
            type={"password"}
            hasicon={true}
            placeholder="password"
            error={errors.password}
          />
        </div>
      </div>
    </Modal>
  );
};

export default ModalAuthenticationPassword;
