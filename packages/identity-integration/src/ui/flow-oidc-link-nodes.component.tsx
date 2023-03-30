import type { UiNodeInputAttributes } from '@ory/client'

import { ReactElement }               from 'react'
import { FC }                         from 'react'
import { useMemo }                    from 'react'

import { FlowUiInputNode }            from './flow-input-node.component'
import { useFlow }                    from '../providers'

export interface FlowOidcLinkNodesProps {
  children: (nodes: Array<FlowUiInputNode>) => ReactElement<any>
}

export const FlowOidcLinkNodes: FC<FlowOidcLinkNodesProps> = ({ children }) => {
  const { flow } = useFlow()

  const nodes = useMemo(
    () =>
      flow?.ui?.nodes?.filter(
        (node) =>
          node.group === 'oidc' && (node.attributes as UiNodeInputAttributes).name === 'link'
      ),
    [flow]
  )

  if (!(nodes && nodes.length > 0)) {
    return null
  }

  if (typeof children === 'function') {
    return children(nodes as Array<FlowUiInputNode>)
  }

  return children as ReactElement<any>
}