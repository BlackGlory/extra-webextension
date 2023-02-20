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
function getActiveTab(): Promise<browser.tabs.Tab>
```

### LocalStorage
```ts
class LocalStorage<Storage extends Record<string, unknown>> {
  getItem<Key extends keyof Storage>(key: Key): Promise<Storage[Key]>
  setItem<Key extends keyof Storage>(key: Key, value: Storage[Key]): Promise<void>
  removeItem<Key extends keyof Storage>(key: Key): Promise<void>
  clear(): Promise<void>
}
```
