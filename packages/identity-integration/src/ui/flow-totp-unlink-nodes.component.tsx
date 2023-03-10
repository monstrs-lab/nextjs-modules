import type { UiNodeInputAttributes } from '@ory/client'

import { ReactElement }               from 'react'
import { FC }                         from 'react'
import { useMemo }                    from 'react'

import { FlowUiInputNode }            from './flow-input-node.component'
import { useFlow }                    from '../providers'

export interface FlowTotpUnlinkNodesProps {
  children: (nodes: Array<FlowUiInputNode>) => ReactElement<any>
}

export const FlowTotpUnlinkNodes: FC<FlowTotpUnlinkNodesProps> = ({ children }) => {
  const { flow } = useFlow()

  const nodes = useMemo(
    () =>
      flow?.ui?.nodes?.filter(
        (node) =>
          node.group === 'totp' && (node.attributes as UiNodeInputAttributes).name === 'unlink'
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
