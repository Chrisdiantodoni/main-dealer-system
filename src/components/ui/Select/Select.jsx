import React, { Fragment } from "react";
import Icon from "@/components/ui/Icon";
import { Controller } from "react-hook-form";
import Select from "react-select";

const styles = {
  option: (provided, state) => ({
    ...provided,
    fontSize: "14px",
  }),
  input: (base) => ({
    ...base,
    "input:focus": {
      boxShadow: "none",
    },
  }),
  menu: (provided) => ({
    ...provided,
    zIndex: 9999, // Set your desired z-index value here
  }),
  // Optionally, adjust the z-index for other related components if needed
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
};

const SelectComponent = ({
  value,
  onChange,
  options,
  label,
  placeholder,
  msgTooltip,
  error,
  form,
  name,
  control,
  isClearable = true,
  className = "",
  classLabel = "form-label",
  classGroup = "",
  ...rest
}) => {
  return form ? (
    <div className={`${error ? "has-error" : ""} ${classGroup}`}>
      {label && (
        <label htmlFor={name} className={`block capitalize ${classLabel}`}>
          {label}
        </label>
      )}
      <div className={`relative ${className} z-[999999]`}>
        <Controller
          control={control}
          name={name}
          render={({ field: { onChange, value } }) => (
            <Select
              {...rest}
              className={`${error ? " has-error" : " "} appearance-none `}
              classNamePrefix="select"
              isClearable={isClearable}
              placeholder={placeholder}
              onChange={onChange}
              value={value}
              options={options}
              styles={styles}
              menuPortalTarget={document.body} // If you need the menu to be rendered in the portal
            />
          )}
        />
        <div className="flex text-xl absolute right-[30px] top-1/2 -translate-y-1/2 space-x-1">
          {error && (
            <span className="text-danger-500">
              <Icon icon="heroicons-outline:information-circle" />
            </span>
          )}
        </div>
      </div>
      {error && (
        <div
          className={`mt-2 ${
            msgTooltip
              ? " inline-block bg-danger-500 text-white text-[10px] px-2 py-1 rounded"
              : " text-danger-500 block text-sm"
          }`}
        >
          {error?.message || error}
        </div>
      )}
    </div>
  ) : (
    <div className={`relative ${className}`}>
      {label && (
        <label htmlFor={name} className={`block capitalize ${classLabel}`}>
          {label}
        </label>
      )}
      <Select
        {...rest}
        className="react-select"
        classNamePrefix="select"
        isClearable={isClearable}
        placeholder={placeholder}
        onChange={onChange}
        value={value}
        options={options}
        styles={styles}
        menuPortalTarget={document.body} // If you need the menu to be rendered in the portal
      />
      {error && (
        <div
          className={`mt-2 ${
            msgTooltip
              ? " inline-block bg-danger-500 text-white text-[10px] px-2 py-1 rounded"
              : " text-danger-500 block text-sm"
          }`}
        >
          {error?.message || error}
        </div>
      )}
    </div>
  );
};

export default SelectComponent;
