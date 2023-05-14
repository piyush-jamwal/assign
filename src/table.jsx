import { makeStyles } from "@mui/styles";
import { DataGrid, GridOverlay } from "@mui/x-data-grid";
import { columns } from "./constants/constants";

const useStyles = makeStyles({
  overlay: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});
const NoRowsOverlay = () => {
  const classes = useStyles();
  return (
    <GridOverlay className={classes.overlay}>
      <div>No results found</div>
    </GridOverlay>
  );
};
export const Table = (props) => {
  const { setDialog, rows } = props;
  const getRowId = (row) => row._id;
  const handleRowClick = (event) => {
    setDialog({ flight_number: event.row.flight_number, open: true });
  };
  return (
    <>
      <DataGrid
        sx={{ height: "50vh" }}
        rows={rows}
        getRowId={getRowId}
        loading={rows.length === 0 ? true : false}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 8,
            },
          },
        }}
        hideFooterSelectedRowCount
        disableColumnMenu
        components={{
          noRowsOverlay: NoRowsOverlay,
        }}
        pageSizeOptions={[5]}
        checkboxSelection={false}
        disableRowSelectionOnClick={false}
        onRowClick={handleRowClick}
      />
    </>
  );
};
