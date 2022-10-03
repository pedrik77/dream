import { Container, Input, Text } from '@components/ui'
import { FormControl, FormGroup } from '@mui/material'
import { ComponentConfig } from '../types'

const config: ComponentConfig<{ title: string }> = {
  type: 'conact_form',
  title: 'Contact Form',
  Component: ({ title }) => (
    <Container>
      <Text variant="sectionHeading">{title}</Text>
      <form>
        <FormGroup>
          <FormControl>
            <label htmlFor="name">Name</label>
            <Input />
          </FormControl>
        </FormGroup>
      </form>
    </Container>
  ),
  valuesDefinition: {
    title: ['title', 'Contact Form'],
  },
}

export default config
