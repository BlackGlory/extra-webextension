import { assert, isString } from '@blackglory/prelude'
import { IStorage } from './types.js'

export class LocalStorage<Structure extends Record<string, unknown>> implements IStorage<Structure> {
  async getItem<Key extends keyof Structure>(
    key: Key
  ): Promise<Structure[Key] | undefined> {
    assert(isString(key))

    const result = await chrome.storage.local.get(key) as Partial<Pick<Structure, Key>>

    return result[key]
  }

  async setItem<Key extends keyof Structure>(
    key: Key
  , value: Structure[Key]
  ): Promise<void> {
    await chrome.storage.local.set({
      [key]: value
    })
  }

  async removeItem(key: keyof Structure): Promise<void> {
    assert(isString(key))

    await chrome.storage.local.remove(key)
  }

  async clear(): Promise<void> {
    await chrome.storage.local.clear()
  }
}
