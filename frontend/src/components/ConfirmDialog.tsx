import React from "react";

import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@mui/material";


interface DialogProps{
    open: boolean
    title?: string,
    confirmText?: string,
    cancelText?: string,
    content?: string,
    onClose: () => void,
    onConfirm: () => void,
}

export const ConfirmDialog: React.FC<DialogProps> = ({
    open,
    title = "Are you sure?",
    confirmText = "Confirm",
    cancelText = "Cancel",
    content = "Are you sure you want to perform this action?",
    onClose,
    onConfirm
}) =>{
    return (
    <Dialog open={open} onClose = {onClose} >
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {content}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>{cancelText}</Button>
          <Button onClick={onConfirm} color="error">
            {confirmText}
          </Button>
        </DialogActions>
      </Dialog>
      
);
}