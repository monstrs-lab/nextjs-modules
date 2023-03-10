import type { UiNodeTextAttributes } from '@ory/client'
import type { UiNode }               from '@ory/client'

import { UiNodeTypeEnum }            from '@ory/client'

import { ReactElement }              from 'react'
import { FC }                        from 'react'

import { useFlowNode }               from '../providers'

export interface FlowUiTextNode extends UiNode {
  attributes: UiNodeTextAttributes
}

export interface FlowTextNodeProps {
  name: string
  children: (node: FlowUiTextNode) => ReactElement<any>
}

export const FlowTextNode: FC<FlowTextNodeProps> = ({ name, children }) => {
  const node = useFlowNode(name)

  if (node && node.type === UiNodeTypeEnum.Text && typeof children === 'function') {
    return children(node as FlowUiTextNode)
  }

  return null
}
