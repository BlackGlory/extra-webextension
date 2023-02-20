export class SessionStorage<Storage extends Record<string, any>> {
  async getItem<Key extends keyof Storage>(key: Key): Promise<Storage[Key]> {
    const result = await chrome.storage.session.get(
      key as string
    ) as Pick<Storage, Key>
    
    return result[key]
  }

  async setItem<Key extends keyof Storage>(key: Key, value: Storage[Key]): Promise<void> {
    await chrome.storage.session.set({ [key]: value })
  }

  async removeItem<Key extends keyof Storage>(key: Key): Promise<void> {
    await chrome.storage.session.remove(key as string)
  }

  async clear(): Promise<void> {
    await chrome.storage.session.clear()
  }
}
