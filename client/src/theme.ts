import { createTheme } from '@mui/material/styles';

// Define your theme configuration
export const theme = createTheme({
  palette: {
    mode: 'light', // or 'dark'
    primary: {
      main: '#1976d2', // Example primary color (Material UI blue)
    },
    secondary: {
      main: '#dc004e', // Example secondary color (Material UI pink)
    },
    background: {
      default: '#f4f6f8',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontSize: '2.2rem', fontWeight: 500 },
    h5: { fontSize: '1.5rem', fontWeight: 500 }, // Used in AuthLayout title
    // Add other typography variants as needed
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // Keep button text case as defined
          borderRadius: '8px',
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        margin: 'normal',
      },
    },
    MuiPaper: {
        styleOverrides: {
            root: {
                borderRadius: '12px',
            }
        }
    }
  },
}); 