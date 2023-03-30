import type { UiNodeInputAttributes } from '@ory/client'
import type { UiNode }                from '@ory/client'

import { UiNodeTypeEnum }             from '@ory/client'

import { ReactElement }               from 'react'
import { useEffect }    from 'react'
import { FC }                         from 'react'
import { FormEvent }                  from 'react'
import { useCallback }                from 'react'

import { useFlowNode }                from '../providers'
import { useValue }                   from '../providers'

type OnChangeCallback = (event: FormEvent<HTMLInputElement> | string | any) => void

export interface FlowUiInputNode extends UiNode {
  attributes: UiNodeInputAttributes
}

export interface FlowInputNodeProps {
  name: string
  defaultValue?: string
  children: (
    node: FlowUiInputNode,
    value: string | any,
    callback: OnChangeCallback
  ) => ReactElement<any>
}

export const FlowInputNode: FC<FlowInputNodeProps> = ({ name, defaultValue, children }) => {
  const node = useFlowNode(name)
  const [value, setValue] = useValue(name)

  useEffect(() => {
    if (!value && defaultValue) {
      setValue(defaultValue)
    }
  })

  const onChange = useCallback(
    (event: FormEvent<HTMLInputElement> | string | any) => {
      if (event && event.target) {
        setValue(event.target.value)
      } else {
        setValue(event)
      }
    },
    [setValue]
  )

  if (node && node.type === UiNodeTypeEnum.Input && typeof children === 'function') {
    return children(node as FlowUiInputNode, value, onChange)
  }

  return null
}
