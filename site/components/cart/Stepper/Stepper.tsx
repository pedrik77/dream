import React from 'react'
import {
  createMuiTheme,
  createTheme,
  Step,
  StepLabel,
  Stepper as MuiStepper,
} from '@mui/material'

interface StepperProps {
  steps: Readonly<string[]>
  activeStep: string
  className?: string
}

export default function Stepper({
  steps,
  activeStep,
  className = '',
}: StepperProps) {
  return (
    <MuiStepper
      className={className}
      activeStep={steps.indexOf(activeStep)}
      alternativeLabel
      sx={{
        padding: 0,
        color: 'var(--primary)',
      }}
    >
      {steps.map((title) => (
        <Step
          key={title}
          sx={{
            color: 'var(--primary)',
            fontSize: 14,
            fill: 'var(--primary)',
          }}
        >
          <StepLabel
            sx={{
              color: '#491239',
              fontSize: 14,
            }}
          >
            {title}
          </StepLabel>
        </Step>
      ))}
    </MuiStepper>
  )
}
