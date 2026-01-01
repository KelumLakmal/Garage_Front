import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import React from 'react'

const ConfirmDialog = ({
    isOpen,
    title,
    message,
    onConfirm,
    onClose
}) => {
    if (!isOpen) return null;

    return (
        <>
            <Dialog
                open={isOpen}
                onClose={onClose}
                disableRestoreFocus
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {message}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="outlined"
                        color="success"
                        onClick={onConfirm}
                        autoFocus
                    >
                        Yes
                    </Button>
                    <Button
                        variant="outlined"
                        color="warning"
                        onClick={onClose}
                    >
                        No
                    </Button>
                </DialogActions>
            </Dialog>
        </>

    );

}

export default ConfirmDialog