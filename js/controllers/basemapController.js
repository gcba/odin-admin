var app = angular.module('odin.basemapsControllers', []);


function BasemapListController($scope, modelService, configs, usSpinnerService) {
    usSpinnerService.spin('spinner');
    modelService.initService("Basemap", "basemaps", $scope);
    
    $scope.parameters = {
        skip: 0,
        limit: 20,
        conditions: ''
    };
    
    $scope.filtersView = [{
            name: 'Autor',
            model: 'users',
            key: 'username',
            modelInput: 'createdBy',
            multiple: true
        }];
    
    var filtersGet = ['maps'];

    $scope.inactiveModel = function(item) {
        modelService.deactivateList(item, $scope, filtersGet);
    }

    $scope.activeModel = function(item) {
        modelService.restoreList($scope, item, filtersGet);
    };
    
    $scope.confirmDelete = function(item) {
        modelService.confirmDelete(item, {}, filtersGet);
    };

    $scope.edit = function(model) {
        modelService.edit($scope, model);
    };

    $scope.view = function(model) {
        modelService.view($scope, model);
    };

    $scope.activeClass = function(activeClass) {
        modelService.activeClass(activeClass);

    };
    
    $scope.config_key = 'adminPagination';
    ////factory configs
    configs.findKey($scope, function (resp) {
        if (!!resp.data[0] && !!resp.data[0].value) {
            $scope.parameters.limit = resp.data[0].value;
        }
        
        $scope.q = "&include=maps&skip=" + $scope.parameters.skip + "&limit=" + $scope.parameters.limit;

        modelService.loadAll($scope, function(resp) {
            usSpinnerService.stop('spinner');
            if(!resp) {
                modelService.reloadPage();
            }
        });
    });

    $scope.paging = function(event, page, pageSize, total) {
        usSpinnerService.spin('spinner');
        $scope.parameters.skip = (page - 1) * $scope.parameters.limit;
        $scope.q = "&include=maps&skip=" + $scope.parameters.skip + "&limit=" + $scope.parameters.limit;
        if(!!$scope.parameters.conditions) {
            $scope.q += $scope.parameters.conditions;
        }
        modelService.loadAll($scope, function(resp) {
            usSpinnerService.stop('spinner');
            if(!resp) {
                modelService.reloadPage();
            }
        });
    };
}

function BasemapViewController($scope, modelService, $routeParams, rest, $location, $sce, usSpinnerService) {
    usSpinnerService.spin('spinner');
    modelService.initService("Basemap", "basemaps", $scope);

    $scope.model = rest().findOne({
        id: $routeParams.id,
        type: $scope.type
    }, function() {
        usSpinnerService.stop('spinner');
    }, function(error) {
        usSpinnerService.stop('spinner');
        modelService.reloadPage();
    });
    
    $scope.inactiveModel = function(item) {
        modelService.deactivateView(item, $scope);
    }

    $scope.activeModel = function(item) {
        modelService.restoreView($scope, item);
    };

    $scope.edit = function(model) {
        var url = '/' + $scope.type + '/' + model.id + "/edit";
        $location.path(url);
    };

    $scope.getHtml = function(html) {
        return $sce.trustAsHtml(html);
    };
}

function BasemapCreateController($scope, modelService, rest, $location, model, $sce, $routeParams, Alertify, usSpinnerService) {
    
    modelService.initService("Basemap", "basemaps", $scope);

    $scope.model = new model();

    $scope.add = function(model) {
        usSpinnerService.spin('spinner');

        if (model) {
            rest().save({
                type: $scope.type
            }, $scope.model, function(resp) {
                usSpinnerService.stop('spinner');
                if (resp.data.id) {
                    var url = '/' + $scope.type + '/' + resp.data.id + '/view';
                } else {
                    var url = '/' + $scope.type;
                }
                $location.path(url);
            }, function(error) {
                usSpinnerService.stop('spinner');
                if(error.data.data && error.data.data.name) {
                    Alertify.alert('El nombre del basemap ya existe.');
                } else {
                    Alertify.alert('Ha ocurrido un error al crear el basemap.');
                }
            });
        } else {
            usSpinnerService.stop('spinner');
            Alertify.alert('Hay datos incompletos.');
        }
    };

    $scope.getHtml = function(html) {
        return $sce.trustAsHtml(html);
    };

}


function BasemapEditController($scope, modelService, $routeParams, $sce, rest, $location, model, Alertify, usSpinnerService) {
    usSpinnerService.spin('spinner');
    modelService.initService("Basemap", "basemaps", $scope);

    $scope.model = new model();

    $scope.update = function(model) {

        usSpinnerService.spin('spinner');

        if (model) {
            rest().update({
                type: $scope.type,
                id: $scope.model.id
            }, $scope.model, function(resp) {
                usSpinnerService.stop('spinner');
                if (resp.data.id) {
                    var url = '/' + $scope.type + '/' + resp.data.id + '/view';
                } else {
                    var url = '/' + $scope.type;
                }
                $location.path(url);
            }, function(error) {
                usSpinnerService.stop('spinner');
                if(error.data.data && error.data.data.name) {
                    Alertify.alert('El nombre del basemap ya existe.');
                } else {
                    Alertify.alert('Ha ocurrido un error al editar el basemap.');
                }
            });
        } else {
            usSpinnerService.stop('spinner');
            Alertify.alert('Hay datos incompletos.');
        }
    };


    $scope.load = function() {
        $scope.model = rest().findOne({
            id: $routeParams.id,
            type: $scope.type,
        }, function() {
            usSpinnerService.stop('spinner');
        }, function(error) {
            usSpinnerService.stop('spinner');
            modelService.reloadPage();
        });
    };

    $scope.load();

    $scope.getHtml = function(html) {
        return $sce.trustAsHtml(html);
    };
}
