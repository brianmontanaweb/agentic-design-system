// Token type interfaces for the generated exports. The DTCG 2025.10 object
// values (color components, dimension {value, unit}, …) live only in the
// tokens/*.json sources; generate.ts serializes them to CSS-ready strings, so
// these types describe the serialized platform output.

export interface ColorModeToken {
  readonly dark: string
  readonly light: string
  readonly $type: 'color'
  readonly $description?: string
}

export interface ColorToken {
  readonly $value: string
  readonly $type: 'color'
  readonly $description?: string
}

export interface DimensionToken {
  readonly $value: string
  readonly $type: 'dimension'
  readonly $description?: string
}

export interface FontFamilyToken {
  readonly $value: string
  readonly $type: 'fontFamily'
  readonly $description?: string
}

export interface FontWeightToken {
  readonly $value: number
  readonly $type: 'fontWeight'
  readonly $description?: string
}

export interface DurationToken {
  readonly $value: string
  readonly $type: 'duration'
  readonly $description?: string
}

export interface ShadowToken {
  readonly $value: string
  readonly $type: 'shadow'
  readonly $description?: string
}

export interface NumberToken {
  readonly $value: number
  readonly $type: 'number'
  readonly $description?: string
}
