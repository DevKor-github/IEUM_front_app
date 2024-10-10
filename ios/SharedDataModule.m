//
//  SharedDataModule.m
//  IEUM_front_app
//
//  Created by 황정민 on 10/3/24.
//

#import <Foundation/Foundation.h>
#import "React/RCTBridgeModule.h"

@interface RCT_EXTERN_MODULE(SharedDataModule, NSObject)

RCT_EXTERN_METHOD(getSharedText:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(saveAccessToken:(NSString *)token)
RCT_EXTERN_METHOD(saveRefreshToken:(NSString *)token)

@end
