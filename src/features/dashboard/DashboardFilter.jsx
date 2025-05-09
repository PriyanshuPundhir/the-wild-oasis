import Filter from "../../ui/Filter";
import Spinner from "../../ui/Spinner";
import useRecentBookings from "./useRecentBookings";

function DashboardFilter() {
  return (
    <Filter
      filterfield="last"
      options={[
        { value: "7", label: "Last 7 days" },
        { value: "30", label: "Last 30 days" },
        { value: "90", label: "Last 90 days" },
      ]}
    />
  );
}

export default DashboardFilter;
