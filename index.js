var Promise = require('bluebird')

module.exports = fetch
module.exports.mock = mock

function getMethod(options) {
    return (options && options.method) ? options.method : 'GET'
}

function fetch(url, options) {
    return new Promise(function(resolve, reject) {
        var method = getMethod(options)
        if (!_mocks[method] || !_mocks[method][url] || _mocks[method][url].length == 0)
            reject(new Error('No mock available for ' + url + ':' + options))
        resolve(_mocks[method][url].shift())
    })
}

fetch.isMock = function() { return true }

var _mocks = {}

function mock(url, options) {
    var method = getMethod(options)
    if (!_mocks[method]) {
        _mocks[method] = {}
    }
    if (!_mocks[method][url]) {
        _mocks[method][url] = []
    }
    var response = (options && options.response) ? options.response : {
        status: options.status ? options.status : 200
    }
    response.json = () => new Promise((resolve, reject) => resolve(options.json))
    _mocks[method][url].push(response)
}

