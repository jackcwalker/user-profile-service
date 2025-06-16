import { APIGatewayProxyEventV2, APIGatewayProxyResultV2, Context } from 'aws-lambda';
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { Logger } from '@aws-lambda-powertools/logger';
import { Tracer } from '@aws-lambda-powertools/tracer';
import { v4 as uuidv4 } from 'uuid';
import { validateCreateInput } from '@utils/validator';

const logger = new Logger({ serviceName: 'createProfile' });
const tracer = new Tracer();
const client = tracer.captureAWSv3Client(new DynamoDBClient({}));

export const handler = async (
  event: APIGatewayProxyEventV2,
  context: Context,
): Promise<APIGatewayProxyResultV2> => {
  logger.addContext(context);
  tracer.putMetadata('request', event);

  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Invalid request body' }),
    };
  }

  const validation = validateCreateInput(payload);
  if (!validation.valid) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: validation.message }),
    };
  }

  const { firstName, lastName, dateOfBirth } = payload;
  const id = uuidv4();

  try {
    await client.send(
      new PutItemCommand({
        TableName: process.env.TABLE_NAME,
        Item: {
          id: { S: id },
          firstName: { S: firstName },
          lastName: { S: lastName },
          dateOfBirth: { S: dateOfBirth },
        },
      }),
    );

    return {
      statusCode: 201,
      body: JSON.stringify({ id, firstName, lastName, dateOfBirth }),
    };
  } catch (error) {
    logger.error('Error creating user', { error });
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
};
