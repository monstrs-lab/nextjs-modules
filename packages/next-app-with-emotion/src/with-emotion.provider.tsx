import { CacheProvider } from '@emotion/core'

import React             from 'react'
import { ThemeProvider } from 'emotion-theming'
import { Component }     from 'react'
import { cache }         from 'emotion'

declare global {
  interface Window {
    __NEXT_DATA__: any
  }
}

type Options = {
  Provider: any
  injectGlobalStyles?: () => void
}

type Props = {}

export const withEmotion = ({ Provider = ThemeProvider, injectGlobalStyles }: Options) =>
  (WrapperComponent) =>
    class WithEmotion extends Component<Props> {
      constructor(props, context) {
        super(props, context)

        if (injectGlobalStyles) {
          injectGlobalStyles()
        }
      }

      render() {
        return (
          <CacheProvider value={cache}>
            <Provider>
              <WrapperComponent {...this.props} />
            </Provider>
          </CacheProvider>
        )
      }
    }
