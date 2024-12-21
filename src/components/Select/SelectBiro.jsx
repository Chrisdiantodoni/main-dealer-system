import { useEffect, useState } from "react";
import SelectComponent from "../ui/Select/Select";
import master from "@/services/API/master";
import { useMutation } from "react-query";

const SelectBiro = ({ value, onChange, error, type }) => {
  const [biros, setBiros] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { mutate: getBiros, isLoading: isFetchingMasterBiros } = useMutation({
    mutationFn: async () => {
      const response = await master.getBirolist(
        `limit=999&include[]=samsat_delivered.samsat_dev_unit`
      );
      let data;
      // let data = response?.data?.data;
      if (type === "receive") {
        data = response?.data?.data
          ?.map((filter) => ({
            ...filter,
            samsat_delivered: filter?.samsat_delivered
              ?.map((delivery) => ({
                ...delivery,
                samsat_dev_unit: delivery?.samsat_dev_unit?.filter(
                  (unit) =>
                    !unit.number_receive_bpkb ||
                    !unit.number_receive_stnk ||
                    !unit.number_receive_stnk
                ),
              }))
              .filter(
                (delivery) =>
                  delivery?.samsat_dev_unit?.length > 0 &&
                  delivery?.samsat_dev_status === "confirm"
              ),
          }))
          .filter((filter) => filter?.samsat_delivered?.length > 0);
      } else {
        data = response?.data?.data;
      }
      setBiros(
        data?.map((item) => ({
          label: item?.biro_name,
          value: item,
        }))
      );
      return response;
    },
  });
  useEffect(() => {
    if (isMenuOpen) {
      getBiros();
    }
  }, [isMenuOpen]);

  return (
    <SelectComponent
      error={error}
      label={"Biro"}
      options={biros}
      form={false}
      value={value}
      onChange={onChange}
      isClearable
      onMenuOpen={() => setIsMenuOpen(true)}
      isLoading={isFetchingMasterBiros}
    />
  );
};

export default SelectBiro;
