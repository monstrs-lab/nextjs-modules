import type { UiNode }  from '@ory/kratos-client'

import { ReactElement } from 'react'
import { FC }           from 'react'
import { useMemo }      from 'react'

import { useFlow }      from '../providers'

export type FlowNodesGroupChildren = (node: Array<UiNode>) => ReactElement<any>

export interface FlowNodesGroupProps {
  group: string
  children: ReactElement<any> | FlowNodesGroupChildren
}

export const FlowNodesGroup: FC<FlowNodesGroupProps> = ({ group, children }) => {
  const { flow } = useFlow()

  const nodes = useMemo(
    () => flow?.ui?.nodes?.filter((node) => node.group === group),
    [flow, group]
  )

  if (!(nodes && nodes.length > 0)) {
    return null
  }

  if (typeof children === 'function') {
    return children(nodes)
  }

  return children as ReactElement<any>
}
