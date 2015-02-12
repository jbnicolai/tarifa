package $ID;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;

public class $NAME extends CordovaPlugin {
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        if (action.equals("life")) {
            callbackContext.success(life(args));
        } else {
            return false;
        }
        return true;
    }

    private static String life(JSONArray args) throws JSONException {
        return args.getString(0).toUpperCase();
    }
}
