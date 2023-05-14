import {
  Box,
  CircularProgress,
  FormControl,
  MenuItem,
  Select,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { DataGrid, GridOverlay } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import Image from "./assets/SpaceX-Logo.png";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import { useLocation, useNavigate } from "react-router-dom";
import { apiUrl, filterConstants, options } from "./constants/constants";
import FullScreenDialog from "./modal";
import { Table } from "./table";

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
  console.log("query parameters", queryParams.get("history"));
  useEffect(() => {
    let queryUrl = url;
    const filterBy = queryParams.get("filter");
    const sortByHistory = queryParams.get("history");

    if (filterBy && sortByHistory) {
      setPastLaunch(sortByHistory);
      setFilter(filterBy);
      setMenuOptions(options.past_six_month);
    } else if (filterBy && !sortByHistory) {
      setPastLaunch("all");
      setFilter(filterBy);
      setMenuOptions(options.all);
    } else if (sortByHistory) {
      setPastLaunch(sortByHistory);
      setFilter(sortByHistory);
      setMenuOptions(options.past_six_month);
    }
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

    fetch(`${queryUrl}`)
      .then((res) => res.json())
      .then((res) => {
        setData(res);
      })
      .catch((err) => console.log(err));
  }, [pastLaunch, filter]);

  const handleFilter1 = (event) => {
    switch (event.target.value) {
      case "all":
        setPastLaunch("all");
        setUrl(apiUrl);
        setFilter("/");
        setMenuOptions(options.all);
        navigate("/");
        break;
      default:
        setPastLaunch("past");
        setUrl(`${apiUrl}/past`);
        setFilter(filterConstants.past_launches);
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
        setFilter(filterConstants.past_launches);
        navigate("?history=past");
        break;
      default:
        setFilter(filterConstants.all_launches);
        navigate("/");
        break;
    }
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

        <Table rows={data} setDialog={setDialog} />
        <FullScreenDialog
          dialog={dialog}
          setClose={() => setDialog({ open: false, flight_number: null })}
        />
      </Box>
    </>
  );
};
