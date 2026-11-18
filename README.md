# extra-webextension
## Install
```sh
npm install --save extra-webextension
# or
yarn add extra-webextension
```

## API
### getActiveTab
```ts
function getActiveTab(): Promise<chrome.tabs.Tab>
```

### waitForLaunch
```ts
enum LaunchReason {
  Install
, Update
, Enable
, Activate
}

type LaunchDetails =
| { reason: LaunchReason.Install }
| {
    reason: LaunchReason.Update
    previousVersion: string
  }
| { reason: LaunchReason.Enable }
| { reason: LaunchReason.Activate }

function waitForLaunch(): Promise<LaunchDetails>
```

### Storage
```ts
interface IStorage<Structure extends Record<string, unknown>> {
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
```

#### LocalStorage
```ts
class LocalStorage<
  Structure extends Record<string, unknown>
> implements IStorage<Structure>
```

#### SessionStorage
```ts
class SessionStorage<
  Structure extends Record<string, unknown>
> implements IStorage<Structure>
```

#### StorageWithMemoryCache
```ts
class StorageWithMemoryCache<Structure extends Record<string, unknown>> {
  constructor(private storage: IStorage<Structure>)
}
```
