var myapp = angular.module('sortableApp', ['ui.sortable']);

/* 
РЕШЕНИЕ ПРОБЛЕМЫ ПРИ МИНИФИКАЦИИ JS ФАЙЛА
БЫЛО - app.controller('appController', function ($scope, animate) {
СТАЛО - app.controller('appController', ['$scope', 'animate', function ($scope, animate) {
*/ 

myapp.controller('sortableController', ['$scope', function ($scope) {
  
  // МАССИВ ЛИСТОВ
  $scope.rawScreens = [];

  //ОГРАНИЧИТЕЛЬ ЗАДАЧ В ЛИСТЕ
  var tasck_limit = 10;

  //ОБЩАЯ ФУНКЦИЯ ИМПОРТА СПИСКОВ
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
  let resjsonlists = getResultFromJson('../db/listsName.json');

  //ИМПОРТИРУЕМ СПИСОК ЗАДАЧ 
  var resjsontasks = getResultFromJson('../db/tasks.json');

  //ФУНКЦИЯ НАПОЛНЕНИЯ КАЖДОГО ЛИСТА ЗАДАЧАМИ (ПО id_list ИЗ createSheets())
  function makeList (id_list) {
    var filter_resjsontasks = [];
    filter_resjsontasks = resjsontasks.filter(item => item.id_list == id_list);
    return filter_resjsontasks;
  };

  //ФУНКЦИЯ СОЗДАНИЯ ЛИСТОВ
  function createSheets(resjsonlists){
    let j = 9;
    for(var i=0; i < resjsonlists.length; i++){
      $scope['list_' + resjsonlists[i].id] = makeList(resjsonlists[i].id);
      $scope['list_' + resjsonlists[i].id].name = resjsonlists[i].name;
      $scope.rawScreens.push($scope['list_' + resjsonlists[i].id]);
    };
  };
  
  // СОЗДАЕМ ЛИСТЫ
  createSheets(resjsonlists); 
  
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
          ui.item.sortable.droptargetModel.length >= tasck_limit) {
        ui.item.sortable.cancel();
      }
    },
    stop: function(event, ui) {
      //!!! ОБНОВЛЯЕМ id_list У ПЕРЕМЕЩЕННОЙ ЗАДАЧИ !!!
      // var str = Number(ui.item.sortable.droptargetList[0].attributes.id.value.slice(7,10));
      // ui.item.sortable.model.id_list = str + 1
      for (var i = 0; i < $scope.rawScreens.length; i++) {
        $scope.rawScreens[i].map(function (x) {
            x.id_list = i + 1; 
        })
      }
    }
  }; 
  
  //ВЫВОД СОДЕРЖИМОГО ЛИСТОВ 
  $scope.logModels = function () {
    $scope.sortingLog = [];
    for (var i = 0; i < $scope.rawScreens.length; i++) {
      var logEntry = $scope.rawScreens[i].map(function (x) {
        return x.title + '-' + x.id_list + '|';
      }).join(', ');
      logEntry = 'container ' + (i+1) + ': ' + logEntry;
      $scope.sortingLog.push(logEntry);
    }
  };

  var tasck_count = 0;
  //ДОБАВИТЬ ЗАДАЧУ В ЛИСТ
  $scope.addtasck = function (i) {
    if($scope['list_' + i].length < tasck_limit){
      $scope['list_' + i].push({
        id: Math.random(),
        title: 'NewTasck' + i + tasck_count, 
        id_list: i,
        value: 100 
      });
      tasck_count++
    }
  };

  //УДАЛИТЬ ЗАДАЧУ ИЗ ЛИСТА (!!! ДЛЯ ЭТОЙ ЗАДАЧИ НУЖНО ПОДКЛЮЧИТЬ LODASH !!!)
  $scope.deltasck = function (i, j) {
    // $scope['list_' + i].splice(j, 1);
    $scope['list_' + i].splice(_.indexOf($scope['list_' + i], _.find($scope['list_' + i], function (item) { return item.id === j; })), 1);
  };

  //ОТКРЫВАЕМ ЗАДАЧУ ДЛЯ ПОДРОБНОГО ПРОСМОТРА И ВОЗМОЖНОГО РЕДАКТИРОВАНИЯ 
  $scope.edittasck = function (i, j) {
    //ФИЛЬТРУЕМ ПО ЛИСТУ И ИД ЗАДАЧИ
    let f = _.find($scope['list_' + i], function (item){ return item.id === j;});

    //ВСЕ "КЛЮЧИ" С ДАННЫМИ ЗАГОНЯЕМ В ПЕРЕМЕННЫЕ ФОРМЫ
    for(var k in f) $scope['html_' + k] = f[k]; //console.log(k, ' = ', f[k]);

    //ОТКРЫВАЕММ ДИАЛОГОВОЕ ОКНО
    $(".modalDialog").fadeToggle();
  };

  //СОХРАНЯЕМ ЗАДАЧУ
  $scope.savetasck = function (i, j) {
    if(confirm("Сохранить?") == true){

      //ФИЛЬТРУЕМ ПО ЛИСТУ И ИД ЗАДАЧИ
      let f = _.find($scope['list_' + i], function (item){ return item.id === j;});

      //ВСЕ "КЛЮЧИ" С ДАННЫМИ С ФОРМЫ ЗАГОНЯЕМ В ОБЪЕКТ МАССИВА
      for(var k in f) f[k] = $scope['html_' + k];
    }
    $(".modalDialog").fadeToggle();
  };

  //ВЫХОД ИЗ modalDialog БЕЗ СОХРАНЕНИЯ ДАННЫХХ
  $scope.exit_modal = function () {
    $(".modalDialog").fadeToggle();
  };

  //ВЫКЛЮЧАЕМ ОЖИДАНИЕ
  $("#loader").fadeToggle();
}]);