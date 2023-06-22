import type { ReactNode }  from 'react'
import type { AxiosError } from 'axios'

import { useRouter }       from 'next/navigation'
import { useState }        from 'react'
import { useEffect }       from 'react'

import { kratos }          from '../sdk'

export interface LogoutFlowProps {
  children: ReactNode
}

export const LogoutFlow = ({ children }: LogoutFlowProps): ReactNode => {
  const [logoutToken, setLogoutToken] = useState<string>('')
  const router = useRouter()

  useEffect(() => {
    kratos
      .createBrowserLogoutFlow(undefined, { withCredentials: true })
      .then(({ data }) => {
        setLogoutToken(data.logout_token)
      })
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
  }, [router])

  useEffect(() => {
    if (logoutToken) {
      kratos
        .updateLogoutFlow({ token: logoutToken }, { withCredentials: true })
        .then(() => {
          router.push('/auth/login')
        })
        .then(() => {
          window.location.reload()
        })
    }
  }, [logoutToken, router])

  return children
}
