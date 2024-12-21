export const statusActive = (status) => {
  switch (status) {
    case "active":
      return <span className="bg-success ">{status}</span>;
    case "inactive":
      return <span>{status}</span>;
    default:
      break;
  }
};
