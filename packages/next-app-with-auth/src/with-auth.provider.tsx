import { AuthProvider } from '@monstrs/react-auth'

import React            from 'react'
import { Component }    from 'react'

declare global {
  interface Window {
    __NEXT_DATA__: any
  }
}

type Props = {
  token?: string
}

export const withAuth = () => (WrapperComponent) =>
  class WithAuth extends Component<Props> {
    static async getInitialProps(context) {
      let props = {}

      const {
        ctx: { req },
      } = context

      if (WrapperComponent.getInitialProps) {
        props = await WrapperComponent.getInitialProps(context)
      }

      let token = null

      if (req && req.get('authorization')) {
        token = req.get('authorization')
      } else if ((process as any).browser) {
        // eslint-disable-next-line no-underscore-dangle
        token = window.__NEXT_DATA__.props.token
      }

      return {
        ...props,
        token,
      }
    }

    render() {
      const { token } = this.props

      return (
        <AuthProvider value={token}>
          <WrapperComponent {...this.props} token={token} />
        </AuthProvider>
      )
    }
  }
