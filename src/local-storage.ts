import browser from 'webextension-polyfill'

export class LocalStorage<Storage extends Record<string, unknown>> {
  async getItem<Key extends keyof Storage>(key: Key): Promise<Storage[Key]> {
    const result = await browser.storage.local.get(
      key as string
    ) as Pick<Storage, Key>
    
    return result[key]
  }

  async setItem<Key extends keyof Storage>(key: Key, value: Storage[Key]): Promise<void> {
    await browser.storage.local.set({ [key]: value })
  }

  async removeItem<Key extends keyof Storage>(key: Key): Promise<void> {
    await browser.storage.local.remove(key as string)
  }

  async clear(): Promise<void> {
    await browser.storage.local.clear()
  }
}
