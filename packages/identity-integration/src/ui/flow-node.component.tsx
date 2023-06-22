import type { UiNode }       from '@ory/client'
import type { ReactElement } from 'react'
import type { FC }           from 'react'
import type { ChangeEvent }  from 'react'

import { useCallback }       from 'react'

import { useFlowNode }       from '../providers'
import { useValue }          from '../providers'

type OnChangeCallback = (event: ChangeEvent<HTMLInputElement> | string) => void

export interface FlowNodeProps {
  name: string
  children: (node: UiNode, value: string, callback: OnChangeCallback) => ReactElement
}

export const FlowNode: FC<FlowNodeProps> = ({ name, children }) => {
  const node = useFlowNode(name)
  const [value, setValue] = useValue(name)

  const onChange = useCallback(
    (event: ChangeEvent<HTMLInputElement> | string) => {
      if (typeof event === 'string') {
        setValue(event)
      } else if (event?.target) {
        setValue(event.target.value)
      }
    },
    [setValue]
  )

  if (node && typeof children === 'function') {
    return children(node, value, onChange)
  }

  return null
}
