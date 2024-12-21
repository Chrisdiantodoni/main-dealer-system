import { useEffect, useState } from "react";
import SelectComponent from "../ui/Select/Select";
import master from "@/services/API/master";
import { useMutation } from "react-query";
import queryString from "@/utils/queryString";
import { useDebounce } from "@/hooks/useDebounce";

const SelectMotor = ({
  value,
  onChange,
  error,
  include,
  type,
  documentType,
  control,
  form,
  name,
}) => {
  const [motors, setMotors] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const debouncedSearchValue = useDebounce(search, 500);

  const resultQueryString = queryString.stringified({
    limit: 15,
    q: debouncedSearchValue,
  });

  const { mutate: getMotor, isLoading: isFetchingMasterDealer } = useMutation({
    mutationFn: async () => {
      const response = await master.getMotorList(resultQueryString);
      setMotors(
        response?.data?.data?.map((item) => ({
          label: `${item?.motor_name}`,
          value: item,
        }))
      );
      return response;
    },
  });
  useEffect(() => {
    if (isMenuOpen || debouncedSearchValue) {
      getMotor();
    }
  }, [isMenuOpen, debouncedSearchValue]);
  return (
    <SelectComponent
      control={control}
      name={name}
      error={error}
      label={"Motor"}
      options={motors}
      form={form}
      //   value={value}
      //   onChange={onChange}
      isClearable
      onMenuOpen={() => setIsMenuOpen(true)}
      onInputChange={(inputValue) => {
        setSearch(inputValue);
        setMotors([]);
      }} // Update search state
      isLoading={isFetchingMasterDealer}
    />
  );
};

export default SelectMotor;
