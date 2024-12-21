import { useEffect, useState } from "react";
import SelectComponent from "../ui/Select/Select";
import master from "@/services/API/master";
import { useMutation } from "react-query";
import queryString from "@/utils/queryString";

const SelectDealer = ({
  value,
  onChange,
  error,
  include,
  type,
  documentType,
}) => {
  const [dealers, setDealers] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const resultQueryString = queryString.stringified({
    limit: 999,
    "include[]": include?.map((item) => item),
  });

  const { mutate: getDealer, isLoading: isFetchingMasterDealer } = useMutation({
    mutationFn: async () => {
      const response = await master.getDealerList(resultQueryString);
      let dealer_data;
      if (type === "faktur-delivery") {
        dealer_data = response?.data?.data
          ?.map((filter) => ({
            ...filter,
            faktur_received: filter.faktur_received.filter(
              (faktur) =>
                faktur.is_faktur_delivered === 0 &&
                faktur?.faktur_received_status === "received"
            ),
          }))
          .filter((filter) => filter.faktur_received.length > 0);
      } else if (type === "delivery-dealer") {
        dealer_data = response?.data?.data
          ?.map((item) => {
            return { ...item };
            // if (type === "no_plat" && item?.plat) {
            //   return { ...item };
            // }
            // if (type === "stnk" && item?.stnk) {
            //   return { ...item };
            // }
            // if (type === "bpkb" && item?.bpkb) {
            //   return { ...item };
            // }
            // return null; // If the item doesn't match the type, return null
          })
          .filter((filter) => filter.samsat_dev_unit.length > 0);
      } else {
        dealer_data = response?.data?.data;
      }
      setDealers(
        dealer_data?.map((item) => ({
          label: `${item?.dealer_name} - ${item?.dealer_code}`,
          value: item,
        }))
      );
      return response;
    },
  });
  useEffect(() => {
    if ((isMenuOpen && !documentType) || documentType) {
      getDealer();
    }
  }, [isMenuOpen, documentType]);
  return (
    <SelectComponent
      error={error}
      label={"Dealer"}
      options={dealers}
      form={false}
      value={value}
      onChange={onChange}
      isClearable
      onMenuOpen={() => setIsMenuOpen(true)}
      isLoading={isFetchingMasterDealer}
    />
  );
};

export default SelectDealer;
