import type { ReactElement } from 'react'
import type { FC }           from 'react'

import type { Body }         from '../providers'

import { useSubmit }         from '../providers'

export interface FlowSubmitProps {
  children: (submit: {
    onSubmit: (override?: Partial<Body>) => void
    submitting: boolean
  }) => ReactElement
}

export const FlowSubmit: FC<FlowSubmitProps> = ({ children }) => {
  const { submitting, onSubmit } = useSubmit()

  if (typeof children === 'function') {
    return children({
      submitting,
      onSubmit: (override?: Partial<Body>) => {
        onSubmit(override)
      },
    })
  }

  return null
}
