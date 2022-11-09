import { Backdrop, CircularProgress } from '@mui/material'
import React from 'react'

function Loading() {
  return (
    <div><Backdrop
    sx={{ color: '#fff', zIndex: 999}}
    open={true}
  >
    <CircularProgress color="inherit" />
  </Backdrop>
  </div>
  )
}

export default Loading