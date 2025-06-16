// tests/utils/mockDynamoClient.ts
import { vi } from 'vitest';

export const sendMock = vi.fn();

export const setupDynamoMock = async (
  commandName:
    | 'PutItemCommand'
    | 'GetItemCommand'
    | 'ScanCommand'
    | 'UpdateItemCommand' = 'PutItemCommand', // default
) => {
  const actual = await vi.importActual<typeof import('@aws-sdk/client-dynamodb')>(
    '@aws-sdk/client-dynamodb',
  );

  const command = actual[commandName];

  vi.doMock('@aws-sdk/client-dynamodb', () => ({
    ...actual,
    DynamoDBClient: vi.fn(() => ({ send: sendMock })),
    [commandName]: command,
  }));
};
