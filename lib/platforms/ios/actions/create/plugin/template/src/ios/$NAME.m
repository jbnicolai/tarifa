#import <Cordova/CDV.h>
#import "$NAME.h"

@implementation $NAME

- (void)life:(CDVInvokedUrlCommand*)command
{
    NSString* val = [[command.arguments objectAtIndex:0] uppercaseString];
    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:val];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

@end
