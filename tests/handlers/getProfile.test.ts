import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { setupDynamoMock, sendMock } from '../mocks/mockDynamoClient';
import { mockContext } from '../mocks/context';

let handler: any;

beforeAll(async () => {
  await setupDynamoMock('GetItemCommand');
  handler = (await import('@handlers/getProfile')).handler;
});

beforeEach(() => {
  sendMock.mockReset();
});

describe('getProfile handler', () => {
  it('returns 400 if no ID is provided', async () => {
    const result = await handler({ pathParameters: {} }, mockContext);
    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body).message).toBe('User ID is required');
  });

  it('returns 404 if user is not found', async () => {
    sendMock.mockResolvedValue({ Item: undefined });

    const result = await handler({ pathParameters: { id: 'nonexistent-id' } }, mockContext);
    expect(result.statusCode).toBe(404);
    expect(JSON.parse(result.body).message).toBe('User not found');
  });

  it('returns 200 with user profile if found', async () => {
    sendMock.mockResolvedValue({
      Item: {
        id: { S: '123' },
        firstName: { S: 'Test' },
        lastName: { S: 'User' },
        dateOfBirth: { S: '1990-01-01' },
      },
    });

    const result = await handler({ pathParameters: { id: '123' } }, mockContext);
    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual({
      id: '123',
      firstName: 'Test',
      lastName: 'User',
      dateOfBirth: '1990-01-01',
    });
  });
});
