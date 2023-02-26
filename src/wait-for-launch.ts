import browser from 'webextension-polyfill'
import { go, assert, pass } from '@blackglory/prelude'
import { SessionStorage } from './session-storage.js'

export enum LaunchReason {
  Install
, Update
, Enable
, Activate
}

export type LaunchDetails =
| { reason: LaunchReason.Install }
| {
    reason: LaunchReason.Update
    previousVersion: string
  }
| { reason: LaunchReason.Enable }
| { reason: LaunchReason.Activate }

// 确保事件监听器在模块导入时就被注册.
const installedPromise = go(() => {
  const promise = new Promise<
  | { reason: LaunchReason.Install }
  | { reason: LaunchReason.Enable }
  | {
      reason: LaunchReason.Update
      previousVersion: string
    }
  >((resolve, reject) => {
    browser.runtime.onInstalled.addListener(async details => {
      try {
        switch (details.reason) {
          case 'install': {
            resolve({ reason: LaunchReason.Install })
            break
          }
          case 'update': {
            assert(
              details.previousVersion
            , 'The details.previousVersion is undefined, which is unexpected.'
            )

            resolve({
              reason: LaunchReason.Update
            , previousVersion: details.previousVersion
            })
            break
          }
          default: {
            resolve({ reason: LaunchReason.Enable })
            break
          }
        }
      } catch (e) {
        reject(e)
      }
    })
  })

  // 避免因未及时处理错误而抛出错误
  promise.catch(pass)

  return promise
})

export async function waitForLaunch(): Promise<LaunchDetails> {
  const activeFlagKey = '_extraWebextensionActiveFlag'
  const storage = new SessionStorage<{ [activeFlagKey]?: boolean }>()

  if (await storage.getItem(activeFlagKey)) {
    return { reason: LaunchReason.Activate }
  } else {
    await storage.setItem(activeFlagKey, true)
    return await installedPromise
  }
}
