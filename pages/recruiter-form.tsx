import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { recruiterSchema, RecruiterFormData } from '../validation/recruiter'

export default function RecruiterForm() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    reset,
  } = useForm<RecruiterFormData>({
    resolver: zodResolver(recruiterSchema),
  })

  const onSubmit = async (formData: RecruiterFormData) => {
    try {
      const res = await fetch('/api/recruiters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await res.json()

      if (!res.ok) {
        // Si l'e-mail est déjà utilisé, afficher l'erreur sur le champ
        if (data.error) {
          setError('email', { type: 'server', message: data.error })
        }
        return
      }

      reset()
    } catch (e) {
      setError('email', { type: 'server', message: 'Une erreur réseau est survenue.' })
    }
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-xl mb-4">Inscription Recruteur</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div>
          <input
            {...register('companyName')}
            placeholder="Nom de l'entreprise*"
            className="w-full border px-2 py-1"
          />
          {errors.companyName && (
            <p className="text-red-600 text-sm">{errors.companyName.message}</p>
          )}
        </div>

        <div>
          <input
            {...register('email')}
            type="email"
            placeholder="E-mail*"
            className="w-full border px-2 py-1"
          />
          {errors.email && (
            <p className="text-red-600 text-sm">{errors.email.message}</p>
          )}
        </div>

        <div>
          <input
            {...register('companyNumber')}
            placeholder="Numéro d'entreprise (optionnel)"
            className="w-full border px-2 py-1"
          />
        </div>

        <div>
          <input
            {...register('headquarterCity')}
            placeholder="Ville du siège*"
            className="w-full border px-2 py-1"
          />
          {errors.headquarterCity && (
            <p className="text-red-600 text-sm">{errors.headquarterCity.message}</p>
          )}
        </div>

        <div>
          <input
            {...register('sector')}
            placeholder="Secteur d'activité (optionnel)"
            className="w-full border px-2 py-1"
          />
        </div>

        <div>
          <textarea
            {...register('sourceComment')}
            placeholder="Comment avez-vous entendu parler de Studhunt ? (optionnel)"
            className="w-full border px-2 py-1"
          />
        </div>

        <div>
          <textarea
            {...register('expectation')}
            placeholder="Qu'attendez-vous de Studhunt ? (optionnel)"
            className="w-full border px-2 py-1"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          {isSubmitting ? 'Envoi…' : 'Envoyer'}
        </button>
      </form>

      {isSubmitSuccessful && (
        <p className="mt-3 text-green-600">
          ✓ Merci, votre inscription a bien été prise en compte.
        </p>
      )}
    </div>
  )
}
