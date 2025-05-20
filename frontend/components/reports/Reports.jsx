import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

function Reports() {
  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Relatórios
        </Typography>
        <Typography variant="body1">
          Esta página permite gerar e visualizar relatórios de uso da plataforma VoIP.
        </Typography>
      </Paper>
    </Box>
  );
}

export default Reports;
