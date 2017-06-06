        
import $q from 'q';

let $rootScope = {};
let that = {};


// public services
that.loadBaiduApi = function(callback) {
    if (window.BMap) {
        if (callback && typeof(callback) == 'function') {
            callback();
        }
    } else {
        that.loadJs('http://api.map.baidu.com/getscript?v=1.4&ak=&services=&t=20150522093217', callback);
    }
};
that.loadJs = function(src, callback) {
    var script = window.document.createElement('script');
    script.type = 'text/javascript';
    script.src = src;
    script.onload = function() {
        if (callback && typeof(callback) == 'function') {
            callback();
        }
    };
    window.document.getElementsByTagName('body')[0].appendChild(script);
};
that.currentCoords = function() {
    var deferred = $q.defer();

    function getpos_cb(result) {
        if (geoloc.getStatus() == BMAP_STATUS_SUCCESS) {
            var point = result && result.point;
            var lat = point && point.lat,
                lng = point && point.lng;
            deferred.resolve({
                'lng': lng,
                'lat': lat
            });
        } else {
            deferred.reject();
        }
    }
    var pos_options = {
        'enableHighAccuracy': true,
        'timeout': 3000,
        'maximumAge': 0
    };
    var geoloc = new BMap.Geolocation();
    geoloc.getCurrentPosition(getpos_cb, pos_options);
    return deferred.promise;
};
that.coordsFromAddress = function(address, cityName) {
    var deferred = $q.defer();

    function getpoint_cb(point) {
        if (point) {
            deferred.resolve({
                lng: point.lng,
                lat: point.lat
            });
        } else {
            deferred.reject();
        }
    }
    var coder = new BMap.Geocoder();
    coder.getPoint(address, getpoint_cb, cityName);
    return deferred.promise;
};
that.cityFromCoords = function() {
    var deferred = $q.defer();
    that.currentCoords().then(function(coords) {
        if (coords && coords.lng && coords.lat) {
            var coder = new BMap.Geocoder();
            coder.getLocation(new BMap.Point(coords.lng, coords.lat), function(result) {
                var city = result && result.addressComponents && result.addressComponents.city;
                deferred.resolve({
                    city: city,
                    coords: {
                        lng: coords.lng,
                        lat: coords.lat
                    }
                });
            });
        } else {
            deferred.reject();
        }
    }, function(err) {
        deferred.reject(err);
    });
    return deferred.promise;
};
that.cityFromIp = function() {
    var deferred = $q.defer();

    function getcity_cb(result) {
        if (result) {
            var city = result.name,
                center = result.center;
            var lat = center && center.lat;
            var lng = center && center.lng;
            deferred.resolve({
                city: city,
                coords: {
                    lng: lng,
                    lat: lat
                }
            });
        } else {
            deferred.reject();
        }
    }
    var myCity = new BMap.LocalCity();
    myCity.get(getcity_cb);
    return deferred.promise;
};
that.autoPositioning = function() {
    var deferred = $q.defer();
    var positioning = this;
    function setPosition(position) {
        var coords = position.coords;
        $rootScope.lng = coords && coords.lng;
        $rootScope.lat = coords && coords.lat;

        deferred.resolve();
    }
    that.cityFromCoords().then(function(position) {
        setPosition(position);
    }, function(err) {
        positioning.cityFromIp().then(function(position) {
            setPosition(position);
        }, function(err) {
            deferred.reject(err);
        });
    });
    return deferred.promise;
};

that.positioning = function() {
    var deferred = $q.defer();
    var positioning = this;
    if ($rootScope.positioned !== undefined) {
        if ($rootScope.positioned) {
            deferred.resolve();
        } else {
            deferred.reject();
        }
    } else {
        $rootScope.positioned = false;
        that.autoPositioning().then(function() {
            deferred.resolve();
        }, function() {
            
        });
    }
    return deferred.promise;
};
that.asyncPositioning = function(callback) {
    if (!callback || typeof(callback) != 'function') {
        console.log('async positioning callback function must be specified');
        return;
    }
    if ($rootScope.positioned) {
        callback();
    } else {
        var Positioning = this;
        that.loadBaiduApi(function() {
            Positioning.positioning().then(callback);
        });
    }
};

that.getLocalPos = function() {
    var keys = ['cityId', 'cityName', 'lng', 'lat', 'plazaId', 'plazaName'];
    var pos = that.getLocalCache(keys);
    pos && pos.lng && (pos.lng = parseFloat(pos.lng));
    pos && pos.lat && (pos.lat = parseFloat(pos.lat));
    return pos;
};
that.getLocalCache = function(keys) {
    if (!keys) return;
    for (var i = 0, len = keys.length, cache, k, v; i < len; i++) {
        k = keys[i];
        v = window.localStorage[k];
        if (v) {
            cache || (cache = {});
            cache[k] = v;
        }
    }
    return cache;
};
that.setLocalCache = function(params) {

    if (!params) return false;
    for (var k in params) {
        try {
            localStorage.setItem(k, params[k]);
        } catch (e) {
            console.log('您处于无痕浏览，无法为您保存位置信息');
            break;
        }
    }
    return true;
};
that.failed = function() {
    alert('positioning failed');
};
// 获取地点的直线距离
that.getLineDistance = function(coords, compareCoord){
    var deferred = $q.defer();
    function _calc(coords1, coord2){
        //if(coords&&coords.lat&&coords.lng){
        var R = 6370996.81,//地球半径
        PI = Math.PI,
        lat1,
        lng1,
        lat2 = coord2.lat, 
        lng2 = coord2.lng, 
        distances = [];

        if(!(coords1 instanceof Array)){
            coords1 = [coords1];
        }
        coords1.forEach(function(coord1){
            var distance = 0;
            lat1 = coord1.lat;
            lng1 = coord1.lng;
            if(lat1&&lng1&&lat2&&lng2){
                distance = R*Math.acos(Math.cos(lat1*PI/180 )*
                Math.cos(lat2*PI/180)*Math.cos(lng1*PI/180 -lng2*PI/180)+
                Math.sin(lat1*PI/180 )*Math.sin(lat2*PI/180));
                //distance = distance/1000;
            }
            distances.push(distance);
        });

        return distances;
        //}else{
        //    return -1;
        //}
    }

    if(!compareCoord){
        that.asyncPositioning(function(){
            deferred.resolve(_calc(coords, {
                lat: $rootScope.lat,
                lng: $rootScope.lng
            }))
        })
    }else{
        deferred.resolve(_calc(coords, compareCoord));
    }
    /*that.autoPositioning().then(function(coords) {
        console.log(coords)
        //deferred.resolve()

    });*/

    return deferred.promise;
              
}

export default that;
