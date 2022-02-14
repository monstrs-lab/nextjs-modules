import { SubmitSelfServiceRegistrationFlowBody } from '@ory/kratos-client'
import { SelfServiceRegistrationFlow }           from '@ory/kratos-client'
import { UiNodeInputAttributes }                 from '@ory/kratos-client'

import React                                     from 'react'
import { AxiosError }                            from 'axios'
import { FC }                                    from 'react'
import { useRouter }                             from 'next/router'
import { useState }                              from 'react'
import { useEffect }                             from 'react'
import { useMemo }                               from 'react'
import { useCallback }                           from 'react'

import { FlowProvider }                          from '../providers'
import { ValuesProvider }                        from '../providers'
import { ValuesStore }                           from '../providers'
import { SubmitProvider }                        from '../providers'
import { kratos }                                from '../sdk'
import { handleFlowError }                       from './handle-errors.util'

export interface RegistrationFlowProps {
  onError?: (error: { id: string }) => void
}

export const RegistrationFlow: FC<RegistrationFlowProps> = ({ children, onError }) => {
  const [flow, setFlow] = useState<SelfServiceRegistrationFlow>()
  const [submitting, setSubmitting] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const values = useMemo(() => new ValuesStore(), [])
  const router = useRouter()

  const { return_to: returnTo, flow: flowId, refresh, aal } = router.query

  useEffect(() => {
    if (!router.isReady || flow) {
      return
    }

    if (flowId) {
      kratos
        .getSelfServiceRegistrationFlow(String(flowId), undefined, { withCredentials: true })
        .then(({ data }) => {
          setFlow(data)
        })
        .catch(handleFlowError(router, 'registration', setFlow, onError))
        .finally(() => setLoading(false))

      return
    }

    kratos
      .initializeSelfServiceRegistrationFlowForBrowsers(returnTo ? String(returnTo) : undefined, {
        withCredentials: true,
      })
      .then(({ data }) => {
        setFlow(data)
      })
      .catch(handleFlowError(router, 'registration', setFlow, onError))
      .finally(() => setLoading(false))
  }, [flowId, router, router.isReady, aal, refresh, returnTo, flow, onError])

  useEffect(() => {
    if (flow) {
      values.setFromFlow(flow)
    }
  }, [values, flow])

  const onSubmit = useCallback(
    (override?: Partial<SubmitSelfServiceRegistrationFlowBody>) => {
      setSubmitting(true)

      const [submitNode] = [
        flow?.ui.nodes.find(
          ({ attributes, group }) =>
            group === 'password' && (attributes as UiNodeInputAttributes).type === 'submit'
        ),
        flow?.ui.nodes.find(
          ({ attributes }) => (attributes as UiNodeInputAttributes).type === 'submit'
        ),
      ].flat()

      const body = {
        ...(values.getValues() as SubmitSelfServiceRegistrationFlowBody),
        ...(submitNode
          ? {
              [(submitNode.attributes as UiNodeInputAttributes).name]: (
                submitNode.attributes as UiNodeInputAttributes
              ).value,
            }
          : {}),
        ...(override || {}),
      }

      kratos
        .submitSelfServiceRegistrationFlow(String(flow?.id), body, { withCredentials: true })
        .then(() => {
          if (flow?.return_to) {
            window.location.href = flow?.return_to
          } else {
            router.push('/profile/settings').then(() => router.reload())
          }
        })
        .catch(handleFlowError(router, 'registration', setFlow))
        .catch((error: AxiosError) => {
          if (error.response?.status === 400) {
            setFlow(error.response?.data)

            return
          }

          // eslint-disable-next-line consistent-return
          return Promise.reject(error)
        })
        .finally(() => setSubmitting(false))
    },
    [router, flow, values, setSubmitting]
  )

  return (
    <FlowProvider value={{ flow, loading }}>
      <ValuesProvider value={values}>
        <SubmitProvider value={{ submitting, onSubmit }}>{children}</SubmitProvider>
      </ValuesProvider>
    </FlowProvider>
  )
}
