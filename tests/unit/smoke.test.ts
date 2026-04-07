import { describe, it, expect } from 'vitest'

describe('smoke test', () => {
  it('test environment is operational', () => {
    expect(true).toBe(true)
  })

  it('TypeScript is working', () => {
    const add = (a: number, b: number): number => a + b
    expect(add(1, 2)).toBe(3)
  })
})
