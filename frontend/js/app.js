var myapp = angular.module('sortableApp', ['ui.sortable']);

/* 
РЕШЕНИЕ ПРОБЛЕМЫ ПРИ МИНИФИКАЦИИ JS ФАЙЛА
БЫЛО - app.controller('appController', function ($scope, animate) {
СТАЛО - app.controller('appController', ['$scope', 'animate', function ($scope, animate) {
*/ 

myapp.controller('sortableController', ['$scope', function ($scope) {

  //ФУНКЦИЯ ИМПОРТА СПИСКА ЛИСТОВ
  const getResultFromJson = function(path){
    // path = '../../' + path; //console.log(path);

    var resultFromJson = null;
    try { 
      var xhr = new XMLHttpRequest();

      xhr.open('GET', path, false);
      xhr.send();

      if (xhr.status != 200) {
     // обработать ошибку
     alert('Ошибка ' + xhr.status + ': ' + xhr.statusText);
      } else {
    // вывести результат
    // alert(xhr.responseText);
      }
      resultFromJson = JSON.parse(xhr.responseText);
      return resultFromJson;
    }
    catch(err) {
      resultFromJson = getResultFromJsonNode(path); 
      return resultFromJson;
    }
  };

  //ИМПОРТИРУЕМ СПИСОК ЛИСТОВ
  let resjson = getResultFromJson('../db/listsName.json'); 

  var arrListsName = [];

  // ЗАПОЛНЯЕМ МАССИВ "ИМЁН ЛИСТОВ" ИМПОРТИРУЕМЫМИ ИМЕНАМИ
  for(var i=0; i < resjson.length; i++){
    arrListsName.push(resjson[i].name); 
  };

  // МАССИВ ЛИСТОВ
  $scope.rawScreens = []; 

  //ФУНКЦИЯ НАПОЛНЕНИЯ КАЖДОГО ЛИСТА СОДЕРЖИМЫМ (item - элементы, задачи например)
  function makeList (list_name, list_id, j = 1) {
    var tmpItems = [];

    for (var i = 1; i <= j; i++){
      tmpItems.push({
        title: 'Item ' + i + '|' + list_name.substring(1, 4) + '|',
        value: i,
        id_list: list_id,
        name_list: list_name
      });
    }
    return tmpItems;
  };

  //ФУНКЦИЯ СОЗДАНИЯ ЛИСТОВ
  function createSheets(arrListsName){
    let j = 9;
    for(var i=0; i < arrListsName.length; i++){
      if(i == 2) {
        $scope['list_' + String(i)] = makeList(arrListsName[i], i); //СОЗДАСТЬСЯ 1 ЭЛЕМЕНТ
        $scope['list_' + String(i)].name = arrListsName[i];

        //ДОБАВИТЬ ВНЕШНИЙ ЭЛЕМЕНТ
        $scope['list_' + String(i)].push({
          title: 'Item in vitro', 
          id_list: 2,
          name_list: arrListsName[i],
          value: 0 
        }) 
      
      }else{
        $scope['list_' + String(i)] = makeList(arrListsName[i], i, j); //СОЗДАСТЬСЯ 9 ЭЛЕМЕНТОВ
        $scope['list_' + String(i)].name = arrListsName[i];
      }
      $scope.rawScreens.push($scope['list_' + String(i)]);
    };
  };
  
  // СОЗДАЕМ ЛИСТЫ
  createSheets(arrListsName); 
  
  $scope.sortingLog = [];
  
  $scope.sortableOptions = {
    placeholder: "app",
    connectWith: ".apps-container",
    update: function(event, ui) {
      if (// ensure we are in the first update() callback
          !ui.item.sortable.received &&
          // check that its an actual moving
          // between the two lists
          ui.item.sortable.source[0] !== ui.item.sortable.droptarget[0] &&
          // check the size limitation
          ui.item.sortable.droptargetModel.length >= 10) {
        ui.item.sortable.cancel();
      }
      for (var i = 0; i < $scope.rawScreens.length; i++) {
        $scope.rawScreens[i].map(function (x) {
          if( x.id_list != i){
            x.id_list = i; 
            x.name_list = $scope.rawScreens[i].name
          };
        })
      }
    }
  };
  
  //ВЫВОД СОДЕРЖИМОГО ЛИСТОВ 
  $scope.logModels = function () {
    $scope.sortingLog = [];
    for (var i = 0; i < $scope.rawScreens.length; i++) {
      var logEntry = $scope.rawScreens[i].map(function (x) {
        return x.title + '-' + x.id_list + ' |' + x.name_list;
      }).join(', ');
      logEntry = 'container ' + (i+1) + ': ' + logEntry;
      $scope.sortingLog.push(logEntry);
    }
  };
}]);