import type { ValuesStore } from './values.store'

import { useContext }       from 'react'

import { ValuesContext }    from './values.context'

export const useValues = (): ValuesStore => {
  const values = useContext(ValuesContext)

  if (!values) {
    throw new Error('Missing <ValuesProvider>')
  }

  return values
}
