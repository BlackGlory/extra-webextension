import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { LocalStorage } from '../local-storage.js'
import { SessionStorage } from '../session-storage.js'

// Mock chrome.storage API
const createStorageMock = () => {
  const store: Record<string, unknown> = {}
  return {
    local: {
      get: vi.fn(async (key: string) => {
        if (key === null || key === undefined) return store
        return { [key]: store[key] }
      }),
      set: vi.fn(async (items: Record<string, unknown>) => {
        Object.assign(store, items)
      }),
      remove: vi.fn(async (key: string) => {
        delete store[key]
      }),
      clear: vi.fn(async () => {
        Object.keys(store).forEach(k => delete store[k])
      })
    },
    session: {
      get: vi.fn(async (key: string) => {
        if (key === null || key === undefined) return store
        return { [key]: store[key] }
      }),
      set: vi.fn(async (items: Record<string, unknown>) => {
        Object.assign(store, items)
      }),
      remove: vi.fn(async (key: string) => {
        delete store[key]
      }),
      clear: vi.fn(async () => {
        Object.keys(store).forEach(k => delete store[k])
      })
    }
  }
}

// Setup global chrome mock
let storageMock: ReturnType<typeof createStorageMock>

beforeEach(() => {
  storageMock = createStorageMock()
  global.chrome = {
    storage: storageMock as unknown as typeof chrome.storage
  } as unknown as typeof chrome
})

afterEach(() => {
  vi.resetAllMocks()
})

describe('LocalStorage', () => {
  it('should get item from storage', async () => {
    storageMock.local.get.mockResolvedValueOnce({ key: 'value' })
    const storage = new LocalStorage<{ key: string }>()
    const result = await storage.getItem('key')
    expect(result).toBe('value')
    expect(storageMock.local.get).toHaveBeenCalledWith('key')
  })

  it('should set item in storage', async () => {
    const storage = new LocalStorage<{ key: string }>()
    await storage.setItem('key', 'value')
    expect(storageMock.local.set).toHaveBeenCalledWith({ key: 'value' })
  })

  it('should remove item from storage', async () => {
    const storage = new LocalStorage<{ key: string }>()
    await storage.removeItem('key')
    expect(storageMock.local.remove).toHaveBeenCalledWith('key')
  })

  it('should clear storage', async () => {
    const storage = new LocalStorage<Record<string, unknown>>()
    await storage.clear()
    expect(storageMock.local.clear).toHaveBeenCalled()
  })

  it('should return undefined for non-existent key', async () => {
    storageMock.local.get.mockResolvedValueOnce({})
    const storage = new LocalStorage<{ key: string } & Record<string, unknown>>()
    const result = await storage.getItem('nonexistent' as keyof { key: string })
    expect(result).toBeUndefined()
  })
})

describe('SessionStorage', () => {
  it('should get item from session storage', async () => {
    storageMock.session.get.mockResolvedValueOnce({ key: 'value' })
    const storage = new SessionStorage<{ key: string }>()
    const result = await storage.getItem('key')
    expect(result).toBe('value')
    expect(storageMock.session.get).toHaveBeenCalledWith('key')
  })

  it('should set item in session storage', async () => {
    const storage = new SessionStorage<{ key: string }>()
    await storage.setItem('key', 'value')
    expect(storageMock.session.set).toHaveBeenCalledWith({ key: 'value' })
  })

  it('should remove item from session storage', async () => {
    const storage = new SessionStorage<{ key: string }>()
    await storage.removeItem('key')
    expect(storageMock.session.remove).toHaveBeenCalledWith('key')
  })

  it('should clear session storage', async () => {
    const storage = new SessionStorage<Record<string, unknown>>()
    await storage.clear()
    expect(storageMock.session.clear).toHaveBeenCalled()
  })

  it('should return undefined for non-existent key', async () => {
    storageMock.session.get.mockResolvedValueOnce({})
    const storage = new SessionStorage<{ key: string } & Record<string, unknown>>()
    const result = await storage.getItem('nonexistent' as keyof { key: string })
    expect(result).toBeUndefined()
  })

  it('should handle complex values', async () => {
    const complexValue = { nested: { key: 'value' }, array: [1, 2, 3] }
    const storage = new SessionStorage<{ data: typeof complexValue }>()
    await storage.setItem('data', complexValue)
    expect(storageMock.session.set).toHaveBeenCalledWith({ data: complexValue })
  })
})
