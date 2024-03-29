/**
 * This file is part of the Meup Kickstarter.
 *
 * (c) 1001pharmacies <http://github.com/1001pharmacies/kicksterter>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

var fs  = require('fs');
var pkg = JSON.parse(fs.readFileSync(__dirname + '/../package.json').toString());

exports.VERSION       = pkg.version;
exports.DEFAULT_PORT  = process.env.PORT || 1234;

// log levels
exports.LOG_DISABLE = 'OFF';
exports.LOG_ERROR   = 'ERROR';
exports.LOG_WARN    = 'WARN';
exports.LOG_INFO    = 'INFO';
exports.LOG_DEBUG   = 'DEBUG';

// Default patterns for the pattern layout.
exports.COLOR_PATTERN     = '%[%p [%c]: %]%m';
exports.NO_COLOR_PATTERN  = '%p [%c]: %m';

// Default console appender
exports.CONSOLE_APPENDER = {
  type: 'console',
  layout: {
    type: 'pattern',
    pattern: exports.COLOR_PATTERN
  }
};
