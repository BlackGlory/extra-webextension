import { assert, isString } from '@blackglory/prelude'

export class SessionStorage<Storage extends Record<string, unknown>> {
  async getItem<Key extends keyof Storage>(
    key: Key
  ): Promise<Storage[Key] | undefined> {
    assert(isString(key))

    const result = await chrome.storage.session.get(key) as Partial<Pick<Storage, Key>>
    
    return result[key]
  }

  async setItem<Key extends keyof Storage>(
    key: Key
  , value: Storage[Key]
  ): Promise<void> {
    await chrome.storage.session.set({
      [key]: value
    })
  }

  async removeItem<Key extends keyof Storage>(key: Key): Promise<void> {
    assert(isString(key))

    await chrome.storage.session.remove(key)
  }

  async clear(): Promise<void> {
    await chrome.storage.session.clear()
  }
}
