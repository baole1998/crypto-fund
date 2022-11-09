import {
    Button,
    Modal,
  } from '@mui/material';
  import { Box } from '@mui/system';
  import React from 'react';
  import CloseIcon from '@mui/icons-material/Close';
  import './styles.scss';
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
  interface PropModalCommon {
    onHandleClose: () => void,
    onConfirm: () => void,
    show: boolean,
    title: string,
    content: string,
  }
  const ModalCommon:React.FC<PropModalCommon> = (props) => {
    const {
      onHandleClose,
      onConfirm,
      show,
      title,
      content,
    } = props;
  
    return (
      <div>
        <Modal
          open={show}
          onClose={() => onHandleClose()}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          className="add-or-edit-modal"
        >
            <Box sx={style} className="content">
              <div className="header-modal d-flex justify-content-between align-items-center">
                <div className="title">
                    {title}
                </div>
                <div className="close-icon" onClick={() => onHandleClose()}>
                  <CloseIcon />
                </div>
              </div>
              <div className="content-modal">
                <div style={{textAlign: 'center'}}>{content}</div>
              </div>
              <div className="footer-modal">
                <Button
                  variant="contained"
                  color="warning"
                  style={{ marginRight: 10 }}
                  onClick={() => onHandleClose()}
                >
                  Hủy
                </Button>
                <Button onClick={onConfirm} variant="contained" color="success">
                  Xác nhận
                </Button>
              </div>
            </Box>
        </Modal>
      </div>
    );
  }
  
  export default ModalCommon;
  