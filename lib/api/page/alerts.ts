import Swal, { SweetAlertInput, SweetAlertOptions } from 'sweetalert2'

const DEFAULT_CANCEL = 'Zrušiť'
const DEFAULT_CONFIRM = 'Potvrdiť'

export const confirm = async (
  title: string,
  {
    confirmButtonText = DEFAULT_CONFIRM,
    cancelButtonText = DEFAULT_CANCEL,
    ...options
  }: SweetAlertOptions = {}
) => {
  const { isConfirmed } = await Swal.fire({
    ...options,
    title,
    confirmButtonText,
    cancelButtonText,
    showCancelButton: !!cancelButtonText,
    color: 'var(--text-primary)',
    confirmButtonColor: 'var(--text-primary)',
  })
  return isConfirmed
}

export const prompt = async (
  title: string,
  {
    confirmButtonText = DEFAULT_CONFIRM,
    cancelButtonText = DEFAULT_CANCEL,
    input = 'text',
    ...options
  }: SweetAlertOptions = {}
) => {
  const { value } = await Swal.fire({
    ...options,
    title,
    input,
    confirmButtonText,
    cancelButtonText,
    showCancelButton: !!cancelButtonText,
    color: 'var(--text-primary)',
    confirmButtonColor: 'var(--text-primary)',
  })
  return value
}
