/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable default-case */

import type { UpdateVerificationFlowBody }                 from '@ory/client'
import type { VerificationFlow as KratosVerificationFlow } from '@ory/client'
import type { AxiosError }                                 from 'axios'
import type { ReactNode }                                  from 'react'
import type { FC }                                         from 'react'
import type { ReactElement }                               from 'react'

import { useRouter }                                       from 'next/navigation'
import { useSearchParams }                                 from 'next/navigation'
import { useState }                                        from 'react'
import { useEffect }                                       from 'react'
import { useMemo }                                         from 'react'
import { useCallback }                                     from 'react'
import React                                               from 'react'

import { FlowProvider }                                    from '../providers'
import { ValuesProvider }                                  from '../providers'
import { ValuesStore }                                     from '../providers'
import { SubmitProvider }                                  from '../providers'
import { kratos }                                          from '../sdk'

export interface VerificationFlowProps {
  children: ReactNode
  onError?: (error: { id: string }) => void
}

export const VerificationFlow: FC<VerificationFlowProps> = ({
  children,
  onError,
}): ReactElement => {
  const [flow, setFlow] = useState<KratosVerificationFlow>()
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
        .getVerificationFlow({ id: String(flowId) }, { withCredentials: true })
        .then(({ data }) => {
          setFlow(data)
        })
        .catch((error: AxiosError) => {
          switch (error.response?.status) {
            case 410:
            case 403: {
              router.push('/auth/verification')
              return
            }
          }

          throw error
        })
        .finally(() => {
          setLoading(false)
        })

      return
    }

    kratos
      .createBrowserVerificationFlow(
        { returnTo: returnTo ? String(returnTo) : undefined },
        {
          withCredentials: true,
        }
      )
      .then(({ data }) => {
        setFlow(data)
      })
      .catch((error: AxiosError) => {
        switch (error.response?.status) {
          case 400: {
            router.push('/')
            return
          }
        }

        throw error
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
      override?: Partial<UpdateVerificationFlowBody>,
      onSubmitConfirm?: () => void,
      onSubmitError?: (error: unknown) => void
    ) => {
      setSubmitting(true)

      const body = {
        ...(values.getValues() as UpdateVerificationFlowBody),
        ...(override || {}),
      }

      kratos
        .updateVerificationFlow(
          { flow: String(flow?.id), updateVerificationFlowBody: body },
          {
            withCredentials: true,
          }
        )
        .then(({ data }) => {
          if (onSubmitConfirm) {
            onSubmitConfirm()
          }
          setFlow(data)
        })
        .catch((error: AxiosError) => {
          if (onSubmitError) {
            onSubmitError(error.message)
          }
          switch (error.response?.status) {
            case 400:
              setFlow(error.response?.data)
              return
          }

          throw error
        })
        .finally(() => {
          setSubmitting(false)
        })
    },
    [flow, values, setSubmitting]
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
