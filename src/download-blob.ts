import browser from 'webextension-polyfill'

export async function downloadBlob(
  blob: Blob
, filename?: string
, saveAs?: boolean
): Promise<void> {
  const url = URL.createObjectURL(blob)
  try {
    const options: browser.Downloads.DownloadOptionsType = { url }
    if (typeof filename !== 'undefined') {
      options.filename = filename
    }
    if (typeof saveAs !== 'undefined') {
      options.saveAs = saveAs
    }

    await browser.downloads.download(options)
  } finally {
    URL.revokeObjectURL(url)
  }
}
