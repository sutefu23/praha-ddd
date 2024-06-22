// TSの型ガードを使ってRecord<string, unknown>を判定する
export const isRecord = (value: any): value is Record<string, unknown> => {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}
