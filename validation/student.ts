// validation/student.ts
import { z } from 'zod'

export const studentSchema = z.object({
  firstName: z.string().min(1, { message: 'Le prénom est requis' }),
  lastName:  z.string().min(1, { message: 'Le nom est requis' }),
  email:     z.string().email({ message: 'Email invalide' }),
  city:      z.string().min(1, { message: 'La ville est requise' }),
  fieldOfStudy:   z.string().optional(),
  sourceComment:  z.string().optional(),
  expectation:    z.string().optional(),
})

export type StudentFormData = z.infer<typeof studentSchema>
