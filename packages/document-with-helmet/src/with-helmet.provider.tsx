import React                            from 'react'
import Helmet                           from 'react-helmet'
import { Head, Html, Main, NextScript } from 'next/document'

export const withHelmet = () => TargetComponent =>
  class WithHelmet extends TargetComponent {
    static async getInitialProps(context) {
      const props = await super.getInitialProps(context)

      const helmet = Helmet.renderStatic()
      const helmetHead = Object.keys(helmet)
        .filter(el => el !== 'htmlAttributes' && el !== 'bodyAttributes')
        .map(el => helmet[el].toComponent())
        .flat()

      props.head = [...props.head, ...helmetHead]

      return { ...props, helmet }
    }

    get helmetHtmlAttrComponents() {
      return this.props.helmet.htmlAttributes.toComponent()
    }

    get helmetBodyAttrComponents() {
      return this.props.helmet.bodyAttributes.toComponent()
    }

    render() {
      return (
        <Html {...this.helmetHtmlAttrComponents}>
          <Head />
          <body {...this.helmetBodyAttrComponents}>
            <Main />
            <NextScript />
          </body>
        </Html>
      )
    }
  }
