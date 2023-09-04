import type { UpdateRecoveryFlowBody }             from '@ory/client'
import type { RecoveryFlow as KratosRecoveryFlow } from '@ory/client'
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

export interface RecoveryFlowProps {
  children: ReactNode
  onError?: (error: { id: string }) => void
}

export const RecoveryFlow: FC<RecoveryFlowProps> = ({ children, onError }): ReactElement => {
  const [flow, setFlow] = useState<KratosRecoveryFlow>()
  const [submitting, setSubmitting] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const values = useMemo(() => new ValuesStore(), [])
  const router = useRouter()

  const searchparams = useSearchParams()

  const returnTo = searchparams.get('return_to')
  const flowId = searchparams.get('flow')
  const refresh = searchparams.get('refresh')
  const aal = searchparams.get('all')

  useEffect(() => {
    if (flow) {
      return
    }

    if (flowId) {
      kratos
        .getRecoveryFlow({ id: String(flowId) }, { withCredentials: true })
        .then(({ data }) => {
          setFlow(data)
        })
        .catch(handleFlowError(router, 'recovery', setFlow, onError))
        .finally(() => {
          setLoading(false)
        })

      return
    }

    kratos
      .createBrowserRecoveryFlow(
        { returnTo: returnTo ? String(returnTo) : undefined },
        {
          withCredentials: true,
        }
      )
      .then(({ data }) => {
        setFlow(data)
      })
      .catch(handleFlowError(router, 'recovery', setFlow, onError))
      .catch(async (error: AxiosError) => {
        if (error.response?.status === 400) {
          setFlow(error.response?.data as KratosRecoveryFlow)

          return
        }

        // eslint-disable-next-line consistent-return
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
    (
      override?: Partial<UpdateRecoveryFlowBody>,
      onSubmitConfirm?: () => void,
      onSubmitError?: (error: unknown) => void
    ) => {
      setSubmitting(true)

      const body = {
        ...(values.getValues() as UpdateRecoveryFlowBody),
        ...(override || {}),
      } as UpdateRecoveryFlowBody

      kratos
        .updateRecoveryFlow(
          { flow: String(flow?.id), updateRecoveryFlowBody: body },
          { withCredentials: true }
        )
        .then(({ data }) => {
          setFlow(data)
        })
        .catch(handleFlowError(router, 'recovery', setFlow, onSubmitError))
        .catch(async (error: AxiosError) => {
          if (error.response?.status === 400) {
            setFlow(error.response?.data as KratosRecoveryFlow)

            return
          }

          // eslint-disable-next-line consistent-return
          return Promise.reject(error)
        })
        .finally(() => {
          if (onSubmitConfirm) {
            onSubmitConfirm()
          }
          setSubmitting(false)
        })
    },
    [router, flow, values, setSubmitting]
  )

  return (
    <FlowProvider value={{ flow, loading }}>
      <ValuesProvider value={values}>
        {/* @ts-expect-error */}
        <SubmitProvider value={{ submitting, onSubmit }}>{children}</SubmitProvider>
      </ValuesProvider>
    </FlowProvider>
  )
}
