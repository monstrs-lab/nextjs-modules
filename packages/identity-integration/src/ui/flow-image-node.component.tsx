import type { UiNodeImageAttributes } from '@ory/client'
import type { UiNode }                from '@ory/client'

import { UiNodeTypeEnum }             from '@ory/client'

import { ReactElement }               from 'react'
import { FC }                         from 'react'

import { useFlowNode }                from '../providers'

export interface FlowUiImageNode extends UiNode {
  attributes: UiNodeImageAttributes
}

export interface FlowImageNodeProps {
  name: string
  children: (node: FlowUiImageNode) => ReactElement<any>
}

export const FlowImageNode: FC<FlowImageNodeProps> = ({ name, children }) => {
  const node = useFlowNode(name)

  if (node && node.type === UiNodeTypeEnum.Img && typeof children === 'function') {
    return children(node as FlowUiImageNode)
  }

  return null
}
