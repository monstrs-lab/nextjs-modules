import type { FlowError }    from '@ory/client'
import type { ReactElement } from 'react'
import type { FC }           from 'react'

import { useError }          from '../providers'

export interface ErrorNodeProps {
  children: (node: FlowError) => ReactElement
}

export const ErrorNode: FC<ErrorNodeProps> = ({ children }) => {
  const { error } = useError()

  if (error && typeof children === 'function') {
    return children(error)
  }

  return null
}
