import { AxiosError } from 'axios'
import { useRouter }  from 'next/router'
import { useState }   from 'react'
import { useEffect }  from 'react'

import { kratos }     from '../sdk'

export const LogoutFlow = ({ children }) => {
  const [logoutToken, setLogoutToken] = useState<string>('')
  const router = useRouter()

  useEffect(() => {
    if (!router.isReady) {
      return
    }

    kratos
      .createSelfServiceLogoutFlowUrlForBrowsers()
      .then(({ data }) => {
        setLogoutToken(data.logout_token)
      })
      .catch((error: AxiosError) => {
        // eslint-disable-next-line default-case
        switch (error.response?.status) {
          case 401:
            return
        }

        // eslint-disable-next-line consistent-return
        return Promise.reject(error)
      })
  }, [router, router.isReady])

  useEffect(() => {
    if (logoutToken) {
      kratos
        .submitSelfServiceLogoutFlow(logoutToken)
        .then(() => router.push('/auth/login'))
        .then(() => router.reload())
    }
  }, [logoutToken, router])

  return children
}
