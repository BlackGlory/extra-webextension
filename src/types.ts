export interface IStorage<Structure extends Record<string, unknown>> {
  getItem<Key extends keyof Structure>(
    key: Key
  ): Promise<Structure[Key] | undefined>

  setItem<Key extends keyof Structure>(
    key: Key
  , value: Structure[Key]
  ): Promise<void>

  removeItem<Key extends keyof Structure>(
    key: Key
  ): Promise<void>

  clear(): Promise<void>
}
