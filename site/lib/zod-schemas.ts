import { z } from 'zod'

const MIN_PASSWORD_LENGTH = 8

export const LoginSchema = z.object({
  email: z.string().email('E-mailová adresa je neplatná'),
  password: z
    .string()
    .min(MIN_PASSWORD_LENGTH, 'Heslo musí mať aspoň 8 znakov'),
})
