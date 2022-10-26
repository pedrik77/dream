import dayjs from 'dayjs'

export const basicShowFormat = (date: Date) =>
  dayjs(date).format('DD. MM. YYYY')

export const inputDateFormat = (date: Date) => dayjs(date).format('YYYY-MM-DD')

export const today = () => dayjs().format('YYYY-MM-DDTHH:mm')
