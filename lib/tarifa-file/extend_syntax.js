var Q = require('q'),
    collections = require('../helper/collections'),
    format = require('util').format;

/**
 * Implement "extend" attribute inside configurations objects.
 * It allows to extend objects defined in "configurations_mixins".
 *
 * {
 *   "configurations_mixins": {
 *     "green": {
 *       assets_path: "images/green"
 *     }
 *   },
 *   "configurations": {
 *     "ios": {
 *       "green_dev": {
 *         "extend": "green"
 *       }
 *     }
 *   }
 * }
 *
 * Will result in an extended configuration
 * { ..
 *   "configurations": {
 *     "ios": {
 *       "green_dev": {
 *         "extend": "green",
 *         "assets_path": "images/green"
 *       }
 *     }
 *   }
 * }
 */

function extendSyntax(settings) {
    var errors = [];

    var mixins = settings.configurations_mixins || {};
    mapConfigurations(settings, function(configuration, platformName, configurationName) {
        if (configuration.hasOwnProperty('extend')) {
            if (!mixins.hasOwnProperty(configuration.extend)) {
                errors.push(format('Invalid configuration mixin "%s" extended in platform "%s", configuration "%s"', configuration.extend, platformName, configurationName));
                return configuration;
            } else {
                return collections.mergeObject(mixins[configuration.extend], configuration, true);
            }
        } else {
          return configuration;
        }
    });

    if (errors.length > 0) {
        return Q.reject(errors.join("\n"));
    } else {
        return settings;
    }

    return settings;
}

/**
 * Map all configurations for all platforms with a callback function.
 *
 * `settings` tarifa configuration
 * `callback` Called with three arguments: configuration, platform name
 *            and configuration name. Expects a configuration in return.
 */

function mapConfigurations(settings, callback) {
    var platforms = settings.platforms || [];
    platforms.forEach(function(platform) {
        if (settings.configurations && settings.configurations[platform]) {
            Object.keys(settings.configurations[platform]).forEach(function(configurationName) {
                settings.configurations[platform][configurationName] = callback(settings.configurations[platform][configurationName], platform, configurationName);
            });
        }
    });
}

module.exports = extendSyntax;