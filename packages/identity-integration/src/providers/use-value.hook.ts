import type { Body }   from './flow.interfaces'

import { useState }    from 'react'
import { useEffect }   from 'react'
import { useCallback } from 'react'

import { useValues }   from './use-values.hook'

export const useValue = (name: string): [string, (value: string) => void] => {
  const values = useValues()

  const [value, setValue] = useState<string>(values.getValue(name as keyof Body) as string)

  useEffect(() => {
    values.on(name, setValue)

    return (): void => {
      values.off(name, setValue)
    }
  }, [values, name])

  const onChange = useCallback(
    (val: string): void => {
      values.setValue(name as keyof Body, val)
    },
    [values, name]
  )

  return [value, onChange]
}
