import React from 'react'
import s from './Stepper.module.css'
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
    >
      {steps.map((title) => (
        <Step key={title} className={s.title}>
          <StepLabel className={s.label}>{title}</StepLabel>
        </Step>
      ))}
    </MuiStepper>
  )
}
