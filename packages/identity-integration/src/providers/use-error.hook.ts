import type { ContextError } from './error.context'

import { useContext }        from 'react'

import { ErrorContext }      from './error.context'

export const useError = (): ContextError => {
  const error = useContext(ErrorContext)

  if (!error) {
    throw new Error('Missing <ErrorProvider>')
  }

  return error
}
