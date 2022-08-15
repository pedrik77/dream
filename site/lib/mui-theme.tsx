import { createTheme, ThemeProvider } from '@mui/material'
import { yellow } from '@mui/material/colors'

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
    MuiStepLabel: {
      styleOverrides: {
        label: {
          color: 'var(--primary)',
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
  },
})

export const MuiThemeProvider: React.FC = ({ children }) => {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>
}
