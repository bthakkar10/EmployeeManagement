import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";

interface AlertDialogProps {
    open: boolean;
    title: string;
    message: string;
    onClose: () => void;
    onDelete: (id: any) => void;
}

const AlertDialog: React.FC<AlertDialogProps> = ({ open, title, message, onClose, onDelete }) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>{message}</DialogContent>
            <DialogActions>
                <Button onClick={onDelete} color="error">
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AlertDialog;
