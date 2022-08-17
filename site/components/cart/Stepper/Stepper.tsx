import React from 'react'
import { Step, StepLabel, Stepper as MuiStepper } from '@mui/material'

interface StepperProps {
  steps: string[]
  activeStep: number
  className?: string
}

export default function Stepper({
  steps,
  activeStep,
  className = '',
}: StepperProps) {
  return (
    <MuiStepper className={className} activeStep={activeStep} alternativeLabel>
      {steps.map((title) => (
        <Step key={title}>
          <StepLabel>{title}</StepLabel>
        </Step>
      ))}
    </MuiStepper>
  )
}
