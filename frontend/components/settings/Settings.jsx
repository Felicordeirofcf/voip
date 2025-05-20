import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

function Settings() {
  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Configurações
        </Typography>
        <Typography variant="body1">
          Esta página permite ajustar as configurações da plataforma VoIP.
        </Typography>
      </Paper>
    </Box>
  );
}

export default Settings;
