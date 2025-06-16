import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { DynamoDBClient, UpdateItemCommand } from '@aws-sdk/client-dynamodb';
import { Logger } from '@aws-lambda-powertools/logger';
import { Tracer } from '@aws-lambda-powertools/tracer';
import { validateUpdateInput } from '@utils/validator';

const logger = new Logger({ serviceName: 'updateProfile' });
const tracer = new Tracer();
const client = tracer.captureAWSv3Client(new DynamoDBClient({}));

export const handler: APIGatewayProxyHandlerV2 = async (event, context) => {
  logger.addContext(context);
  tracer.putMetadata('request', event);

  const id = event.pathParameters?.id;
  if (!id) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'User ID is required' }),
    };
  }

  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Invalid request body' }),
    };
  }

  const validation = validateUpdateInput(payload);
  if (!validation.valid) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: validation.message }),
    };
  }

  const { firstName, lastName, dateOfBirth } = payload;
  const updateExpressions: string[] = [];
  const expressionAttributeValues: Record<string, any> = {};
  const expressionAttributeNames: Record<string, string> = {};

  if (firstName) {
    updateExpressions.push('#firstName = :firstName');
    expressionAttributeNames['#firstName'] = 'firstName';
    expressionAttributeValues[':firstName'] = { S: firstName };
  }

  if (lastName) {
    updateExpressions.push('#lastName = :lastName');
    expressionAttributeNames['#lastName'] = 'lastName';
    expressionAttributeValues[':lastName'] = { S: lastName };
  }

  if (dateOfBirth) {
    updateExpressions.push('#dateOfBirth = :dateOfBirth');
    expressionAttributeNames['#dateOfBirth'] = 'dateOfBirth';
    expressionAttributeValues[':dateOfBirth'] = { S: dateOfBirth };
  }

  try {
    await client.send(
      new UpdateItemCommand({
        TableName: process.env.TABLE_NAME,
        Key: { id: { S: id } },
        UpdateExpression: `SET ${updateExpressions.join(', ')}`,
        ExpressionAttributeValues: expressionAttributeValues,
        ExpressionAttributeNames:
          Object.keys(expressionAttributeNames).length > 0 ? expressionAttributeNames : undefined,
      }),
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'User updated' }),
    };
  } catch (error) {
    logger.error('Error updating user', { error });
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
};
