import { Box, FormControl, MenuItem, Select } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import Image from "./assets/SpaceX-Logo.png";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import {
  Outlet,
  unstable_HistoryRouter,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  apiUrl,
  columns,
  filterConstants,
  options,
} from "./constants/constants";
import FullScreenDialog from "./modal";
// const columns = [{ field: "mission_name", headerName: "ID", width: 90 }];

export const Dashboard = () => {
  const [data, setData] = useState([]);
  const [menuOptions, setMenuOptions] = useState(options.all);
  const [url, setUrl] = useState(apiUrl);
  const [dialog, setDialog] = useState({ open: false, flight_number: null });
  const [pastLaunch, setPastLaunch] = useState("all");
  const [filter, setFilter] = useState("/");
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  //   console.log(" query", queryParams.get("filter"));
  useEffect(() => {
    let queryUrl = url;
    const filterBy = queryParams.get("filter");
    const sortByHistory = queryParams.get("history");
    console.log("filter", filterBy);
    if (filterBy) {
      switch (filterBy) {
        case "launch_success":
          queryUrl = `${queryUrl}?id=true&launch_success=true`;
          break;
        case "launch_failure":
          queryUrl = `${queryUrl}?id=true&launch_success=false`;
          break;
        default:
          queryUrl = `${queryUrl}/${filterBy}?id=true`;
          break;
      }
      window.localStorage.setItem("filter", filterBy);
    } else {
      queryUrl += "?id=true";
    }
    console.log(" query url", queryUrl);
    fetch(`${queryUrl}`)
      .then((res) => res.json())
      .then((res) => {
        setData(res);
        // console.log(res.data);
      });
  }, [pastLaunch, filter]);
  const getRowId = (row) => row._id;
  const handleFilter1 = (event) => {
    switch (event.target.value) {
      case "all":
        setPastLaunch("all");
        setUrl(apiUrl);
        setMenuOptions(options.all);
        break;
      default:
        setPastLaunch("past");
        setUrl(`${apiUrl}/past`);
        setMenuOptions(options.past_six_month);
        navigate("?history=past");
        break;
    }
  };
  const handleChange = (event) => {
    let navigationUrl = "?";
    if (pastLaunch === filterConstants.past_launches) {
      navigationUrl = "?history=past&";
    }
    // console.log("value coming", event.target.value);
    switch (event.target.value) {
      case filterConstants.upcoming_launches:
        setFilter(filterConstants.upcoming_launches);
        navigate(`${navigationUrl}filter=upcoming`);
        break;
      case filterConstants.success_launches:
        setFilter(filterConstants.success_launches);
        navigate(`${navigationUrl}filter=launch_success`);
        break;
      case filterConstants.failed_launches:
        setFilter(filterConstants.failed_launches);
        navigate(`${navigationUrl}filter=launch_failure`);
        break;
      case filterConstants.past_launches:
        navigate("?history=past");
        break;
      default:
        setFilter(filterConstants.all_launches);
        navigate("/");
        break;
    }
  };
  const handleRowClick = (event) => {
    console.log("event value", event);
    setDialog({ flight_number: event.row.flight_number, open: true });
  };
  return (
    <>
      <nav style={{ color: "grey", boxShadow: "0px 2px 10px 1px" }}>
        <img src={Image} alt="spaceX logo" style={{ width: 200 }} />
      </nav>
      <Box sx={{ p: 1, pl: "10%", pr: "10%" }}>
        <section style={{ display: "flex", justifyContent: "space-between" }}>
          <FormControl variant="outlined" sx={{ m: 1, minWidth: 200 }}>
            <Select
              value={pastLaunch}
              onChange={handleFilter1}
              inputProps={{ "aria-label": "Without label" }}
              startAdornment={<CalendarTodayIcon></CalendarTodayIcon>}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="past">Past six months</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ m: 1, minWidth: 250 }}>
            <Select
              value={filter}
              onChange={handleChange}
              displayEmpty
              inputProps={{ "aria-label": "Without label" }}
              startAdornment={<FilterAltOutlinedIcon></FilterAltOutlinedIcon>}
            >
              {menuOptions.map((menuItems, index) => {
                return (
                  <MenuItem
                    key={`${menuItems.text}-${index}`}
                    value={menuItems.value}
                  >
                    {menuItems.text}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </section>
        {/* <Outlet /> */}
        <DataGrid
          rows={data}
          getRowId={getRowId}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 8,
              },
            },
          }}
          pageSizeOptions={[5]}
          checkboxSelection={false}
          disableRowSelectionOnClick={false}
          onRowClick={handleRowClick}
        />
        <FullScreenDialog
          dialog={dialog}
          setClose={() => setDialog({ open: false, flight_number: null })}
        />
      </Box>
    </>
  );
};
