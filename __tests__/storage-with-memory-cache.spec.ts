import { describe, test, expect, vi } from 'vitest'
import { StorageWithMemoryCache } from '@src/storage-with-memory-cache.js'
import { IStorage } from '@src/types.js'

class TestStorageWithMemoryCache<
  Structure extends Record<string, unknown>
> extends StorageWithMemoryCache<Structure> {
  getCache() {
    return this.cache
  }
}

describe('StorageWithMemoryCache', () => {
  describe('getItem', () => {
    describe('cache miss', () => {
      test('item exists', async () => {
        const map = new Map()
        map.set('foo', 'bar')
        const storage = createMockedStorage(map)
        const storageWithCache = new TestStorageWithMemoryCache(storage)

        const result = await storageWithCache.getItem('foo')

        expect(result).toBe('bar')
        expect(storage.getItem).toHaveBeenCalledExactlyOnceWith('foo')
        expect(storageWithCache.getCache().get('foo')).toBe('bar')
      })

      test('item does not exist', async () => {
        const map = new Map()
        const storage = createMockedStorage(map)
        const storageWithCache = new TestStorageWithMemoryCache(storage)

        const result = await storageWithCache.getItem('foo')

        expect(result).toBe(undefined)
        expect(storage.getItem).toHaveBeenCalledExactlyOnceWith('foo')
        const cache = storageWithCache.getCache()
        expect(cache.has('foo')).toBe(true)
        expect(cache.get('foo')).toBe(undefined)
      })
    })

    test('cache hit', async () => {
      const map = new Map()
      map.set('foo', 'bar')
      const storage = createMockedStorage(map)
      const storageWithCache = new TestStorageWithMemoryCache(storage)
      const cache = storageWithCache.getCache()
      cache.set('foo', 'baz')

      const result = await storageWithCache.getItem('foo')

      expect(result).toBe('baz')
      expect(storage.getItem).not.toHaveBeenCalled()
      expect(cache.get('foo')).toBe('baz')
    })
  })

  test('setItem', async () => {
    const map = new Map()
    const storage = createMockedStorage(map)
    const storageWithCache = new TestStorageWithMemoryCache(storage)

    await storageWithCache.setItem('foo', 'bar')

    expect(storage.setItem).toHaveBeenCalledExactlyOnceWith('foo', 'bar')
    expect(map.get('foo')).toBe('bar')
    expect(storageWithCache.getCache().get('foo')).toBe('bar')
  })

  test('removeItem', async () => {
    const map = new Map()
    const storage = createMockedStorage(map)
    const storageWithCache = new TestStorageWithMemoryCache(storage)

    await storageWithCache.removeItem('foo')

    expect(storage.removeItem).toHaveBeenCalledExactlyOnceWith('foo')
    expect(map.has('foo')).toBe(false)
    const cache = storageWithCache.getCache()
    expect(cache.has('foo')).toBe(true)
    expect(cache.get('foo')).toBe(undefined)
  })

  test('clear', async () => {
    const map = new Map()
    const storage = createMockedStorage(map)
    const storageWithCache = new TestStorageWithMemoryCache(storage)
    const cache = storageWithCache.getCache()
    cache.set('foo', 'bar')

    await storageWithCache.clear()

    expect(storage.clear).toHaveBeenCalledExactlyOnceWith()
    expect(map.has('foo')).toBe(false)
    expect(cache.has('foo')).toBe(true)
    expect(cache.get('foo')).toBe(undefined)
  })
})

function createMockedStorage<Structure extends Record<string, unknown>>(
  map: Map<keyof Structure, Structure[keyof Structure]>
): IStorage<Structure> {
  return {
    getItem: vi.fn(async <Key extends keyof Structure>(
      key: Key
    ): Promise<Structure[Key] | undefined> => {
      const result = map.get(key)
      return result as Structure[Key] | undefined
    }) as IStorage<Structure>['getItem']
  , setItem: vi.fn(async <Key extends keyof Structure>(
      key: Key
    , value: Structure[Key]
    ) => {
      map.set(key, value)
    })
  , removeItem: vi.fn(async (key: keyof Structure): Promise<void> => {
      map.delete(key)
    })
  , clear: vi.fn(async (): Promise<void> => {
      map.clear()
    })
  }
}
