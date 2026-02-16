import { assert } from '@blackglory/prelude'
import { first } from 'extra-utils'

export async function getActiveTab(): Promise<chrome.tabs.Tab> {
  const currentWindow = await chrome.windows.getCurrent()
  const tabs = await chrome.tabs.query({
    active: true
  , windowId: currentWindow.id
  })

  const activeTab = first(tabs)
  assert(activeTab, 'There is no active tab')

  return activeTab
}
