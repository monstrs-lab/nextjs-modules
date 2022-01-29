import { useSubmit } from '../providers'

export const FlowSubmit = ({ children }) => {
  const submit = useSubmit()

  if (typeof children === 'function') {
    return children(submit)
  }

  return null
}
