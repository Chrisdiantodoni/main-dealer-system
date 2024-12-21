import Swal from "sweetalert2";

export const SweetAlert = (status, text, title) => {
  switch (status) {
    case "error":
      Swal.fire({
        text: text,
        icon: "error",
        title: title,
      });
      break;
    case "warning":
      Swal.fire({
        text: text,
        icon: "warning",
        title: title,
      });
      break;

    case "success":
      Swal.fire({
        text: text,
        icon: "success",
        title: title,
      });
      break;
    default:
      break;
  }
};
