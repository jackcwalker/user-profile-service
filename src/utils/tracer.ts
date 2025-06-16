import { Tracer } from '@aws-lambda-powertools/tracer';

export const tracer = new Tracer({ serviceName: 'user-profile-service' });
