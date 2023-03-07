import type { SelfServiceError } from '@ory/kratos-client'

import { ReactElement }          from 'react'
import { FC }                    from 'react'

import { useError }              from '../providers'

export interface ErrorNodeProps {
  children: (node: SelfServiceError) => ReactElement<any>
}

export const ErrorNode: FC<ErrorNodeProps> = ({ children }) => {
  const { error } = useError()

  if (error && typeof children === 'function') {
    return children(error)
  }

  return null
}
