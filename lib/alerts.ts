import Swal from 'sweetalert2'

const DEFAULT_CANCEL = 'Zrušiť'
const DEFAULT_CONFIRM = 'Áno'

const defaultOptions = {
  cancelButton: DEFAULT_CANCEL,
  confirmButton: DEFAULT_CONFIRM,
}

export const confirm = async (
  title: string,
  { cancelButton, confirmButton } = defaultOptions
) => {
  const { isConfirmed } = await Swal.fire({
    title,
    confirmButtonText: confirmButton,
    showCancelButton: !!cancelButton,
    cancelButtonText: cancelButton,
    color: 'var(--text-primary)',
    confirmButtonColor: 'var(--text-primary)',
  })
  return isConfirmed
}

export const prompt = async (
  title: string,
  { cancelButton, confirmButton } = defaultOptions
) => {
  const { value } = await Swal.fire({
    title,
    input: 'text',
    showCancelButton: !!cancelButton,
    cancelButtonText: cancelButton,
    confirmButtonText: confirmButton,
    color: 'var(--text-primary)',
    confirmButtonColor: 'var(--text-primary)',
  })
  return value
}
