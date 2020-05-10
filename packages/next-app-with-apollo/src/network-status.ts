import { createNetworkStatusNotifier } from 'react-apollo-network-status'

const notifier = createNetworkStatusNotifier()

export const networkStatusLink = notifier.link

export const useNetworkStatus = notifier.useApolloNetworkStatus
