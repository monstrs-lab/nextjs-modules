import type { UiNodeTextAttributes } from '@ory/client'
import type { UiNode }               from '@ory/client'
import type { ReactElement }         from 'react'
import type { FC }                   from 'react'

import { UiNodeTypeEnum }            from '@ory/client'

import { useFlowNode }               from '../providers'

export interface FlowUiTextNode extends UiNode {
  attributes: UiNodeTextAttributes
}

export interface FlowTextNodeProps {
  name: string
  children: (node: FlowUiTextNode) => ReactElement
}

export const FlowTextNode: FC<FlowTextNodeProps> = ({ name, children }) => {
  const node = useFlowNode(name)

  if (node && node.type === UiNodeTypeEnum.Text && typeof children === 'function') {
    return children(node as FlowUiTextNode)
  }

  return null
}
