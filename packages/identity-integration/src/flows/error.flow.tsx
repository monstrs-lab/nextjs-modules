import type { FlowError }  from '@ory/client'
import type { AxiosError } from 'axios'
import type { FC }         from 'react'
import type { ReactNode }  from 'react'

import { useRouter }       from 'next/navigation'
import { useSearchParams } from 'next/navigation'
import { useState }        from 'react'
import { useEffect }       from 'react'
import React               from 'react'

import { ErrorProvider }   from '../providers'
import { kratos }          from '../sdk'

export interface ErrorErrorProps {
  children: ReactNode
}

export const ErrorFlow: FC<ErrorErrorProps> = ({ children }) => {
  const [error, setError] = useState<FlowError>()
  const [loading, setLoading] = useState<boolean>(true)
  const router = useRouter()

  const searchparams = useSearchParams()

  const id = searchparams.get('id')

  useEffect(() => {
    if (error) {
      return
    }

    kratos
      .getFlowError({ id: String(id) })
      .then(({ data }) => {
        setError(data)
      })
      .catch(async (err: AxiosError) => {
        // eslint-disable-next-line default-case
        switch (err.response?.status) {
          case 404:
          case 403:
          case 410: {
            router.push('/auth/login')
            return Promise.resolve()
          }
        }

        return Promise.reject(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [id, router, error])

  return <ErrorProvider value={{ error, loading }}>{children}</ErrorProvider>
}
