import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

function Extensions() {
  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Gerenciamento de Ramais
        </Typography>
        <Typography variant="body1">
          Esta página permite gerenciar os ramais da plataforma VoIP.
        </Typography>
      </Paper>
    </Box>
  );
}

export default Extensions;
