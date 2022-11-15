import 'source-map-support/register';

import {
  PrismaClient,
  // Prisma,
} from '@prisma/client';
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

export const lambdaHandler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  });
  console.log('[DEBUG] before try');
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { id: _id } = event.pathParameters as any; // TMP
    if (typeof _id !== 'string') {
      throw new Error('id is wrong');
    }
    const id = Number(_id);

    const user =
      await prisma.$queryRaw`SELECT "public"."User"."id", "public"."User"."name", "public"."User"."rank" FROM "public"."User" WHERE "public"."User"."id" = ${id};`;
    const response = {
      statusCode: 200,
      body: JSON.stringify({
        message: 'prisma success',
        user,
      }),
    };
    return response;
  } catch (err) {
    console.log(err);
    const response = {
      statusCode: 500,
      body: JSON.stringify({
        message: 'db error',
      }),
    };
    return response;
  }
};
