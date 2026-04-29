import { describe, it, expectTypeOf } from 'vitest'
import type { ReactNode } from 'react'
import type {
  AgentStatusProps,
  AgentStatusValue,
  ThinkingIndicatorProps,
  ProgressStepsProps,
  Step,
  StepStatus,
  ToolCallCardProps,
  ToolCallStatus,
  StreamingTextProps,
  MessageThreadProps,
  MessageBubbleProps,
  MessageRole,
} from '../index'

describe('AgentStatusValue type', () => {
  it('includes all 6 MCP lifecycle states', () => {
    expectTypeOf<AgentStatusValue>().toEqualTypeOf<
      'idle' | 'running' | 'waiting' | 'done' | 'error' | 'cancelled'
    >()
  })

  it('does not accept arbitrary strings', () => {
    expectTypeOf<'active'>().not.toMatchTypeOf<AgentStatusValue>()
    expectTypeOf<'stopped'>().not.toMatchTypeOf<AgentStatusValue>()
  })
})

describe('AgentStatusProps types', () => {
  it('status is required and constrained to AgentStatusValue', () => {
    expectTypeOf<AgentStatusProps['status']>().toEqualTypeOf<AgentStatusValue>()
  })

  it('label is an optional string', () => {
    expectTypeOf<AgentStatusProps['label']>().toEqualTypeOf<string | undefined>()
  })
})

describe('ThinkingIndicatorProps types', () => {
  it('label is an optional string', () => {
    expectTypeOf<ThinkingIndicatorProps['label']>().toEqualTypeOf<string | undefined>()
  })
})

describe('StepStatus type', () => {
  it('includes all 5 step states', () => {
    expectTypeOf<StepStatus>().toEqualTypeOf<
      'pending' | 'active' | 'complete' | 'waiting' | 'cancelled'
    >()
  })
})

describe('Step interface', () => {
  it('id and label are required strings', () => {
    expectTypeOf<Step['id']>().toEqualTypeOf<string>()
    expectTypeOf<Step['label']>().toEqualTypeOf<string>()
  })

  it('status is required and constrained to StepStatus', () => {
    expectTypeOf<Step['status']>().toEqualTypeOf<StepStatus>()
  })

  it('description is an optional string', () => {
    expectTypeOf<Step['description']>().toEqualTypeOf<string | undefined>()
  })
})

describe('ProgressStepsProps types', () => {
  it('steps is a required Step array', () => {
    expectTypeOf<ProgressStepsProps['steps']>().toEqualTypeOf<Step[]>()
  })
})

describe('ToolCallStatus type', () => {
  it('is a union of the four expected status strings', () => {
    expectTypeOf<ToolCallStatus>().toEqualTypeOf<'pending' | 'running' | 'done' | 'error'>()
  })
})

describe('ToolCallCardProps types', () => {
  it('toolName is a required string', () => {
    expectTypeOf<ToolCallCardProps['toolName']>().toEqualTypeOf<string>()
  })

  it('input is an optional record of unknown values', () => {
    expectTypeOf<ToolCallCardProps['input']>().toEqualTypeOf<Record<string, unknown> | undefined>()
  })

  it('output is an optional string', () => {
    expectTypeOf<ToolCallCardProps['output']>().toEqualTypeOf<string | undefined>()
  })

  it('status is optional and constrained to ToolCallStatus', () => {
    expectTypeOf<ToolCallCardProps['status']>().toEqualTypeOf<ToolCallStatus | undefined>()
  })

  it('defaultOpen is an optional boolean', () => {
    expectTypeOf<ToolCallCardProps['defaultOpen']>().toEqualTypeOf<boolean | undefined>()
  })
})

describe('StreamingTextProps types', () => {
  it('text is a required string', () => {
    expectTypeOf<StreamingTextProps['text']>().toEqualTypeOf<string>()
  })

  it('isStreaming is an optional boolean', () => {
    expectTypeOf<StreamingTextProps['isStreaming']>().toEqualTypeOf<boolean | undefined>()
  })

  it('fontSize and color are optional strings', () => {
    expectTypeOf<StreamingTextProps['fontSize']>().toEqualTypeOf<string | undefined>()
    expectTypeOf<StreamingTextProps['color']>().toEqualTypeOf<string | undefined>()
  })
})

describe('MessageRole type', () => {
  it('is a union of the three message role strings', () => {
    expectTypeOf<MessageRole>().toEqualTypeOf<'user' | 'assistant' | 'tool'>()
  })

  it('does not accept arbitrary strings', () => {
    expectTypeOf<'system'>().not.toMatchTypeOf<MessageRole>()
    expectTypeOf<'bot'>().not.toMatchTypeOf<MessageRole>()
  })
})

describe('MessageBubbleProps types', () => {
  it('sender is required and constrained to MessageRole', () => {
    expectTypeOf<MessageBubbleProps['sender']>().toEqualTypeOf<MessageRole>()
  })

  it('content is a required ReactNode', () => {
    expectTypeOf<MessageBubbleProps['content']>().toEqualTypeOf<ReactNode>()
  })

  it('label and timestamp are optional strings', () => {
    expectTypeOf<MessageBubbleProps['label']>().toEqualTypeOf<string | undefined>()
    expectTypeOf<MessageBubbleProps['timestamp']>().toEqualTypeOf<string | undefined>()
  })
})

describe('MessageThreadProps types', () => {
  it('children is a required ReactNode', () => {
    expectTypeOf<MessageThreadProps['children']>().toEqualTypeOf<ReactNode>()
  })

  it('maxHeight, autoScroll, and aria-label are optional', () => {
    expectTypeOf<MessageThreadProps['maxHeight']>().toEqualTypeOf<string | undefined>()
    expectTypeOf<MessageThreadProps['autoScroll']>().toEqualTypeOf<boolean | undefined>()
    expectTypeOf<MessageThreadProps['aria-label']>().toEqualTypeOf<string | undefined>()
  })
})
