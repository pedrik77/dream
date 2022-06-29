import React from 'react'
import s from './Stepper.module.css'
import { Step, StepLabel, Stepper as MuiStepper } from '@mui/material'

const steps = ['Step 1', 'Step 2', 'Step 3']

export default function Stepper({ className = '' }) {
  return (
    <MuiStepper className={className} activeStep={1} alternativeLabel>
      {steps.map((title) => (
        <Step key={title} className={s.title}>
          <StepLabel className={s.label}>{title}</StepLabel>
        </Step>
      ))}
    </MuiStepper>
  )
}
