using WPCordovaClassLib.Cordova.JSON;

namespace WPCordovaClassLib.Cordova.Commands
{
    public class $NAME : BaseCommand
    {
        public void life(string args)
        {
            string val = JsonHelper.Deserialize<string[]>(args)[0].ToUpper();
            DispatchCommandResult(new PluginResult(PluginResult.Status.OK, val));
        }
    }
}
