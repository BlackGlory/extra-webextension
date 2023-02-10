import browser from 'webextension-polyfill'

export async function getActiveTab(): Promise<browser.Tabs.Tab> {
  const currentWindow = await browser.windows.getCurrent()
  const tabs = await browser.tabs.query({
    active: true
  , windowId: currentWindow.id
  })
  return tabs[0]
}
