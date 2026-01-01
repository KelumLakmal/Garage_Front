import { Alert, Snackbar } from "@mui/material";
import React from "react";

const SnackbarCustom = ({
  open,
  snackbarClose,
  snackbarMessage,
}) => {
  if (!open) return null;

  return (
    <>
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={snackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={snackbarClose}
          severity="info"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default SnackbarCustom;
