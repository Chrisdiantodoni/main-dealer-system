import { useEffect, useState } from "react";
import SelectComponent from "../ui/Select/Select";
import master from "@/services/API/master";
import { useMutation } from "react-query";
import queryString from "@/utils/queryString";
import { useDebounce } from "@/hooks/useDebounce";

const SelectDistrict = ({
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
  const [districts, setDistricts] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const debouncedSearchValue = useDebounce(search, 500);

  const resultQueryString = queryString.stringified({
    limit: 15,
    "include[]": include?.map((item) => item),
    q: debouncedSearchValue,
  });

  const { mutate: getDistrict, isLoading: isFetchingMasterDealer } =
    useMutation({
      mutationFn: async () => {
        const response = await master.getMasterDistrictList(resultQueryString);
        setDistricts(
          response?.data?.data?.map((item) => ({
            label: `${item?.district_name}`,
            value: item,
          }))
        );
        return response;
      },
    });
  useEffect(() => {
    if (isMenuOpen || debouncedSearchValue) {
      getDistrict();
    }
  }, [isMenuOpen, debouncedSearchValue]);
  return (
    <SelectComponent
      name={name}
      control={control}
      error={error}
      label={"District"}
      options={districts}
      form={form}
      //   value={value}
      //   onChange={onChange}
      isClearable
      onMenuOpen={() => setIsMenuOpen(true)}
      onInputChange={(inputValue) => {
        setSearch(inputValue);
        setDistricts([]);
      }} // Update search state
      isLoading={isFetchingMasterDealer}
    />
  );
};

export default SelectDistrict;
