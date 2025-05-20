import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

function Monitoring() {
  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Monitoramento
        </Typography>
        <Typography variant="body1">
          Esta página permite monitorar chamadas e atividades da plataforma VoIP em tempo real.
        </Typography>
      </Paper>
    </Box>
  );
}

export default Monitoring;
