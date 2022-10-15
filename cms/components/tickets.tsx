import { getMultiple } from 'cms/editors/multiple'
import { ComponentConfig } from '../types'
import { Input, Text } from '@components/ui'

type Ticket = {
  count: number
  price: number
}

export type VariableTicket = {
  variableTicketCount: number
  variableMin: number
}

interface TicketsProps extends VariableTicket {
  tickets: Ticket[]
}

const empty = { count: 1, price: 1 }

const config: ComponentConfig<TicketsProps> = {
  type: 'tickets',
  title: 'Tickets',
  Component: ({ tickets, variableMin, variableTicketCount }) => (
    <div>
      <Text variant="sectionHeading">Tickets</Text>
      <div>
        <h5>Voliteľné: {variableTicketCount}</h5>
        <span>{variableMin} €</span>
        <hr />
      </div>
      {tickets.map(({ count, price }) => (
        <div key={price}>
          <h5>Počet: {count}</h5>
          <span>Cena: {price} €</span>
          <hr />
        </div>
      ))}
    </div>
  ),
  valuesDefinition: {
    variableTicketCount: [
      'Počet ticketov pri voliteľnej sume (blank to disable)',
      0,
      'number',
    ],
    variableMin: ['Voliteľné minimum', 1, 'number'],
    tickets: [
      '',
      [empty],
      getMultiple({
        editor: ({ value, onChange }) => {
          return (
            <div className="flex">
              <Input
                value={value.count}
                onChange={(count) => onChange({ ...value, count })}
                variant="cms"
                labelClass="text-white"
              >
                Počet
              </Input>
              <Input
                value={value.price}
                onChange={(price) => onChange({ ...value, price })}
                variant="cms"
                labelClass="text-white"
              >
                Cena
              </Input>
            </div>
          )
        },
        emptyNew: empty,
      }),
    ],
  },
}

export default config
