cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
  {
    "id": "cordova-plugin-safariviewcontroller.SafariViewController",
    "file": "plugins/cordova-plugin-safariviewcontroller/www/SafariViewController.js",
    "pluginId": "cordova-plugin-safariviewcontroller",
    "clobbers": [
      "SafariViewController"
    ]
  },
  {
    "id": "cordova-plugin-customurlscheme.LaunchMyApp",
    "file": "plugins/cordova-plugin-customurlscheme/www/android/LaunchMyApp.js",
    "pluginId": "cordova-plugin-customurlscheme",
    "clobbers": [
      "window.plugins.launchmyapp"
    ]
  },
  {
    "id": "cordova-plugin-inappbrowser.inappbrowser",
    "file": "plugins/cordova-plugin-inappbrowser/www/inappbrowser.js",
    "pluginId": "cordova-plugin-inappbrowser",
    "clobbers": [
      "cordova.InAppBrowser.open",
      "window.open"
    ]
  },
  {
    "id": "cordova-sqlite-storage.SQLitePlugin",
    "file": "plugins/cordova-sqlite-storage/www/SQLitePlugin.js",
    "pluginId": "cordova-sqlite-storage",
    "clobbers": [
      "SQLitePlugin"
    ]
  },
  {
    "id": "cordova-plugin-ms-azure-mobile-apps.AzureMobileServices.Ext",
    "file": "plugins/cordova-plugin-ms-azure-mobile-apps/www/MobileServices.Cordova.Ext.js",
    "pluginId": "cordova-plugin-ms-azure-mobile-apps",
    "runs": true
  },
  {
    "id": "cordova-plugin-ms-azure-mobile-apps.AzureMobileServices",
    "file": "plugins/cordova-plugin-ms-azure-mobile-apps/www/MobileServices.Cordova.js",
    "pluginId": "cordova-plugin-ms-azure-mobile-apps",
    "clobbers": [
      "WindowsAzure"
    ]
  }
];
module.exports.metadata = 
// TOP OF METADATA
{
  "cordova-plugin-whitelist": "1.3.3",
  "cordova-plugin-safariviewcontroller": "1.5.3",
  "cordova-plugin-customurlscheme": "4.3.0",
  "cordova-plugin-inappbrowser": "2.0.2",
  "cordova-sqlite-storage": "2.2.0",
  "cordova-plugin-ms-azure-mobile-apps": "2.0.1"
};
// BOTTOM OF METADATA
});