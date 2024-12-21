import { Controller } from "react-hook-form";
import { inputCurrency } from "@/utils/formatter";
import Textinput from "./Textinput";

export const ControllerInput = ({
  control,
  name = "",
  defaultValue,
  rules,
  type,
  disabled,
  maxLength,
}) => {
  const transformTextNumber = (value) => {
    return isNaN(value) ? "" : value;
  };

  const transformCurrencyNumber = (value) => {
    return isNaN(value) ? "" : inputCurrency(value) || "0";
  };

  return (
    <Controller
      defaultValue={defaultValue}
      control={control}
      name={name}
      rules={rules}
      render={({ field }) => (
        <Textinput
          className="form-control py-2"
          maxLength={maxLength}
          disabled={disabled}
          type={type}
          onChange={(e) => {
            if (type === "currency") {
              const output = parseFloat(e.target.value.replace(/\D/g, ""));
              console.log(output);
              field.onChange(isNaN(output) ? "" : output);
            } else if (type === "text-number") {
              const output = e.target.value.replace(/\D/g, "");
              field.onChange(transformTextNumber(output));
            }
          }}
        />
      )}
    />
  );
};
