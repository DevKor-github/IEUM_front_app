//
//  ShareViewController.swift
//  ieum-share
//
//  Created by 황정민 on 10/3/24.
//

import UIKit
import Social

class ShareViewController: SLComposeServiceViewController {

    override func isContentValid() -> Bool {
        // Do validation of contentText and/or NSExtensionContext attachments here
        return true
    }

    override func didSelectPost() {
        // This is called after the user selects Post. Do the upload of contentText and/or NSExtensionContext attachments.

        // Inform the host that we're done, so it un-blocks its UI. Note: Alternatively you could call super's -didSelectPost, which will similarly complete the extension context.
          if let extensionItem = extensionContext?.inputItems.first as? NSExtensionItem {

                      // 텍스트 처리
              if let text = extensionItem.attributedContentText?.string {
                  handleSharedText(text)
              }

              if let attachments = extensionItem.attachments {
                    for attachment in attachments {
                        // URL 타입이 있는지 확인
                        if attachment.hasItemConformingToTypeIdentifier("public.url") {
                            // URL 데이터를 로드
                            attachment.loadItem(forTypeIdentifier: "public.url", options: nil) { (urlItem, error) in
                                if let url = urlItem as? URL {
                                    // 여기서 URL을 처리할 수 있습니다.
                                    print("Received URL: \(url)")
                                    self.handleURL(url)
                                    self.sendTextToBackend(url.absoluteString) {// 요청 완료 후 Extension 종료
                                        self.extensionContext?.completeRequest(returningItems: [], completionHandler: nil)
                                    }
                                }
                            }
                        }
                    }
                }

              // Extension 종료
              self.extensionContext?.completeRequest(returningItems: [], completionHandler: nil)
          }

       self.extensionContext!.completeRequest(returningItems: [], completionHandler: nil)
    }

  func handleSharedText(_ text: String) {
      // UserDefaults를 사용하여 React Native에 텍스트 전달
      let sharedDefaults = UserDefaults(suiteName: "group.club.devkor.ieum.api") // 앱과 공유할 App Group 설정
      sharedDefaults?.set(text, forKey: "sharedText")
      sharedDefaults?.synchronize() // 값 저장

      // 필요한 경우 추가 처리 로직
  }

  func handleURL(_ url: URL) {
      // URL을 백엔드로 보내는 코드
      // URLSession을 사용하여 POST 요청을 보내는 방법 등을 사용할 수 있습니다.
    let sharedDefaults = UserDefaults(suiteName: "group.club.devkor.ieum.api") // 앱과 공유할 App Group 설정
    sharedDefaults?.set(url.absoluteString, forKey: "sharedText")
    sharedDefaults?.synchronize() // 값 저장
  }

  func sendTextToBackend(_ text: String, completion: @escaping () -> Void) {
      // 백엔드 요청 작업
    let url = URL(string: "https://dev.api.ieum.devkor.club/crawling")!
    var request = URLRequest(url: url)
    request.httpMethod = "POST"

    let userDefaults = UserDefaults(suiteName: "group.club.devkor.ieum.api")
    if let accessToken = userDefaults?.string(forKey: "access_token") {
//       print("Received access token: \(accessToken)")
        // Access token을 사용하여 필요한 작업 수행
      request.setValue("Bearer \(accessToken)", forHTTPHeaderField: "Authorization")
    }

    request.setValue("application/json", forHTTPHeaderField: "Content-Type")

    let json: [String: Any] = ["link": text]
    let jsonData = try? JSONSerialization.data(withJSONObject: json)

    let task = URLSession.shared.uploadTask(with: request, from: jsonData) { data, response, error in
        completion() // 요청 완료 시 호출
    }
    task.resume()
  }

    override func configurationItems() -> [Any]! {
        // To add configuration options via table cells at the bottom of the sheet, return an array of SLComposeSheetConfigurationItem here.
        return []
    }

}
