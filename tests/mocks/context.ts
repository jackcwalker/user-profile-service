import type { APIGatewayProxyEventV2, Context } from 'aws-lambda';

export const mockContext: Context = {
  callbackWaitsForEmptyEventLoop: false,
  functionName: 'testFunction',
  functionVersion: '$LATEST',
  invokedFunctionArn: 'arn:aws:lambda:us-east-1:123456789012:function:testFunction',
  memoryLimitInMB: '128',
  awsRequestId: 'test-request-id',
  logGroupName: '/aws/lambda/testFunction',
  logStreamName: '2025/06/16/[$LATEST]abcdef1234567890',
  getRemainingTimeInMillis: () => 10000,
  done: () => {},
  fail: () => {},
  succeed: () => {},
};

export const mockEvent: Partial<APIGatewayProxyEventV2> = {
  body: '{}',
  headers: {},
  pathParameters: {},
};
