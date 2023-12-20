import { assert } from '@blackglory/prelude'
import { SessionStorage } from './session-storage.js'
import { timeout, TimeoutError } from 'extra-promise'

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
const installDetailsPromise = new Promise<chrome.runtime.InstalledDetails>(resolve => {
  chrome.runtime.onInstalled.addListener(resolve)
})

export async function waitForLaunch(): Promise<LaunchDetails> {
  const activeFlagKey = '_extraWebextensionActiveFlag'
  const storage = new SessionStorage<{ [activeFlagKey]?: boolean }>()

  if (await storage.getItem(activeFlagKey)) {
    return { reason: LaunchReason.Activate }
  } else {
    await storage.setItem(activeFlagKey, true)

    try {
      const details = await Promise.race([
        installDetailsPromise // 在一般启动时, 该Promise永远不会完成.
      , timeout(1000) // 如果超时, 说明是一般启动.
      ])

      switch (details.reason) {
        case 'install': {
          return { reason: LaunchReason.Install }
        }
        case 'update': {
          assert(
            details.previousVersion
          , 'The details.previousVersion is undefined, which is unexpected.'
          )

          return {
            reason: LaunchReason.Update
          , previousVersion: details.previousVersion
          }
        }
        default: {
          return { reason: LaunchReason.Enable }
        }
      }
    } catch (e) {
      if (e instanceof TimeoutError) {
        return { reason: LaunchReason.Enable }
      } else {
        throw e
      }
    }
  }
}
