import { ReactElement }     from 'react'
import { FC }               from 'react'
import { FormEvent }        from 'react'
import { useCallback }      from 'react'

import { FlowUiInputNode }  from '../providers'
import { useFlowInputNode } from '../providers'
import { useValue }         from '../providers'

type OnChangeCallback = (event: FormEvent<HTMLInputElement> | string | any) => void

export interface FlowInputNodeProps {
  name: string
  children: (
    node: FlowUiInputNode,
    value: string | any,
    callback: OnChangeCallback
  ) => ReactElement<any>
}

export const FlowInputNode: FC<FlowInputNodeProps> = ({ name, children }) => {
  const node = useFlowInputNode(name)
  const [value, setValue] = useValue(name)

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

  if (node && typeof children === 'function') {
    return children(node, value, onChange)
  }

  return null
}
