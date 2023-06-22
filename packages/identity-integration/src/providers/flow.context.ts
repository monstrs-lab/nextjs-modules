import type { Flow }     from './flow.interfaces'

import { createContext } from 'react'

export interface ContextFlow {
  flow?: Flow
  loading: boolean
}

const Context = createContext<ContextFlow>({ loading: false })

const { Provider, Consumer } = Context

export const FlowProvider = Provider
export const FlowConsumer = Consumer
export const FlowContext = Context
