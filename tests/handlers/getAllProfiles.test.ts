import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { setupDynamoMock, sendMock } from '../mocks/mockDynamoClient';
import { mockContext } from '../mocks/context';

let handler: any;

beforeAll(async () => {
  await setupDynamoMock('ScanCommand');
  handler = (await import('@handlers/getAllProfiles')).handler;
});

beforeEach(() => {
  sendMock.mockReset();
});

describe('getAllProfiles handler', () => {
  it('returns 200 with an empty list when no users are found', async () => {
    sendMock.mockResolvedValue({ Items: [] });

    const result = await handler({}, mockContext);
    expect(result.statusCode).toBe(200);
    const body = JSON.parse(result.body);
    expect(body).toEqual([]);
  });

  it('returns 200 with a list of users when users are found', async () => {
    sendMock.mockResolvedValue({
      Items: [
        {
          id: { S: '1' },
          firstName: { S: 'Alice' },
          lastName: { S: 'Smith' },
          dateOfBirth: { S: '1991-01-01' },
        },
        {
          id: { S: '2' },
          firstName: { S: 'Bob' },
          lastName: { S: 'Jones' },
          dateOfBirth: { S: '1985-05-15' },
        },
      ],
    });

    const result = await handler({}, mockContext);
    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual([
      {
        id: '1',
        firstName: 'Alice',
        lastName: 'Smith',
        dateOfBirth: '1991-01-01',
      },
      {
        id: '2',
        firstName: 'Bob',
        lastName: 'Jones',
        dateOfBirth: '1985-05-15',
      },
    ]);
  });
});
