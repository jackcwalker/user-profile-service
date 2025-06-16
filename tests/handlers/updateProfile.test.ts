import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { setupDynamoMock, sendMock } from '../mocks/mockDynamoClient';
import { mockContext } from '../mocks/context';

let handler: any;

beforeAll(async () => {
  await setupDynamoMock('UpdateItemCommand');
  handler = (await import('@handlers/updateProfile')).handler;
});

beforeEach(() => {
  sendMock.mockReset();
});

describe('updateProfile handler', () => {
  it('returns 400 if ID is missing', async () => {
    const result = await handler(
      { pathParameters: {}, body: JSON.stringify({ firstName: 'New' }) },
      mockContext,
    );
    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body).message).toBe('User ID is required');
  });

  it('returns 400 if body is invalid JSON', async () => {
    const result = await handler({ pathParameters: { id: '123' }, body: 'not-json' }, mockContext);
    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body).message).toBe('Invalid request body');
  });

  it('returns 400 if nothing to update', async () => {
    const result = await handler(
      { pathParameters: { id: '123' }, body: JSON.stringify({}) },
      mockContext,
    );
    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body).message).toBe('Nothing to update');
  });

  it('returns 200 if user was successfully updated', async () => {
    sendMock.mockResolvedValue({});

    const result = await handler(
      {
        pathParameters: { id: '123' },
        body: JSON.stringify({ firstName: 'Updated', lastName: 'User' }),
      },
      mockContext,
    );

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body).message).toBe('User updated');
  });
});
