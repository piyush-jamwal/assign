import { Status } from "../modal";

export const columns = [
  { field: "flight_number", headerName: "No", width: 90 },
  {
    field: "launch_date_utc",
    headerName: "Launched (UTC)",
    width: 150,
  },
  {
    field: "launch_site",
    headerName: "Location",
    width: 150,
    valueGetter: (params) => `${params.row?.launch_site.site_name}`,
  },
  {
    field: "mission_name",
    headerName: "Mission",
    type: "number",
    width: 110,
  },
  {
    headerName: "Orbit",
    description: "This column has a value getter and is not sortable.",

    width: 160,
    valueGetter: (params) =>
      `${params.row?.rocket?.second_stage?.payloads[0]?.orbit || ""} `,
  },
  {
    field: "launch_success",
    headerName: "Launch Status",
    description: "This column has a value getter and is not sortable.",

    width: 160,
    renderCell: (params) => {
      return <Status status={params?.row?.launch_success} />;
    },
  },
  {
    field: "rocket",
    headerName: "Rocket",
    description: "This column has a value getter and is not sortable.",
    width: 160,
    valueGetter: (params) => `${params.row?.rocket?.rocket_id || ""} `,
  },
];

export const filterConstants = {
  success_launches: "launch_success",
  failed_launches: "launch_failure",
  upcoming_launches: "upcoming",
  all_launches: "/",
  past_launches: "past",
};
export const options = {
  past_six_month: [
    { text: "All Launches", value: filterConstants.past_launches },
    { text: "Successful Launches", value: filterConstants.success_launches },
    { text: "Failed Launches", value: filterConstants.failed_launches },
  ],
  all: [
    { text: "All Launches", value: "/" },
    { text: "Upcoming Launches", value: filterConstants.upcoming_launches },
    { text: "Successful Launches", value: filterConstants.success_launches },
    { text: "Failed Launches", value: filterConstants.failed_launches },
  ],
};
export const apiUrl = "https://api.spacexdata.com/v3/launches";
