import dayjs from "dayjs";
import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import nodemailer from "nodemailer";
import { z } from 'zod';
import { getMailClient } from "../../lib/mail";
import { prisma } from "../../lib/prisma";
import { LOCAL_IP, SERVER_PORT } from "../../server";
import { ClientError } from "../../errors/client-error";

export async function getActivity(app: FastifyInstance) {

  app.withTypeProvider<ZodTypeProvider>().get('/trips/:tripId/activities/get', {
    schema: {
      params: z.object({
        tripId: z.string().uuid(),
      }),
    },
  }, async (request) => {
    const { tripId } = request.params

    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: {
        activities: {
          orderBy: {
            occurs_at: "asc",
          }
        }
      },
    })

    // Validate if trip exists
    if (!trip) {
      throw new ClientError('The trip you\'re trying look for activities does not exist.')
    }

    const differenceInDaysBetweenTripStartAndEnd = dayjs(trip.ends_at).diff(trip.starts_at, 'days')

    // Return every day of the trip and every activity on that day
    const activities = Array.from({ length: differenceInDaysBetweenTripStartAndEnd + 1 }).map((_, index) => {

      const date = dayjs(trip.starts_at).add(index, 'days')

      return {
        date: date.toDate(),
        activities: trip.activities.filter(activity => {
          return dayjs(activity.occurs_at).isSame(date, 'day')
        })
      }
    })

    return { activities }

  })
}
