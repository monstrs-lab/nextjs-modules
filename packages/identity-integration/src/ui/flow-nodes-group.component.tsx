import type { UiNodeInputAttributes } from '@ory/kratos-client'
import type { UiNodeImageAttributes } from '@ory/kratos-client'

import { UiNode }                     from '@ory/kratos-client'

import { ReactElement }               from 'react'
import { FC }                         from 'react'
import { useMemo }                    from 'react'

import { useFlow }                    from '../providers'

export type FlowNodesGroupChildren = (node: Array<UiNode>) => ReactElement<any>

export interface FlowNodesGroupProps {
  nameOrId: string
  children: ReactElement<any> | FlowNodesGroupChildren
}

export const FlowNodesGroup: FC<FlowNodesGroupProps> = ({ nameOrId, children }) => {
  const { flow } = useFlow()

  const nodes = useMemo(
    () =>
      flow?.ui?.nodes?.filter(({ attributes }) => {
        if ((attributes as UiNodeInputAttributes).name) {
          return (attributes as UiNodeInputAttributes).name === nameOrId
        }

        if ((attributes as UiNodeImageAttributes).id) {
          return (attributes as UiNodeImageAttributes).id === nameOrId
        }

        return false
      }),
    [flow, nameOrId]
  )

  if (!(nodes && nodes.length > 0)) {
    return null
  }

  if (typeof children === 'function') {
    return children(nodes)
  }

  return children as ReactElement<any>
}
