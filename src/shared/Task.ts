// src/shared/Task.ts

import { Allow, Entity, EntityFilter, EntityOptions, Fields, Remult } from 'remult';

export type ProtectedEntity = Object & {
  id: string;
  userId?: number;
  locked?: boolean;
};

async function beforeWrite<T extends ProtectedEntity>(
  remult: Remult,
  entity: T
) {
  if (remult.isAllowed('admin')) {
    return;
  }

  entity.userId = +(remult.user?.id || 0);

  if (!entity.id) {
    return;
  }

  const entityInDb = (await remult
    .repo(entity.constructor as any)
    .findId(entity.id)) as ProtectedEntity;

  if (!entityInDb) {
    console.log('not found in db!');
    return;
  }

  if (entity.userId !== entityInDb.userId) {
    throw 'Not your record!';
  }

  if (entityInDb.locked) {
    throw 'Locked!';
  }
}

export function configureProtected<T extends ProtectedEntity>(options: EntityOptions<T>, remult: Remult): any {
  options.allowApiCrud = Allow.authenticated;

  if (remult.isAllowed('admin')) {
    options.apiPrefilter = {};
  } else {
    options.apiPrefilter = { userId: +(remult.user?.id || 0) } as EntityFilter<T>;
  }

  options.saving = async (task) => {
    await beforeWrite(remult, task);
  };

  options.deleting = async (task) => {
    await beforeWrite(remult, task);
  };
}

@Entity<Task>('tasks', configureProtected)
export class Task implements ProtectedEntity {
  @Fields.cuid()
  id = '';

  @Fields.string()
  title = '';

  @Fields.boolean()
  completed = false;

  @Fields.createdAt()
  createdAt?: Date;

  @Fields.boolean()
  locked?: boolean;

  @Fields.integer()
  userId?: number;
}
