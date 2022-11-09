import {
    Button,
    Modal,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Box } from '@mui/system';
import React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import '../ModalCommon/styles.scss';
const style = {
    position: 'absolute',
    top: '40%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: 1
};

const useStyles = makeStyles({
    modalContainer: {
        backgroundColor: 'red',
        '& button': {
            borderRadius: '5px',
            '&.cancel' : {
                backgroundColor: '#E2A300'
            },
            '&.delete' : {
                backgroundColor: '#C73636'
            }
        }

    }
});
interface PropModalDelete {
    onHandleClose: () => void,
    onConfirm: () => void,
    show: boolean,
    title: string,
    content: string,
}
const ModalDelete: React.FC<PropModalDelete> = (props) => {
    const styles = useStyles()
    const {
        onHandleClose,
        onConfirm,
        show,
        title,
        content,
    } = props;
    return (
        <div  >
            <Modal
                open={show}
                onClose={() => onHandleClose()}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                className="add-or-edit-modal"
            >
                <Box sx={style} className={'content ' + styles.modalContainer} >
                    <div className="header-modal d-flex justify-content-between align-items-center">
                        <div className="title">
                            {title}
                        </div>
                        <div className="close-icon" onClick={() => onHandleClose()}>
                            <CloseIcon />
                        </div>
                    </div>
                    <div className="content-modal">
                        <div style={{ textAlign: 'center' }}>{content}</div>
                    </div>
                    <div className="footer-modal" >
                        <Button
                            variant="contained"
                            className = "cancel"
                            style={{ marginRight: 10 }}
                            onClick={() => onHandleClose()}
                        >
                            Hủy
                        </Button>
                        <Button onClick={onConfirm} variant="contained" className="delete">
                            Xóa
                        </Button>
                    </div>
                </Box>
            </Modal>
        </div>
    );
}

export default ModalDelete;
