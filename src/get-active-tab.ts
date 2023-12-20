export async function getActiveTab(): Promise<chrome.tabs.Tab> {
  const currentWindow = await chrome.windows.getCurrent()
  const tabs = await chrome.tabs.query({
    active: true
  , windowId: currentWindow.id
  })
  return tabs[0]
}
