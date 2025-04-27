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
    companyName,
    email,
    companyNumber,
    headquarterCity,
    sector,
    sourceComment,
    expectation,
  } = req.body

  try {
    const recruiter = await prisma.recruiter.create({
      data: {
        companyName,
        email,
        companyNumber,
        headquarterCity,
        sector,
        sourceComment,
        expectation,
      },
    })
    return res.status(201).json(recruiter)
  } catch (error) {
    // Si l'erreur est un P2002 (duplicate key)
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002' &&
      Array.isArray(error.meta?.target) &&
      (error.meta.target as string[]).includes('email')
    ) {
      return res
        .status(409)
        .json({ error: "Cet e-mail est déjà utilisé par un autre recruteur." })
    }

    console.error(error)
    return res.status(500).json({ error: 'Une erreur est survenue.' })
  }
}
