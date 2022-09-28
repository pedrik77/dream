import { createTheme, ThemeProvider } from '@mui/material'

const theme = createTheme({
  components: {
    MuiStepper: {
      styleOverrides: {
        root: {
          color: 'var (--primary)',
        },
      },
    },
    MuiStep: {
      styleOverrides: {
        root: {
          padding: 0,
        },
      },
    },

    MuiStepIcon: {
      styleOverrides: {
        root: {
          fill: 'var(--primary)',
        },
      },
    },

    MuiStepConnector: {
      styleOverrides: {
        line: {
          border: '1px solid var(--primary)',
        },
      },
    },

    MuiSkeleton: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.42)',
        },
      },
    },
  },
})

export const MuiThemeProvider: React.FC = ({ children }) => {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>
}
