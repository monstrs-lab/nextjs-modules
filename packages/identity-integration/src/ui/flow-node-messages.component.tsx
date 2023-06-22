import type { UiText }       from '@ory/client'
import type { ReactElement } from 'react'
import type { FC }           from 'react'

import { useFlowNode }       from '../providers'

export interface FlowNodeMessagesProps {
  name: string
  children: (messages: Array<UiText>) => ReactElement
}

export const FlowNodeMessages: FC<FlowNodeMessagesProps> = ({ name, children }) => {
  const node = useFlowNode(name)

  if (typeof children === 'function' && node?.messages) {
    return children(node.messages)
  }

  return null
}
