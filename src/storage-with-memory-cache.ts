import { IStorage } from './types.js'

export class StorageWithMemoryCache<Structure extends Record<string, unknown>> {
  private cache = new Map<
    keyof Structure
  , Structure[keyof Structure] | undefined
  >()

  constructor(private storage: IStorage<Structure>) {}

  async getItem<Key extends keyof Structure>(
    key: Key
  ): Promise<Structure[Key] | undefined> {
    if (this.cache.has(key)) {
      return this.cache.get(key) as Structure[Key]
    } else {
      const value = await this.storage.getItem(key)

      this.cache.set(key, value)

      return value
    }
  }

  async setItem<Key extends keyof Structure>(
    key: Key
  , value: Structure[Key]
  ): Promise<void> {
    this.cache.set(key, value)

    await this.storage.setItem(key, value)
  }

  async removeItem<Key extends keyof Structure>(
    key: Key
  ): Promise<void> {
    this.cache.set(key, undefined)

    await this.storage.removeItem(key)
  }

  async clear(): Promise<void> {
    for (const key of this.cache.keys()) {
      this.cache.set(key, undefined)
    }

    await this.storage.clear()
  }
}
