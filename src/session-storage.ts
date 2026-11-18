import { assert, isString } from '@blackglory/prelude'
import { IStorage } from './types.js'

export class SessionStorage<Structure extends Record<string, unknown>> implements IStorage<Structure> {
  async getItem<Key extends keyof Structure>(
    key: Key
  ): Promise<Structure[Key] | undefined> {
    assert(isString(key))

    const result = await chrome.storage.session.get(key) as Partial<Pick<Structure, Key>>
    
    return result[key]
  }

  async setItem<Key extends keyof Structure>(
    key: Key
  , value: Structure[Key]
  ): Promise<void> {
    await chrome.storage.session.set({
      [key]: value
    })
  }

  async removeItem(key: keyof Structure): Promise<void> {
    assert(isString(key))

    await chrome.storage.session.remove(key)
  }

  async clear(): Promise<void> {
    await chrome.storage.session.clear()
  }
}
