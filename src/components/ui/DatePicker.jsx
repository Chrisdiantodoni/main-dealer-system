import { Controller } from "react-hook-form";
import Flatpickr from "react-flatpickr";
import FormGroup from "./FormGroup";

const DatePicker = ({
  name,
  control,
  label,
  error,
  form = false,
  value = new Date(),
  onChange = () => {},
}) => {
  return form ? (
    <FormGroup label={label} id="default-picker" error={error}>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value } }) => (
          <Flatpickr
            className="date-control py-2"
            id="default-picker"
            value={value}
            onChange={onChange}
            options={{
              altInput: true,
              altInputClass: "date-control py-2",
              altFormat: "F j, Y",
              dateFormat: "Y-m-d",
            }}
          />
        )}
      />
    </FormGroup>
  ) : (
    <FormGroup label={label} id="default-picker">
      <Flatpickr
        className="date-control py-2"
        id="default-picker"
        value={value}
        readOnly={false}
        onChange={onChange}
        options={{
          altInput: true,
          altInputClass: "date-control py-2",
          altFormat: "F j, Y",
          dateFormat: "Y-m-d",
        }}
      />
    </FormGroup>
  );
};
export default DatePicker;
