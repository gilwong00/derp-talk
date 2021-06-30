import {
  createClient,
  dedupExchange,
  cacheExchange,
  fetchExchange,
  ssrExchange,
  subscriptionExchange
} from 'urql';
import { SubscriptionClient } from 'subscriptions-transport-ws';

const isServerSide = typeof window === 'undefined';

const ssr = ssrExchange({
  isClient: !isServerSide
});

const subscriptionClient = new SubscriptionClient(
  'ws://localhost:5000/graphql',
  { reconnect: true }
);

const client = createClient({
  url: process.env.GRAPHQL_ENDPOINT as string,
  exchanges: [
    dedupExchange,
    cacheExchange,
    ssr,
    fetchExchange,
    subscriptionExchange({
      forwardSubscription(operation) {
        return subscriptionClient.request(operation);
      }
    })
  ]
});

export default client;
