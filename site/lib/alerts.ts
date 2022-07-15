import Swal from 'sweetalert2'

export const confirm = async (title: string) => {
  const { isConfirmed } = await Swal.fire({
    title,
    confirmButtonText: 'Áno',
    showCancelButton: true,
    cancelButtonText: 'Zrušiť',
  })
  return isConfirmed
}
