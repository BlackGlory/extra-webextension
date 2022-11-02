# extra-webextension
## Install
```sh
npm install --save extra-webextension
# or
yarn add extra-webextension
```

## API
### downloadBlob
```ts
function downloadBlob(blob: Blob, filename?: string, saveAs?: boolean): Promise<void>
```

### getActiveTab
```ts
function getActiveTab(): Promise<browser.tabs.Tab>
```
