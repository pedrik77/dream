import { z } from 'zod'

export const ContactFormSchema = z.object({
  name: z.string().min(2, 'Meno musí mať aspoň 2 znaky'),
  surname: z.string().min(2, 'Priezvisko musí mať aspoň 2 znaky'),
  email: z.string().email('E-mailová adresa je neplatná'),
  subject: z.string().min(2, 'Predmet musí mať aspoň 2 znaky'),
  message: z.string().min(2, 'Správa musí mať aspoň 2 znaky'),
})

export type ContactFormData = z.infer<typeof ContactFormSchema>
