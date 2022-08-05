import React from 'react'
import { Step, StepLabel, Stepper as MuiStepper } from '@mui/material'

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
      sx={}
    >
      {steps.map((title) => (
        <Step key={title}>
          <StepLabel>{title}</StepLabel>
        </Step>
      ))}
    </MuiStepper>
  )
}
