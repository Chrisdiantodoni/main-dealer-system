import React, { useState } from "react";
import Textinput from "@/components/ui/Textinput";
import { Controller, useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import Checkbox from "@/components/ui/Checkbox";
import Button from "@/components/ui/Button";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLoginMutation } from "@/store/api/auth/authApiSlice";
import { setUser } from "@/store/api/auth/authSlice";
import { toast } from "react-toastify";
import { useMutation } from "react-query";
import authentication from "@/services/API/authentication";
import createStore from "@/context";
const schema = yup
  .object({
    username: yup.string().trim().required("Username is Required"),
    password: yup.string().trim().required("Password is Required"),
  })
  .required();
const LoginForm = () => {
  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(schema),
    // mode: "onBlur",
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const { handle } = createStore();

  const navigate = useNavigate();

  const { isLoading, mutate: onSubmit } = useMutation({
    mutationFn: async (data) => {
      // console.log({ data });
      const response = await authentication.login(data);
      // return;
      return response;
    },
    onSuccess: (res) => {
      if (res?.meta?.code === 200) {
        toast.success("Login Successful");
        localStorage.setItem("token_md", res?.data?.token);
        localStorage.setItem("user_md", JSON.stringify(res?.data?.user));
        localStorage.setItem(
          "user_main_dealers",
          JSON.stringify(res?.data?.user?.user_by_main_dealer)
        );
        handle("mainDealer", res?.data?.user?.user_by_main_dealer);
        navigate("/dashboard", { replace: true });
      } else {
        toast.error("Login Failed");
      }
    },
    onError: (error) => {
      toast.error("Login Failed");
      console.log(error);
    },
  });

  const [checked, setChecked] = useState(false);

  return (
    <form
      onSubmit={handleSubmit((data) => onSubmit(data))}
      className="space-y-4 "
    >
      <Textinput
        label="Username"
        register={register}
        name="username"
        type="text"
        error={errors.username}
        placeholder="Username"
      />
      <Textinput
        label="password"
        register={register}
        name="password"
        type="password"
        error={errors.password}
        placeholder="password"
        hasicon={true}
      />
      {/* <Controller
        name="password"
        control={control}
        render={({ field: { onChange, value } }) => (
          <Textinput
            label="password"
            // register={register}
            value={value}
            onChange={onChange}
            // name={"password"}
            type="password"
            error={errors.password}
            placeholder="password"
            hasicon={true}
          />
        )}
      /> */}
      <div className="flex justify-between">
        <Checkbox
          value={checked}
          onChange={() => setChecked(!checked)}
          label="Keep me signed in"
        />
        {/* <Link
          to="/forgot-password"
          className="text-sm text-slate-800 dark:text-slate-400 leading-6 font-medium"
        >
          Forgot Password?{" "}
        </Link> */}
      </div>

      <Button
        type="submit"
        text="Sign in"
        className="btn btn-dark block w-full text-center "
        isLoading={isLoading}
      />
    </form>
  );
};

export default LoginForm;
