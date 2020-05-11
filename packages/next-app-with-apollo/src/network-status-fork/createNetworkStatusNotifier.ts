import ApolloLinkNetworkStatus                                   from './ApolloLinkNetworkStatus'
import Dispatcher                                                from './Dispatcher'
import NetworkStatusAction                                       from './NetworkStatusAction'
import useApolloNetworkStatusReducer                             from './useApolloNetworkStatusReducer'
import useApolloNetworkStatus, { UseApolloNetworkStatusOptions } from './useApolloNetworkStatus'

export default function createNetworkStatusNotifier() {
  const dispatcher = new Dispatcher()
  const link = new ApolloLinkNetworkStatus(dispatcher)

  function useConfiguredApolloNetworkStatus(options?: UseApolloNetworkStatusOptions) {
    return useApolloNetworkStatus(dispatcher, options)
  }

  function useConfiguredApolloNetworkStatusReducer<T>(
    reducer: (state: T, action: NetworkStatusAction) => T,
    initialState: T
  ) {
    return useApolloNetworkStatusReducer(dispatcher, reducer, initialState)
  }

  return {
    link,
    useApolloNetworkStatus: useConfiguredApolloNetworkStatus,
    useApolloNetworkStatusReducer: useConfiguredApolloNetworkStatusReducer,
  }
}
