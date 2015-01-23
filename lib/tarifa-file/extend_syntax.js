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

    function transformer(configuration, platformName, configurationName) {
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
    }

    if (settings.configurations) {
        settings.configurations = mapConfigurations(settings, transformer);
    }

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
 * `transformer` Called with three arguments: configuration, platform name
 *            and configuration name. Expects a configuration in return.
 *
 *  returns a new configurations
 */

function mapConfigurations(settings, transformer) {
    var platforms = settings.platforms || [];
    var transformed = {};

    platforms.forEach(function(platform) {
        if (settings.configurations && settings.configurations[platform]) {
            transformed[platform] = {};
            Object.keys(settings.configurations[platform]).forEach(function(configurationName) {
                transformed[platform][configurationName] = transformer(settings.configurations[platform][configurationName], platform, configurationName);
            });
        }
    });

    return transformed;
}

module.exports = extendSyntax;