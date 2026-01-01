import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

const DialogCustom = ({
  title,
  isOpen,
  pendingValues,
  module_ActionName,
  handleConfirmClose,
  confirmYes,
}) => {
  if (!isOpen) return null;

  return (
    <>
      <Dialog
        open={isOpen}
        onClose={handleConfirmClose}
        disableRestoreFocus
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure, you want to {module_ActionName + ": "}
            <b>{pendingValues?.name}</b>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            color="success"
            onClick={confirmYes}
            autoFocus
          >
            Yes
          </Button>
          <Button
            variant="outlined"
            color="warning"
            onClick={handleConfirmClose}
          >
            No
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DialogCustom;
