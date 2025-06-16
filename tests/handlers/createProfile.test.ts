import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { mockContext, mockEvent } from '../mocks/context';
import { setupDynamoMock, sendMock } from '../mocks/mockDynamoClient';

let handler: any;

beforeAll(async () => {
  await setupDynamoMock('PutItemCommand'); // explicitly state the command
  handler = (await import('@handlers/createProfile')).handler;
});

beforeEach(() => {
  sendMock.mockReset();
});

describe('createProfile handler', () => {
  it('returns 400 if body is invalid JSON', async () => {
    const result = await handler({ ...mockEvent, body: 'not-json' }, mockContext);
    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body).message).toBe('Invalid request body');
  });

  it('returns 400 if firstName is missing', async () => {
    const body = JSON.stringify({ lastName: 'User', dateOfBirth: '1990-01-01' });
    const result = await handler({ ...mockEvent, body }, mockContext);
    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body).message).toBe(
      'firstName, lastName, and dateOfBirth are required',
    );
  });

  it('returns 400 if dateOfBirth is missing', async () => {
    const body = JSON.stringify({ firstName: 'Test', lastName: 'User' });
    const result = await handler({ ...mockEvent, body }, mockContext);
    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body).message).toBe(
      'firstName, lastName, and dateOfBirth are required',
    );
  });

  it('returns 201 and creates user if input is valid', async () => {
    sendMock.mockResolvedValue({}); // simulate DynamoDB PutItemCommand success

    const body = JSON.stringify({
      firstName: 'Test',
      lastName: 'User',
      dateOfBirth: '1990-01-01',
    });

    const result = await handler({ ...mockEvent, body }, mockContext);

    expect(result.statusCode).toBe(201);
    const json = JSON.parse(result.body);
    expect(json.firstName).toBe('Test');
    expect(json.lastName).toBe('User');
    expect(json.dateOfBirth).toBe('1990-01-01');
    expect(json.id).toBeDefined();
  });
});
