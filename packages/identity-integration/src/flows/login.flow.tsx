import type { UpdateLoginFlowBody }          from '@ory/client'
import type { LoginFlow as KratosLoginFlow } from '@ory/client'
import type { AxiosError }                   from 'axios'
import type { FC }                           from 'react'
import type { ReactNode }                    from 'react'
import type { ReactElement }                 from 'react'

import { useRouter }                         from 'next/navigation'
import { useSearchParams }                   from 'next/navigation'
import { useState }                          from 'react'
import { useEffect }                         from 'react'
import { useMemo }                           from 'react'
import { useCallback }                       from 'react'
import React                                 from 'react'

import { FlowProvider }                      from '../providers'
import { ValuesProvider }                    from '../providers'
import { ValuesStore }                       from '../providers'
import { SubmitProvider }                    from '../providers'
import { kratos }                            from '../sdk'
import { handleFlowError }                   from './handle-errors.util'

export interface LoginFlowProps {
  children: ReactNode
  onError?: (error: { id: string }) => void
}

export const LoginFlow: FC<LoginFlowProps> = ({ children, onError }): ReactElement => {
  const [flow, setFlow] = useState<KratosLoginFlow>()
  const [submitting, setSubmitting] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const values = useMemo(() => new ValuesStore(), [])
  const router = useRouter()

  const searchparams = useSearchParams()

  const returnTo = searchparams.get('return_to')
  const flowId = searchparams.get('flow')
  const refresh = searchparams.get('refresh')
  const aal = searchparams.get('aal')

  useEffect(() => {
    if (flow) {
      return
    }

    if (flowId) {
      kratos
        .getLoginFlow({ id: String(flowId) }, { withCredentials: true })
        .then(({ data }) => {
          setFlow(data)
        })
        .catch(handleFlowError(router, 'login', setFlow, onError))
        .finally(() => {
          setLoading(false)
        })

      return
    }

    kratos
      .createBrowserLoginFlow(
        {
          refresh: Boolean(refresh),
          aal: aal ? String(aal) : undefined,
          returnTo: returnTo ? String(returnTo) : undefined,
        },
        { withCredentials: true }
      )
      .then(({ data }) => {
        setFlow(data)
      })
      .catch(handleFlowError(router, 'login', setFlow, onError))
      .finally(() => {
        setLoading(false)
      })
  }, [flowId, router, aal, refresh, returnTo, flow, onError])

  useEffect(() => {
    if (flow) {
      values.setFromFlow(flow)
    }
  }, [values, flow])

  const onSubmit = useCallback(
    (override?: Partial<UpdateLoginFlowBody>) => {
      setSubmitting(true)

      const body = {
        ...(values.getValues() as UpdateLoginFlowBody),
        ...(override || {}),
      }

      kratos
        .updateLoginFlow(
          { flow: String(flow?.id), updateLoginFlowBody: body },
          { withCredentials: true }
        )
        .then(() => {
          if (flow?.return_to) {
            window.location.href = flow?.return_to
          } else {
            router.push('/profile/settings')
          }
        })
        .catch(handleFlowError(router, 'login', setFlow))
        .catch(async (error: AxiosError) => {
          if (error.response?.status === 400) {
            setFlow(error.response?.data as KratosLoginFlow)

            return
          }

          // eslint-disable-next-line consistent-return
          return Promise.reject(error)
        })
        .finally(() => {
          setSubmitting(false)
        })
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
