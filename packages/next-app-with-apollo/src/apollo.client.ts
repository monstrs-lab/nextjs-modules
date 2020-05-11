import fetch                                                       from 'isomorphic-unfetch'
import { ApolloClient, ApolloLink, InMemoryCache, createHttpLink } from '@apollo/client'
import { onError }                                                 from '@apollo/link-error'

import { networkStatusLink }                                       from './network-status'

interface Fetch {
  (uri, options: any, props: any): Promise<any>
}

interface Options {
  uri: string
  fetch?: Fetch
  onUnauthenticated: () => void
}

let globalApolloClient = null

const defaultFetch = (uri, options: any, props: any) => {
  return fetch(uri, options)
}

const createApolloClient = (initialState = {}, options: Options, getProps) => {
  const errorLink = onError(({ graphQLErrors }) => {
    if (graphQLErrors) {
      graphQLErrors.forEach(graphQLError => {
        if (
          graphQLError.extensions &&
          graphQLError.extensions.code === 'UNAUTHENTICATED' &&
          options.onUnauthenticated
        ) {
          options.onUnauthenticated()
        }
      })
    }
  })

  const httpLink = createHttpLink({
    uri: options.uri,
    credentials: 'same-origin',
    fetch: (fetchUri, fetchOptions) => {
      const fetchFn = options.fetch || defaultFetch

      return fetchFn(fetchUri, fetchOptions, getProps ? getProps() : {})
    },
  })

  return new ApolloClient({
    connectToDevTools: (process as any).browser,
    ssrMode: !(process as any).browser,
    cache: new InMemoryCache().restore(initialState),
    link: ApolloLink.from([errorLink, networkStatusLink.concat(httpLink)]),
  })
}

export const initApolloClient = (initialState, options, getProps) => {
  if (!(process as any).browser) {
    return createApolloClient(initialState, options, getProps)
  }

  if (!globalApolloClient) {
    globalApolloClient = createApolloClient(initialState, options, getProps)
  }

  return globalApolloClient
}
