import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb';
import { Logger } from '@aws-lambda-powertools/logger';
import { Tracer } from '@aws-lambda-powertools/tracer';

const logger = new Logger({ serviceName: 'getProfile' });
const tracer = new Tracer();
const client = tracer.captureAWSv3Client(new DynamoDBClient({}));

export const handler: APIGatewayProxyHandlerV2 = async (event, context) => {
  logger.addContext(context);
  tracer.putMetadata('request', event);

  const id = event.pathParameters?.id;

  if (!id) {
    logger.warn('Missing user ID in path parameters');
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'User ID is required' }),
    };
  }

  try {
    const result = await client.send(
      new GetItemCommand({
        TableName: process.env.TABLE_NAME,
        Key: { id: { S: id } },
      }),
    );

    if (!result.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'User not found' }),
      };
    }

    const user = {
      id: result.Item.id?.S,
      firstName: result.Item.firstName?.S,
      lastName: result.Item.lastName?.S,
      dateOfBirth: result.Item.dateOfBirth?.S,
    };

    return {
      statusCode: 200,
      body: JSON.stringify(user),
    };
  } catch (error) {
    logger.error('Error fetching user', { error });
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
};
