import { z } from 'zod'

export const recruiterSchema = z.object({
  companyName:     z.string().min(1, { message: "Le nom de l'entreprise est requis" }),
  email:           z.string().email({ message: 'Email invalide' }),
  companyNumber:   z.string().optional(),
  headquarterCity: z.string().min(1, { message: 'La ville du siège est requise' }),
  sector:          z.string().optional(),
  sourceComment:   z.string().optional(),
  expectation:     z.string().optional(),
})

export type RecruiterFormData = z.infer<typeof recruiterSchema>
