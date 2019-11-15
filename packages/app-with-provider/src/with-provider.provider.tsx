/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react'

type Props = {}

export const withProvider = () => WrapperComponent =>
  class WithProvider extends Component<Props> {
    render() {
      return <WrapperComponent {...this.props} />
    }
  }
