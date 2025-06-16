import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { DynamoDBClient, ScanCommand } from '@aws-sdk/client-dynamodb';
import { Logger } from '@aws-lambda-powertools/logger';
import { Tracer } from '@aws-lambda-powertools/tracer';

const logger = new Logger({ serviceName: 'getAllProfiles' });
const tracer = new Tracer();
const client = tracer.captureAWSv3Client(new DynamoDBClient({}));

export const handler: APIGatewayProxyHandlerV2 = async (event, context) => {
  logger.addContext(context);
  tracer.putMetadata('request', event);

  try {
    const result = await client.send(new ScanCommand({ TableName: process.env.TABLE_NAME }));

    const users =
      result.Items?.map((item) => ({
        id: item.id?.S,
        firstName: item.firstName?.S,
        lastName: item.lastName?.S,
        dateOfBirth: item.dateOfBirth?.S,
      })) || [];

    return {
      statusCode: 200,
      body: JSON.stringify(users),
    };
  } catch (error) {
    logger.error('Error fetching profiles', { error });
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
};
