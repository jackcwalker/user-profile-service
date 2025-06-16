import { describe, it, expect } from 'vitest';
import axios from 'axios';

const BASE_URL = process.env.API_URL || 'http://localhost:3000';

let userId: string;

describe('User Profile API E2E', () => {
  it('should create a profile', async () => {
    const res = await axios.post(`${BASE_URL}/profiles`, {
      firstName: 'Jane',
      lastName: 'Doe',
      dateOfBirth: '1990-01-01',
    });

    expect(res.status).toBe(201);
    expect(typeof res.data.id).toBe('string');
    expect(res.data.firstName).toBe('Jane');
    expect(res.data.lastName).toBe('Doe');
    expect(res.data.dateOfBirth).toBe('1990-01-01');

    userId = res.data.id;
  });

  it('should retrieve the created profile', async () => {
    const res = await axios.get(`${BASE_URL}/profiles/${userId}`);
    expect(res.status).toBe(200);
    expect(res.data.firstName).toBe('Jane');
    expect(res.data.lastName).toBe('Doe');
  });

  it('should update the profile', async () => {
    const res = await axios.put(`${BASE_URL}/profiles/${userId}`, {
      firstName: 'Janet',
      lastName: 'Smith',
    });

    expect(res.status).toBe(200);
    expect(res.data.message).toBe('User updated');
  });

  it('should retrieve all profiles (including the updated one)', async () => {
    const res = await axios.get(`${BASE_URL}/profiles`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.data)).toBe(true);
    expect(
      res.data.some(
        (p: any) => p.id === userId && p.firstName === 'Janet' && p.lastName === 'Smith',
      ),
    ).toBe(true);
  });
});
