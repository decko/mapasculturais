(function(angular) {
    "use strict";

    var app = angular.module('FindOneService', []);
    app.factory('FindOneService', ['$http', '$rootScope', function($http, $rootScope){
        return function(data){

            if(data.global.viewMode === 'list') return;
            var select = 'id,singleUrl,name,type,shortDescription,terms',
                requestAction = 'findOne',
                page=null,
                result = {},
                sData = {},
                entity,
                numRequests = 1;

            $rootScope.spinnerCount++;

            entity = data.global.openEntity.type;
            sData.id = 'EQ(' + data.global.openEntity.id + ')';



            if(entity === 'event'){
                result[entity] = {
                    space: {},
                    events: {}
                };

                $rootScope.spinnerCount++;
                numRequests++;

                select += ',endereco';
                apiFindOne('space', select, sData, page, requestAction).success(function(rs){
                    result[entity].space = rs;
                    endRequest();
                });
                apiSpaceEvents(data.global.openEntity.id, $rootScope.searchArgs.map.event).success(function(rs){
                    result[entity].events = rs;
                    endRequest();
                });;
            }else{
                apiFindOne(entity, select, sData, page, requestAction).success(function(rs){
                    result[entity] = rs;
                    endRequest();
                });
            }

            function endRequest(){
                numRequests--;
                $rootScope.spinnerCount--;
                if(numRequests === 0){
                    $rootScope.$emit('findOneResultReady', result);
                }
            }

            function apiFindOne(entity, select, searchData, page, action) {
                action = action || 'find';
                if(entity === 'space')
                    select += ',endereco,acessibilidade';
                searchData['@select'] = select;
                searchData['@files'] = '(avatar.avatarBig):url';
                var querystring = "";
                for(var att in searchData) {
                    querystring += "&"+att+"="+searchData[att];
                }
                return $http({method: 'GET', url: MapasCulturais.baseURL + 'api/' + entity + '/' + action + '/?'+querystring, data:searchData});
            }

            function apiSpaceEvents(spaceId, searchData) {
                var action = 'findBySpace';
                searchData['spaceId'] = spaceId;
                searchData['@select'] = select + ',classificacaoEtaria';
                searchData['@files'] = '(avatar.avatarBig):url';
                var querystring = "";
                for(var att in searchData) {
                    querystring += "&"+att+"="+searchData[att];
                }
                return $http({method: 'GET', url: MapasCulturais.baseURL + 'api/' + entity + '/' + action + '/?'+querystring, data:searchData});
            }
        };
    }]);
})(angular);




