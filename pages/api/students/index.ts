import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  const {
    firstName,
    lastName,
    email,
    city,
    fieldOfStudy,
    sourceComment,
    expectation,
  } = req.body

  try {
    const student = await prisma.student.create({
      data: {
        firstName,
        lastName,
        email,
        city,
        fieldOfStudy,
        sourceComment,
        expectation,
      },
    })
    return res.status(201).json(student)
  } catch (error) {
    // Gestion du cas d'email déjà utilisé (P2002)
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002' &&
      Array.isArray(error.meta?.target) &&
      (error.meta.target as string[]).includes('email')
    ) {
      return res
        .status(409)
        .json({ error: "Cet e-mail est déjà utilisé par un autre étudiant." })
    }

    console.error(error)
    return res.status(500).json({ error: 'Une erreur est survenue.' })
  }
}
