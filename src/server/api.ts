// src/server/api.ts

import { remultExpress } from 'remult/remult-express';
import { Task } from '../shared/Task';
import { remult } from 'remult';

const users = [
  {
    id: '1',
    name: 'Johne Doe',
    roles: ['admin'],
    token: 'a',
  },
  {
    id: '2',
    name: 'Johne Doe',
    roles: ['user'],
    token: 'b'
  },
];

export const api = remultExpress({
  rootPath: '/todo',
  entities: [Task],
  getUser: async (req) => {
    console.log('auth', req.headers.authorization);

    // POC: Can we use remult to resolve user?
    // const task = await remult.repo(Task).findId('j4ihw3zfw112ogmh1jnsu4m5');
    // console.log('task', task);

    if (!req.headers.authorization) {
      return undefined;
    }

    const parts = req.headers.authorization.split(' ');
    if (parts.length < 2) {
      return undefined;
    }

    const token = parts[1];
    return users.find(u => u.token === token);
  },
});
