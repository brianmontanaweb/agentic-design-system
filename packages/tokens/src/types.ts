// DTCG token type interfaces — imported by both index.ts and generated.ts

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
  readonly $value: string
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
