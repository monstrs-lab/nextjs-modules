import type { Body }     from './flow.interfaces'

import { createContext } from 'react'

export interface ContextSubmit {
  onSubmit: (
    override?: Partial<Body>,
    onSubmitConfirm?: () => void,
    onSubmitError?: (error: unknown) => void
  ) => void
  submitting: boolean
}

const Context = createContext<ContextSubmit>({ submitting: false, onSubmit: () => ({}) })

const { Provider, Consumer } = Context

export const SubmitProvider = Provider
export const SubmitConsumer = Consumer
export const SubmitContext = Context
