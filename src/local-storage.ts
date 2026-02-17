import { assert, isString } from '@blackglory/prelude'

export class LocalStorage<Storage extends Record<string, unknown>> {
  async getItem<Key extends keyof Storage>(
    key: Key
  ): Promise<Storage[Key] | undefined> {
    assert(isString(key))

    const result = await chrome.storage.local.get(key) as Partial<Pick<Storage, Key>>

    return result[key]
  }

  async setItem<Key extends keyof Storage>(
    key: Key
  , value: Storage[Key]
  ): Promise<void> {
    await chrome.storage.local.set({
      [key]: value
    })
  }

  async removeItem<Key extends keyof Storage>(key: Key): Promise<void> {
    assert(isString(key))

    await chrome.storage.local.remove(key)
  }

  async clear(): Promise<void> {
    await chrome.storage.local.clear()
  }
}
