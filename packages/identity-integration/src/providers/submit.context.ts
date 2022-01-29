import { createContext } from 'react'

export interface ContextSubmit {
  onSubmit: () => void
  submitting: boolean
}

const Context = createContext<ContextSubmit>({ submitting: false, onSubmit: () => ({}) })

const { Provider, Consumer } = Context

export const SubmitProvider = Provider
export const SubmitConsumer = Consumer
export const SubmitContext = Context
