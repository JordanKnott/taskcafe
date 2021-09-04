import { DataProxy } from '@apollo/client';
import { DocumentNode } from 'graphql';

type UpdateCacheFn<T> = (cache: T) => T;

export function updateApolloCache<T>(
  client: DataProxy,
  document: DocumentNode,
  update: UpdateCacheFn<T>,
  variables?: any,
) {
  let queryArgs: DataProxy.Query<any, any>;
  if (variables) {
    queryArgs = {
      query: document,
      variables,
    };
  } else {
    queryArgs = {
      query: document,
    };
  }
  const cache: T | null = client.readQuery(queryArgs);
  if (cache) {
    const newCache = update(cache);
    client.writeQuery({
      ...queryArgs,
      data: newCache,
    });
  }
}

export default updateApolloCache;
