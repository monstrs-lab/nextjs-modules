import type { UpdateSettingsFlowBody }             from '@ory/client'
import type { SettingsFlow as KratosSettingsFlow } from '@ory/client'
import type { AxiosError }                         from 'axios'
import type { FC }                                 from 'react'
import type { ReactNode }                          from 'react'
import type { ReactElement }                       from 'react'

import { useRouter }                               from 'next/navigation'
import { useSearchParams }                         from 'next/navigation'
import { useState }                                from 'react'
import { useEffect }                               from 'react'
import { useMemo }                                 from 'react'
import { useCallback }                             from 'react'
import React                                       from 'react'

import { FlowProvider }                            from '../providers'
import { ValuesProvider }                          from '../providers'
import { ValuesStore }                             from '../providers'
import { SubmitProvider }                          from '../providers'
import { kratos }                                  from '../sdk'
import { handleFlowError }                         from './handle-errors.util'

export interface SettingsFlowProps {
  children: ReactNode
  onError?: (error: { id: string }) => void
}

export const SettingsFlow: FC<SettingsFlowProps> = ({ children, onError }): ReactElement => {
  const [flow, setFlow] = useState<KratosSettingsFlow>()
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
        .getSettingsFlow({ id: String(flowId) }, { withCredentials: true })
        .then(({ data }) => {
          setFlow(data)
        })
        .catch(handleFlowError(router, 'settings', setFlow, onError))
        .finally(() => {
          setLoading(false)
        })

      return
    }

    kratos
      .createBrowserSettingsFlow(
        { returnTo: returnTo ? String(returnTo) : undefined },
        {
          withCredentials: true,
        }
      )
      .then(({ data }) => {
        setFlow(data)
      })
      .catch(handleFlowError(router, 'settings', setFlow, onError))
      .catch(async (error: AxiosError) => {
        // eslint-disable-next-line default-case
        switch (error.response?.status) {
          case 401: {
            router.push('/auth/login')

            return Promise.resolve()
          }
        }

        return Promise.reject(error)
      })
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
    (override?: Partial<UpdateSettingsFlowBody>) => {
      setSubmitting(true)

      const body = {
        ...(values.getValues() as UpdateSettingsFlowBody),
        ...(override || {}),
      }

      kratos
        .updateSettingsFlow(
          { flow: String(flow?.id), updateSettingsFlowBody: body },
          { withCredentials: true }
        )
        .then(({ data }) => {
          setFlow(data)
        })
        .catch(handleFlowError(router, 'settings', setFlow))
        .catch(async (error: AxiosError) => {
          if (error.response?.status === 400) {
            setFlow(error.response?.data as KratosSettingsFlow)

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
