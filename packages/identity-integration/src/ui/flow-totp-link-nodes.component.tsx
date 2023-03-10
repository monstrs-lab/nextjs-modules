import type { UiNodeInputAttributes } from '@ory/client'

import { ReactElement }               from 'react'
import { FC }                         from 'react'
import { useMemo }                    from 'react'

import { FlowUiInputNode }            from './flow-input-node.component'
import { useFlow }                    from '../providers'

export interface FlowTotpLinkNodesProps {
  children: (nodes: Array<FlowUiInputNode>) => ReactElement<any>
}

export const FlowTotpLinkNodes: FC<FlowTotpLinkNodesProps> = ({ children }) => {
  const { flow } = useFlow()

  const nodes = useMemo(
    () =>
      flow?.ui?.nodes?.filter(
        (node) =>
          node.group === 'totp' && (node.attributes as UiNodeInputAttributes).name === 'link'
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
