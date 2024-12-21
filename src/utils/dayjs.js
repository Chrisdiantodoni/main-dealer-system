import dayjs from "dayjs";

export const dayJsFormatDate = (day) => {
  if (day) {
    return dayjs(day).format("DD MMM YYYY") || "-";
  } else {
    return "-";
  }
};

export const dayjsFormatInputDate = (day) => {
  return dayjs(day).format("YYYY-MM-DD");
};

export const dayjsFormatDateTime = (day) => {
  return dayjs(day).format("DD MMM YYYY HH:mm:ss");
};

export const disabledDate = (current) => {
  return current && current > dayjs().endOf("day");
};
