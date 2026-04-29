import { describe, it, expectTypeOf } from 'vitest'
import type { ReactNode } from 'react'
import type {
  AgenticProviderProps,
  ButtonProps,
  ButtonVariant,
  ButtonSize,
  CodeBlockProps,
} from '../index'

describe('AgenticProviderProps types', () => {
  it('defaultColorScheme is optional and only accepts dark or light', () => {
    expectTypeOf<AgenticProviderProps['defaultColorScheme']>().toEqualTypeOf<
      'dark' | 'light' | undefined
    >()
  })
})

describe('ButtonVariant type', () => {
  it('is a union of the four expected variant strings', () => {
    expectTypeOf<ButtonVariant>().toEqualTypeOf<'solid' | 'outline' | 'ghost' | 'danger'>()
  })

  it('does not include arbitrary strings', () => {
    expectTypeOf<'primary'>().not.toMatchTypeOf<ButtonVariant>()
    expectTypeOf<'secondary'>().not.toMatchTypeOf<ButtonVariant>()
  })
})

describe('ButtonSize type', () => {
  it('is a union of the three expected size strings', () => {
    expectTypeOf<ButtonSize>().toEqualTypeOf<'sm' | 'md' | 'lg'>()
  })

  it('does not include arbitrary strings', () => {
    expectTypeOf<'xs'>().not.toMatchTypeOf<ButtonSize>()
    expectTypeOf<'xl'>().not.toMatchTypeOf<ButtonSize>()
  })
})

describe('ButtonProps types', () => {
  it('variant is optional and constrained to ButtonVariant', () => {
    expectTypeOf<ButtonProps['variant']>().toEqualTypeOf<ButtonVariant | undefined>()
  })

  it('size is optional and constrained to ButtonSize', () => {
    expectTypeOf<ButtonProps['size']>().toEqualTypeOf<ButtonSize | undefined>()
  })

  it('type is optional and constrained to button element type values', () => {
    expectTypeOf<ButtonProps['type']>().toEqualTypeOf<'button' | 'submit' | 'reset' | undefined>()
  })

  it('disabled, loading, fullWidth are optional booleans', () => {
    expectTypeOf<ButtonProps['disabled']>().toEqualTypeOf<boolean | undefined>()
    expectTypeOf<ButtonProps['loading']>().toEqualTypeOf<boolean | undefined>()
    expectTypeOf<ButtonProps['fullWidth']>().toEqualTypeOf<boolean | undefined>()
  })

  it('loadingText is an optional string', () => {
    expectTypeOf<ButtonProps['loadingText']>().toEqualTypeOf<string | undefined>()
  })
})

describe('CodeBlockProps types', () => {
  it('children is a required ReactNode', () => {
    expectTypeOf<CodeBlockProps['children']>().toEqualTypeOf<ReactNode>()
  })

  it('language is an optional string', () => {
    expectTypeOf<CodeBlockProps['language']>().toEqualTypeOf<string | undefined>()
  })
})
