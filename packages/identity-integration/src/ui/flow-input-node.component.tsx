import type { UiNodeInputAttributes } from '@ory/client'
import type { UiNode }                from '@ory/client'
import type { ReactElement }          from 'react'
import type { FC }                    from 'react'
import type { ChangeEvent }           from 'react'

import { UiNodeTypeEnum }             from '@ory/client'
import { useEffect }                  from 'react'
import { useCallback }                from 'react'

import { useFlowNode }                from '../providers'
import { useValue }                   from '../providers'

type OnChangeCallback = (event: ChangeEvent<HTMLInputElement> | string) => void

export interface FlowUiInputNode extends UiNode {
  attributes: UiNodeInputAttributes
}

export interface FlowInputNodeProps {
  name: string
  defaultValue?: string
  children: (node: FlowUiInputNode, value: string, callback: OnChangeCallback) => ReactElement
}

export const FlowInputNode: FC<FlowInputNodeProps> = ({ name, defaultValue, children }) => {
  const node = useFlowNode(name)
  const [value, setValue] = useValue(name)

  useEffect(() => {
    if (!value && defaultValue) {
      setValue(defaultValue)
    }
  }, [defaultValue]) // eslint-disable-line react-hooks/exhaustive-deps

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

  if (node && node.type === UiNodeTypeEnum.Input && typeof children === 'function') {
    return children(node as FlowUiInputNode, value, onChange)
  }

  return null
}
