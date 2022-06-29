import dayjs from 'dayjs'

export const basicShowFormat = (seconds: number) =>
  dayjs(seconds * 1000).format('DD. MM. YYYY')

export const inputDateFormat = (seconds: number) =>
  dayjs(seconds * 1000).format('YYYY-MM-DD')

export const today = () => dayjs().format('YYYY-MM-DDTHH:mm')
