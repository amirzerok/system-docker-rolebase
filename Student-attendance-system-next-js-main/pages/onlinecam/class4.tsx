import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const DVRStreamView: React.FC = () => {
  const streamUrl = "http://your-dvr-address/path-to-stream.m3u8"; // لینک استریم HLS

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        height: '100vh',
        backgroundColor: '#f5f5f5',
        padding: 2,
        paddingTop: 4,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 3,
          textAlign: 'center',
          width: '100%',
          maxWidth: 600,
          backgroundColor: '#ffffff',
        }}
      >
        <Typography variant="h5" gutterBottom>
          DVR Camera Viewer 4
        </Typography>
        <video
          controls
          autoPlay
          style={{
            width: '100%',
            borderRadius: '8px',
            border: '2px solid #1976d2',
          }}
        >
          <source src={streamUrl} type="application/x-mpegURL" />
          Your browser does not support the video tag.
        </video>
      </Paper>
    </Box>
  );
};

export default DVRStreamView;
