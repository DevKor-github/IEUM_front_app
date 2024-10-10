//
//  SharedDataModule.swift
//  IEUM_front_app
//
//  Created by 황정민 on 10/3/24.
//

import Foundation
@objc(SharedDataModule)
class SharedDataModule: NSObject {

  @objc
  func getSharedText(_ resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
    if let sharedDefaults = UserDefaults(suiteName: "group.club.devkor.ieum.api") {
      if let sharedText = sharedDefaults.string(forKey: "sharedText") {
        resolve(sharedText) // 성공 시 텍스트 반환
      } else {
        reject("no_text", "No shared text found", nil) // 실패 시 에러 반환
      }
    } else {
      reject("no_text", "No shared text found", nil)
    }
  }

  @objc
  func saveAccessToken(_ token: String) {
      let userDefaults = UserDefaults(suiteName: "group.club.devkor.ieum.api")
//       print("access token", token)
      userDefaults?.set(token, forKey: "access_token")
      userDefaults?.synchronize()
  }
  @objc
  func saveRefreshToken(_ token: String) {
      let userDefaults = UserDefaults(suiteName: "group.club.devkor.ieum.api")
      userDefaults?.set(token, forKey: "refresh_token")
      userDefaults?.synchronize()
  }
}
