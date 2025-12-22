import React from 'react';
import { motion } from 'framer-motion';
import { 
  Box, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Avatar, 
  Chip,
  useTheme,
  ThemeProvider,
} from '@mui/material';
import { 
  Work as WorkIcon,
  AccessTime as TimeIcon,
  Checklist as ChecklistIcon,
  EmojiEvents as RankIcon
} from '@mui/icons-material';
import { useGetStatusValidateur, ValidateurStatus } from '../Services/Home/useGetValidateur';
import SpinnerLoader from '../Ui/Spinner';
import GetAgenceBYcode from '../Lib/CustomFunction';



type ProfessionalDashboardProps ={
  data: ValidateurStatus[];
}

// Create a custom theme
// const theme = createTheme({
//   palette: {
//     primary: {
//       main: '#1976d2',
//     },
//     secondary: {
//       main: '#dc004e',
//     },
//     background: {
//       default: '#f5f7fa',
//       paper: '#ffffff',
//     },
//   },
//   typography: {
//     fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
//     h4: {
//       fontWeight: 600,
//     },
//   },
// });

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
};

const ProfessionalDashboard: React.FC<ProfessionalDashboardProps> = ({ data }) => {
  const theme = useTheme();

  // Function to format time (convert seconds to minutes:seconds)
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}m ${secs}s`;
  };

  // Function to get color based on rank
  const getRankColor = (rank: number): string => {
    switch (rank) {
      case 1: return '#ffd700'; // Gold
      case 2: return '#c0c0c0'; // Silver
      case 3: return '#cd7f32'; // Bronze
      default: return theme.palette.grey[300];
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ p: 3 }}>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Header */}
          <motion.div variants={itemVariants}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h4" component="h1" gutterBottom>
                {/* Validation Performance Dashboard */}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Analyse des temps de validation par validateur
              </Typography>
            </Box>
          </motion.div>

          {/* Stats Cards */}
          <motion.div variants={itemVariants}>
            <Box sx={{ display: 'flex', gap: 3, mb: 4, flexWrap: 'wrap' }}>
              <Paper sx={{ p: 3, flex: 1, minWidth: 200 }} elevation={3}>
                <Typography variant="h6" color="text.secondary">
                  Total Validateurs
                </Typography>
                <Typography variant="h4">{data.length}</Typography>
              </Paper>
              
              <Paper sx={{ p: 3, flex: 1, minWidth: 200 }} elevation={3}>
                <Typography variant="h6" color="text.secondary">
                  Validations Totales
                </Typography>
                <Typography variant="h4">
                  {data?.reduce((sum, item) => sum + item.nb_validations, 0)}
                </Typography>
              </Paper>

                <Paper sx={{ p: 3, flex: 1, minWidth: 200 }} elevation={3}>
                <Typography variant="h6" color="text.secondary">
                  Rejet Totales
                </Typography>
                <Typography variant="h4">
                  {data?.reduce((sum, item) => sum + item.nb_rejete, 0)}
                </Typography>
              </Paper>
              
              <Paper sx={{ p: 3, flex: 1, minWidth: 200 }} elevation={3}>
                <Typography variant="h6" color="text.secondary">
                  Temps Moyen
                </Typography>
                <Typography variant="h4">
                  {formatTime(data?.reduce((sum, item) => sum + item.moyenne_temps_validation, 0) / data.length)}
                </Typography>
              </Paper>
            </Box>
          </motion.div>

          {/* Data Table */}
          <motion.div variants={itemVariants}>
            <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: theme.palette.grey[100] }}>
                      <TableCell sx={{ fontWeight: 'bold' }}>Rang</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Validateur</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Poste</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Agence</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }} align="right">
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                          <TimeIcon sx={{ mr: 1 }} />
                          Temps Moyen
                        </Box>
                      </TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }} align="right">
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                          <ChecklistIcon sx={{ mr: 1 }} />
                          Validations
                        </Box>
                      </TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }} align="right">
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                          <ChecklistIcon sx={{ mr: 1 }} />
                          Rejets
                        </Box>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.map((row) => (
                      <motion.tr
                        key={row.validateur}
                        variants={itemVariants}
                        whileHover={{ scale: 1.01, boxShadow: theme.shadows[3] }}
                      >
                        <TableCell>
                          <Chip
                            icon={<RankIcon />}
                            label={row.rang}
                            sx={{
                              backgroundColor: getRankColor(row.rang),
                              fontWeight: 'bold',
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar sx={{ mr: 2, bgcolor: theme.palette.primary.main }}>
                              {row.nom.charAt(0)}{row.prenom.charAt(0)}
                            </Avatar>
                            <Box>
                              <Typography variant="body1" fontWeight="medium">
                                {row.nom} {row.prenom}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Username: {row.validateur}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={<WorkIcon />}
                            label={row.poste}
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip label={`Agence ${GetAgenceBYcode(row.agnece)}`} />
                        </TableCell>
                        <TableCell align="right">
                          <Typography fontWeight="medium">
                            {formatTime(row.moyenne_temps_validation)}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography fontWeight="medium">
                            {row.nb_validations}
                          </Typography>
                        </TableCell>
                         <TableCell align="right">
                          <Typography fontWeight="medium">
                            {row.nb_rejete}
                          </Typography>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </motion.div>

          {/* Additional Visualizations */}
          <motion.div variants={itemVariants}>
            <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>             
Résumé des performances
            </Typography>
            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
              <Paper sx={{ p: 3, flex: 1, minWidth: 300 }} elevation={3}>
                <Typography variant="subtitle1" gutterBottom>
                  {/* Top Performers */}
                  Les plus performants
                </Typography>
                
                <Box sx={{ mt: 2 }}>
                  {data.slice(0, 3).map((item) => (
                    <Box key={item.validateur} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ 
                        mr: 2, 
                        bgcolor: getRankColor(item.rang),
                        width: 40, 
                        height: 40 
                      }}>
                        {item.rang}
                      </Avatar>
                      <Box>
                        <Typography>{item.prenom} {item.nom} </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatTime(item.moyenne_temps_validation)}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
                
              </Paper>
              
              <Paper sx={{ p: 3, flex: 1, minWidth: 300 }} elevation={3}>
                <Typography variant="subtitle1" gutterBottom>
                  Dossier Validés
                </Typography>
                <Box sx={{ mt: 2 }}>
                  {data.map((item) => (
                    <Box key={item.validateur} sx={{ mb: 1 }}>
                      <Typography variant="caption">
                        {item.nom} {item.prenom}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ 
                          width: `${Math.min(100, item.nb_validations * 20)}%`,
                          height: 8,
                          bgcolor: "green",
                          borderRadius: 4,
                          mr: 1
                        }} />
                        <Typography variant="caption">
                          {item.nb_validations}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Paper>
               <Paper sx={{ p: 3, flex: 1, minWidth: 300 }} elevation={3}>
                <Typography variant="subtitle1" gutterBottom>
                  Dossier Rejetés
                </Typography>
                <Box sx={{ mt: 2 }}>
                  {data.map((item) => (
                    <Box key={item.validateur} sx={{ mb: 1 }}>
                      <Typography variant="caption">
                        {item.nom} {item.prenom}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ 
                          width: `${Math.min(100, item.nb_rejete * 20)}%`,
                          height: 8,
                          bgcolor: "red",
                          borderRadius: 4,
                          mr: 1
                        }} />
                        <Typography variant="caption">
                          {item.nb_rejete}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Paper>
            </Box>
          </motion.div>
        </motion.div>
      </Box>
    </ThemeProvider>
  );
};

// Example usage with your data
const PageS: React.FC = () => {
  const { data: DataValidateur, isPending } = useGetStatusValidateur();

  if (isPending || !Array.isArray(DataValidateur)) {
    return <SpinnerLoader/>;
  }

  return <ProfessionalDashboard data={DataValidateur} />;
};

export default PageS;