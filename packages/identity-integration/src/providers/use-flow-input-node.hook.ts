import type { UiNodeInputAttributes } from '@ory/client'
import type { UiNode }                from '@ory/client'

import { UiNodeTypeEnum }             from '@ory/client'

import { useMemo }                    from 'react'

import { useFlow }                    from './use-flow.hook'

export interface FlowUiInputNode extends UiNode {
  attributes: UiNodeInputAttributes
}

export const useFlowInputNode = (nameOrId: string): FlowUiInputNode | undefined => {
  const { flow } = useFlow()

  const node = useMemo(
    () =>
      flow?.ui?.nodes?.find(({ attributes, type }) => {
        if (type === UiNodeTypeEnum.Input) {
          return (attributes as UiNodeInputAttributes).name === nameOrId
        }

        return false
      }),
    [flow, nameOrId]
  )

  return node as FlowUiInputNode | undefined
}
