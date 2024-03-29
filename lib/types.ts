export type ExpectClosure = (f: () => void) => void

export type AnyClosure = (...args: any[]) => any

export type StringMap = { [key: string]: string }

export interface QueryBase<T> {
  orderBy?: keyof T
  orderDirection?: 'asc' | 'desc'
  onError?: (e: any) => void
}
