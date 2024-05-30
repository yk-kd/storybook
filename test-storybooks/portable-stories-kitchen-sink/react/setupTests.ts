/* eslint-disable @typescript-eslint/no-explicit-any */
import { setProjectAnnotations } from '@storybook/react'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import globalStorybookConfig from './.storybook/preview'

// runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup()
})
setProjectAnnotations(globalStorybookConfig)
