import * as React from "react";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import { apiUrl } from "./constants/constants";
import RocketIcon from "@mui/icons-material/Rocket";
import YouTubeIcon from "@mui/icons-material/YouTube";
import LanguageIcon from "@mui/icons-material/Language";
import { Box } from "@mui/material";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

function BootstrapDialogTitle(props) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};
const wikiApiUrl = "https://en.wikipedia.org/w/api.php";
const pageUrl = "https://en.wikipedia.org/wiki/DemoSat";
const params = {
  action: "query",
  prop: "extracts",
  format: "json",
  explaintext: true,
  exsectionformat: "wiki",
  titles: pageUrl,
  redirects: true,
  formatversion: 2,
};
export default function CustomizedDialogs(props) {
  //   const [open, setOpen] = React.useState(props.dialog.open);
  const { dialog, setClose } = props;
  const [data, setData] = React.useState([]);
  React.useEffect(() => {
    let queryUrl = apiUrl;
    console.log("fetch response", dialog.flight_number, props.dialog);
    fetch(`${queryUrl}/${dialog.flight_number}`)
      .then((res) => res.json())
      .then((res) => {
        setData(res);
        console.log("fetch response", res);
      });
  }, [props.dialog]);
  const handleClickOpen = () => {
    // setOpen(true);
  };
  const handleClose = () => {
    setClose();
    // setOpen(false);
  };

  return (
    <div>
      <BootstrapDialog
        onClose={handleClose}
        fullWidth={true}
        maxWidth="sm"
        aria-labelledby="customized-dialog-title"
        open={props.dialog.open}
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleClose}
        >
          <div
            style={{
              height: 80,
              display: "flex",
            }}
          >
            <img
              src={data?.links?.mission_patch_small}
              style={{ height: "inherit", marginRight: 10 }}
            />
            <div
              style={{
                display: "flex",
                marginRight: 10,
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Typography sx={{ fontSize: 20, fontWeight: 500 }}>
                {data?.mission_name}
              </Typography>
              <Typography sx={{ fontSize: 14, fontWeight: 400 }}>
                {data?.rocket?.rocket_name}
              </Typography>
              <div style={{ display: "flex" }}>
                <RocketIcon
                  fontSize="small"
                  sx={{ cursor: "pointer" }}
                  onClick={() => window.open(data?.links?.article_link)}
                />
                <YouTubeIcon
                  fontSize="small"
                  sx={{ cursor: "pointer" }}
                  onClick={() => window.open(data?.links?.video_link)}
                />
                <LanguageIcon
                  fontSize="small"
                  sx={{ cursor: "pointer" }}
                  onClick={() => window.open(data?.links?.wikipedia)}
                />
              </div>
            </div>
            <Status status={data?.launch_success} />
          </div>
        </BootstrapDialogTitle>

        <DialogContent sx={{ minHeight: 80, mb: 3 }}>
          <Typography gutterBottom>
            A DemoSat is a boilerplate spacecraft used to test a carrier rocket
            without risking a real satellite on the launch. They are most
            commonly flown on the maiden flights of rockets, but have also been
            flown on return-to-flight missions after launch failures. Defunct
            satellites from cancelled programmes may be flown as DemoSats, for
            example the maiden flight of the Soyuz-2 rocket placed an obsolete
            Zenit-8 satellite onto a sub-orbital trajectory in order to test the
            rocket's performance.
          </Typography>
        </DialogContent>
        <Box sx={{ mb: 3 }}>
          <ContentList name={"Flight Number"} value={data?.flight_number} />
          <ContentList name={"Mission Name"} value={data?.mission_name} />
          <ContentList name={"Rocket Type"} value={data?.rocket?.rocket_type} />
          <ContentList name={"Rocket Name"} value={data?.rocket?.rocket_name} />
          <ContentList
            name={"Manufacturer"}
            value={data?.rocket?.second_stage?.payloads[0]?.manufacturer}
          />
          <ContentList
            name={"Nationality"}
            value={data?.rocket?.second_stage?.payloads[0]?.nationality}
          />
          <ContentList name={"Launch Date"} value={data?.launch_date_local} />
          <ContentList
            name={"Payload Type"}
            value={data?.rocket?.second_stage?.payloads[0]?.payload_type}
          />
          <ContentList
            name={"Orbit"}
            value={data?.rocket?.second_stage?.payloads[0]?.orbit}
          />
          <ContentList
            name={"Launch Site"}
            value={data?.launch_site?.site_name}
          />
        </Box>
      </BootstrapDialog>
    </div>
  );
}
export const Status = (props) => {
  return (
    <Box
      sx={{
        display: "flex",
        fontSize: 15,
        justifyContent: "center",
        alignItems: "center",
        height: 10,
        width: 90,
        padding: 1,
        backgroundColor: props.status
          ? "rgb(0, 255, 0,0.2)"
          : "rgb(255,165,0,0.2)",
        color: props.status ? "rgb(0, 100, 0,1)" : "rgb(255,165,0,1)",
        borderRadius: 20,
      }}
    >
      {props.status ? "Success" : "Failed"}
    </Box>
  );
};
const ContentList = (props) => {
  return (
    <DialogContent
      dividers
      sx={{
        display: "flex",
        // border: "0px 0px 0px 10px solid red",
        // borderBottom: 1,
      }}
    >
      <Typography sx={{ flex: 1 }}>{props.name}</Typography>
      <Typography sx={{ flex: 1 }}>{props.value}</Typography>
    </DialogContent>
  );
};
