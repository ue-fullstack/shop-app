import React from 'react';
import { Box, Fab, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useAppContext } from '../context';

type Props = {
    handleEdit: () => void;
    handleDelete: () => void;
};

const ActionButtons = ({ handleEdit, handleDelete }: Props) => {
    const [openDialog, setOpenDialog] = React.useState(false);
    const { t } = useAppContext();

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleConfirmDelete = () => {
        handleDelete();
        handleCloseDialog();
    };

    return (
        <>
            <Box sx={{ position: 'absolute', top: 10, right: 10, display: 'flex', gap: 1 }}>
                <Fab size="small" color="primary" aria-label="edit" onClick={handleEdit}>
                    <EditIcon />
                </Fab>
                <Fab size="small" color="error" aria-label="delete" onClick={handleOpenDialog}>
                    <DeleteIcon />
                </Fab>
            </Box>

            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{t('confirmDelete')}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {t('deleteConfirmation')}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">{t('cancel')}</Button>
                    <Button onClick={handleConfirmDelete} autoFocus color="error">
                        {t('confirm')}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default ActionButtons;
