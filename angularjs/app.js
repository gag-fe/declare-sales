'use strict';

/**
 * @ngdoc overview
 * @name newappApp
 * @description
 * # newappApp
 *
 * Main module of the application.
 */
window.gooagoodomain = '.test.goago.cn';
window.copyright = '2016';
var MakeApp = angular
    .module('newApp', [
        'ngAnimate',
        'ngCookies',
        'ngResource',
        'ngRoute',
        'ngSanitize',
        'ngTouch',
        'ui.bootstrap',
        'bsTable',
        'treeGrid',
        'ngFileUpload',
        'jsTree.directive',
        'angular-loading-bar',
        'cfp.loadingBar'
    ])
    .config(function($routeProvider,$httpProvider) {
        $httpProvider.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded';
        $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
        $httpProvider.defaults.transformRequest = [function(data) {
            var param = function(obj) {
                var query = '';
                var name, value, fullSubName, subName, subValue, innerObj, i;
                for (name in obj) {
                    value = obj[name];

                    if (value instanceof Array) {
                        for (i = 0; i < value.length; ++i) {
                            subValue = value[i];
                            fullSubName = name;
                            innerObj = {};
                            innerObj[fullSubName] = subValue;
                            query += param(innerObj) + '&';
                        }
                    } else if (value instanceof Object) {
                        for (subName in value) {
                            subValue = value[subName];
                            fullSubName = name + '[' + subName + ']';
                            innerObj = {};
                            innerObj[fullSubName] = subValue;
                            query += param(innerObj) + '&';
                        }
                    } else if (value !== undefined && value !== null) {
                        query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
                    }
                }
                return query.length ? query.substr(0, query.length - 1) : query;
            };
            return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
        }];
        $routeProvider
            .when('/', {
                templateUrl: './app/dashboard/dashboard.html',
                controller: 'dashboardCtrl'
                // caseInsensitiveMatch: true,
                // resolve: {
                //     permission: function (applicationService, $route) {
                //         return applicationService.authorizationService().permissionCheck(['admin']);
                //     }
                // }
            })
            .when('/shop-data', {
                templateUrl: './app/mobiReport/shopData/shop-data.html',
                controller: 'dataCtrl',
                caseInsensitiveMatch: true,
                resolve: {
                    permission: function (applicationService, $route) {
                        return applicationService.authorizationService().permissionCheck('ms_1010');
                    }
                }
            })
            
            .otherwise({
                redirectTo: '/'
            });
            
            $httpProvider.interceptors.push('timestampMarker');
    }).service('Configuration', function() {
        var path = '';
        if (window.location.host.match(/lvh\.me/)) {
            path = 'http://zdreport' + window.gooagoodomain;
        } else {
            path = 'http://zdreport' + window.gooagoodomain;
        }
        var service = {
            API: path,
            token: $.cookie('com.gooagoo.passpart.sso.token.name')
        }
        return service;
    })
    .service('ConfigurationDB', function() {
        var path = '';
        if (window.location.host.match(/gooagoo\.com/)) {
            path = 'http://dashboard' + window.gooagoodomain;
        } else {
            path = 'http://data' + window.gooagoodomain + ':8080';
        }
        var service = {
            API: path,
            token: $.cookie('com.gooagoo.passpart.sso.token.name')
        }
        return service;
    });

// Route State Load Spinner(used on page or content load)
MakeApp.directive('ngSpinnerLoader', ['$rootScope',
    function($rootScope) {
        return {
            link: function(scope, element, attrs) {
                // by defult hide the spinner bar
                element.addClass('hide'); // hide spinner bar by default
                // display the spinner bar whenever the route changes(the content part started loading)
                $rootScope.$on('$routeChangeStart', function() {
                    element.removeClass('hide'); // show spinner bar
                });
                // hide the spinner bar on rounte change success(after the content loaded)
                $rootScope.$on('$routeChangeSuccess', function() {
                    setTimeout(function() {
                        element.addClass('hide'); // hide spinner bar
                    }, 500);
                    $("html, body").animate({
                        scrollTop: 0
                    }, 500);
                });
            }
        };
    }
])
MakeApp.factory('timestampMarker', ["$rootScope", function ($rootScope) {
    var timestampMarker = {
        request: function (config) {
            $rootScope.loading = true;
            config.requestTimestamp = new Date().getTime();
            return config;
        },
        response: function (response) {
           // $rootScope.loading = false;
            response.config.responseTimestamp = new Date().getTime();
            return response;
        }
    };
    return timestampMarker;
}]);
