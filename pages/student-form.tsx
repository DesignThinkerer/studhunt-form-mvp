import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { studentSchema, StudentFormData } from '../validation/student'
import { Card, CardHeader, CardBody, CardFooter } from '@heroui/card'
import { Button } from '@heroui/button'

export default function StudentForm() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    reset,
  } = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
  })

  const onSubmit = async (formData: StudentFormData) => {
    try {
      const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await res.json()

      if (!res.ok) {
        if (data.error) {
          setError('email', { type: 'server', message: data.error })
        }
        return
      }

      reset()
    } catch {
      setError('email', { type: 'server', message: 'Erreur réseau.' })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card className="max-w-lg mx-auto mt-8">
        <CardHeader>Inscription Étudiant</CardHeader>

        <CardBody className="space-y-4">
          <div>
            <label>Prénom*</label>
            <input {...register('firstName')} className="input w-full" />
            {errors.firstName && (
              <p className="text-red-600 text-sm">{errors.firstName.message}</p>
            )}
          </div>

          <div>
            <label>Nom*</label>
            <input {...register('lastName')} className="input w-full" />
            {errors.lastName && (
              <p className="text-red-600 text-sm">{errors.lastName.message}</p>
            )}
          </div>

          <div>
            <label>E-mail*</label>
            <input
              {...register('email')}
              type="email"
              className="input w-full"
            />
            {errors.email && (
              <p className="text-red-600 text-sm">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label>Ville*</label>
            <input {...register('city')} className="input w-full" />
            {errors.city && (
              <p className="text-red-600 text-sm">{errors.city.message}</p>
            )}
          </div>

          <div>
            <label>Domaine d'études</label>
            <input
              {...register('fieldOfStudy')}
              className="input w-full"
            />
          </div>

          <div>
            <label>Comment as-tu entendu parler de Studhunt ?</label>
            <textarea
              {...register('sourceComment')}
              className="textarea w-full"
            />
          </div>

          <div>
            <label>Qu'attends-tu de Studhunt ?</label>
            <textarea
              {...register('expectation')}
              className="textarea w-full"
            />
          </div>
        </CardBody>

        <CardFooter>
          <Button type="submit" disabled={isSubmitting} fullWidth>
            {isSubmitting ? 'Envoi…' : 'Envoyer'}
          </Button>
          {isSubmitSuccessful && (
            <p className="text-green-600 mt-2">✓ Ton inscription a bien été prise en compte.</p>
          )}
        </CardFooter>
      </Card>
    </form>
  )
}