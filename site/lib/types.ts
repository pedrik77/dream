export type ExpectClosure = (f: () => void) => void

export interface QueryBase<T> {
  orderBy?: keyof T
  orderDirection?: 'asc' | 'desc'
  onError?: (e: any) => void
}
