/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/js/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

	'use strict';

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
	  var getResultFromJson = function getResultFromJson(path) {
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
	    } catch (err) {
	      resultFromJson = getResultFromJsonNode(path);
	      return resultFromJson;
	    }
	  };

	  //ИМПОРТИРУЕМ СПИСОК ЛИСТОВ
	  var resjsonlists = getResultFromJson('../db/listsName.json');

	  //ИМПОРТИРУЕМ СПИСОК ЗАДАЧ 
	  var resjsontasks = getResultFromJson('../db/tasks.json');

	  //ФУНКЦИЯ НАПОЛНЕНИЯ КАЖДОГО ЛИСТА ЗАДАЧАМИ (ПО id_list ИЗ createSheets())
	  function makeList(id_list) {
	    var filter_resjsontasks = [];
	    filter_resjsontasks = resjsontasks.filter(function (item) {
	      return item.id_list == id_list;
	    });
	    return filter_resjsontasks;
	  };

	  //ФУНКЦИЯ СОЗДАНИЯ ЛИСТОВ
	  function createSheets(resjsonlists) {
	    var j = 9;
	    for (var i = 0; i < resjsonlists.length; i++) {
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
	    update: function update(event, ui) {
	      if ( // ensure we are in the first update() callback
	      !ui.item.sortable.received &&
	      // check that its an actual moving
	      // between the two lists
	      ui.item.sortable.source[0] !== ui.item.sortable.droptarget[0] &&
	      // check the size limitation
	      ui.item.sortable.droptargetModel.length >= tasck_limit) {
	        ui.item.sortable.cancel();
	      }
	    },
	    stop: function stop(event, ui) {
	      //!!! ОБНОВЛЯЕМ id_list У ПЕРЕМЕЩЕННОЙ ЗАДАЧИ !!!
	      // var str = Number(ui.item.sortable.droptargetList[0].attributes.id.value.slice(7,10));
	      // ui.item.sortable.model.id_list = str + 1
	      for (var i = 0; i < $scope.rawScreens.length; i++) {
	        $scope.rawScreens[i].map(function (x) {
	          x.id_list = i + 1;
	        });
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
	      logEntry = 'container ' + (i + 1) + ': ' + logEntry;
	      $scope.sortingLog.push(logEntry);
	    }
	  };

	  var tasck_count = 0;
	  //ДОБАВИТЬ ЗАДАЧУ В ЛИСТ
	  $scope.addtasck = function (i) {
	    if ($scope['list_' + i].length < tasck_limit) {
	      $scope['list_' + i].push({
	        id: Math.random(),
	        title: 'NewTasck' + i + tasck_count,
	        id_list: i,
	        value: 100
	      });
	      tasck_count++;
	    }
	  };

	  //УДАЛИТЬ ЗАДАЧУ ИЗ ЛИСТА (!!! ДЛЯ ЭТОЙ ЗАДАЧИ НУЖНО ПОДКЛЮЧИТЬ LODASH !!!)
	  $scope.deltasck = function (i, j) {
	    // $scope['list_' + i].splice(j, 1);
	    $scope['list_' + i].splice(_.indexOf($scope['list_' + i], _.find($scope['list_' + i], function (item) {
	      return item.id === j;
	    })), 1);
	  };

	  //ОТКРЫВАЕМ ЗАДАЧУ ДЛЯ ПОДРОБНОГО ПРОСМОТРА И ВОЗМОЖНОГО РЕДАКТИРОВАНИЯ 
	  $scope.edittasck = function (i, j) {
	    //ФИЛЬТРУЕМ ПО ЛИСТУ И ИД ЗАДАЧИ
	    var f = _.find($scope['list_' + i], function (item) {
	      return item.id === j;
	    });

	    //ВСЕ "КЛЮЧИ" С ДАННЫМИ ЗАГОНЯЕМ В ПЕРЕМЕННЫЕ ФОРМЫ
	    for (var k in f) {
	      $scope['html_' + k] = f[k];
	    } //console.log(k, ' = ', f[k]);

	    //ОТКРЫВАЕММ ДИАЛОГОВОЕ ОКНО
	    $(".modalDialog").fadeToggle();
	  };

	  //СОХРАНЯЕМ ЗАДАЧУ
	  $scope.savetasck = function (i, j) {
	    if (confirm("Сохранить?") == true) {

	      //ФИЛЬТРУЕМ ПО ЛИСТУ И ИД ЗАДАЧИ
	      var f = _.find($scope['list_' + i], function (item) {
	        return item.id === j;
	      });

	      //ВСЕ "КЛЮЧИ" С ДАННЫМИ С ФОРМЫ ЗАГОНЯЕМ В ОБЪЕКТ МАССИВА
	      for (var k in f) {
	        f[k] = $scope['html_' + k];
	      }
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

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vL3dlYnBhY2svYm9vdHN0cmFwIDI4YTY4MjI4OTI4ZjVjODFjZGM2Iiwid2VicGFjazovLy9mcm9udGVuZC9qcy9hcHAuanMiXSwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGlkOiBtb2R1bGVJZCxcbiBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiL2pzL1wiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDI4YTY4MjI4OTI4ZjVjODFjZGM2IiwidmFyIG15YXBwID0gYW5ndWxhci5tb2R1bGUoJ3NvcnRhYmxlQXBwJywgWyd1aS5zb3J0YWJsZSddKTtcclxuXHJcbi8qIFxyXG7QoNCV0KjQldCd0JjQlSDQn9Cg0J7QkdCb0JXQnNCrINCf0KDQmCDQnNCY0J3QmNCk0JjQmtCQ0KbQmNCYIEpTINCk0JDQmdCb0JBcclxu0JHQq9Cb0J4gLSBhcHAuY29udHJvbGxlcignYXBwQ29udHJvbGxlcicsIGZ1bmN0aW9uICgkc2NvcGUsIGFuaW1hdGUpIHtcclxu0KHQotCQ0JvQniAtIGFwcC5jb250cm9sbGVyKCdhcHBDb250cm9sbGVyJywgWyckc2NvcGUnLCAnYW5pbWF0ZScsIGZ1bmN0aW9uICgkc2NvcGUsIGFuaW1hdGUpIHtcclxuKi8gXHJcblxyXG5teWFwcC5jb250cm9sbGVyKCdzb3J0YWJsZUNvbnRyb2xsZXInLCBbJyRzY29wZScsIGZ1bmN0aW9uICgkc2NvcGUpIHtcclxuICBcclxuICAvLyDQnNCQ0KHQodCY0JIg0JvQmNCh0KLQntCSXHJcbiAgJHNjb3BlLnJhd1NjcmVlbnMgPSBbXTtcclxuXHJcbiAgLy/QntCT0KDQkNCd0JjQp9CY0KLQldCb0Kwg0JfQkNCU0JDQpyDQkiDQm9CY0KHQotCVXHJcbiAgdmFyIHRhc2NrX2xpbWl0ID0gMTA7XHJcblxyXG4gIC8v0J7QkdCp0JDQryDQpNCj0J3QmtCm0JjQryDQmNCc0J/QntCg0KLQkCDQodCf0JjQodCa0J7QklxyXG4gIGNvbnN0IGdldFJlc3VsdEZyb21Kc29uID0gZnVuY3Rpb24ocGF0aCl7XHJcbiAgICAvLyBwYXRoID0gJy4uLy4uLycgKyBwYXRoOyAvL2NvbnNvbGUubG9nKHBhdGgpO1xyXG5cclxuICAgIHZhciByZXN1bHRGcm9tSnNvbiA9IG51bGw7XHJcbiAgICB0cnkgeyBcclxuICAgICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG5cclxuICAgICAgeGhyLm9wZW4oJ0dFVCcsIHBhdGgsIGZhbHNlKTtcclxuICAgICAgeGhyLnNlbmQoKTtcclxuXHJcbiAgICAgIGlmICh4aHIuc3RhdHVzICE9IDIwMCkge1xyXG4gICAgIC8vINC+0LHRgNCw0LHQvtGC0LDRgtGMINC+0YjQuNCx0LrRg1xyXG4gICAgIGFsZXJ0KCfQntGI0LjQsdC60LAgJyArIHhoci5zdGF0dXMgKyAnOiAnICsgeGhyLnN0YXR1c1RleHQpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgLy8g0LLRi9Cy0LXRgdGC0Lgg0YDQtdC30YPQu9GM0YLQsNGCXHJcbiAgICAvLyBhbGVydCh4aHIucmVzcG9uc2VUZXh0KTtcclxuICAgICAgfVxyXG4gICAgICByZXN1bHRGcm9tSnNvbiA9IEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlVGV4dCk7XHJcbiAgICAgIHJldHVybiByZXN1bHRGcm9tSnNvbjtcclxuICAgIH1cclxuICAgIGNhdGNoKGVycikge1xyXG4gICAgICByZXN1bHRGcm9tSnNvbiA9IGdldFJlc3VsdEZyb21Kc29uTm9kZShwYXRoKTsgXHJcbiAgICAgIHJldHVybiByZXN1bHRGcm9tSnNvbjtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICAvL9CY0JzQn9Ce0KDQotCY0KDQo9CV0Jwg0KHQn9CY0KHQntCaINCb0JjQodCi0J7QklxyXG4gIGxldCByZXNqc29ubGlzdHMgPSBnZXRSZXN1bHRGcm9tSnNvbignLi4vZGIvbGlzdHNOYW1lLmpzb24nKTtcclxuXHJcbiAgLy/QmNCc0J/QntCg0KLQmNCg0KPQldCcINCh0J/QmNCh0J7QmiDQl9CQ0JTQkNCnIFxyXG4gIHZhciByZXNqc29udGFza3MgPSBnZXRSZXN1bHRGcm9tSnNvbignLi4vZGIvdGFza3MuanNvbicpO1xyXG5cclxuICAvL9Ck0KPQndCa0KbQmNCvINCd0JDQn9Ce0JvQndCV0J3QmNCvINCa0JDQltCU0J7Qk9CeINCb0JjQodCi0JAg0JfQkNCU0JDQp9CQ0JzQmCAo0J/QniBpZF9saXN0INCY0JcgY3JlYXRlU2hlZXRzKCkpXHJcbiAgZnVuY3Rpb24gbWFrZUxpc3QgKGlkX2xpc3QpIHtcclxuICAgIHZhciBmaWx0ZXJfcmVzanNvbnRhc2tzID0gW107XHJcbiAgICBmaWx0ZXJfcmVzanNvbnRhc2tzID0gcmVzanNvbnRhc2tzLmZpbHRlcihpdGVtID0+IGl0ZW0uaWRfbGlzdCA9PSBpZF9saXN0KTtcclxuICAgIHJldHVybiBmaWx0ZXJfcmVzanNvbnRhc2tzO1xyXG4gIH07XHJcblxyXG4gIC8v0KTQo9Cd0JrQptCY0K8g0KHQntCX0JTQkNCd0JjQryDQm9CY0KHQotCe0JJcclxuICBmdW5jdGlvbiBjcmVhdGVTaGVldHMocmVzanNvbmxpc3RzKXtcclxuICAgIGxldCBqID0gOTtcclxuICAgIGZvcih2YXIgaT0wOyBpIDwgcmVzanNvbmxpc3RzLmxlbmd0aDsgaSsrKXtcclxuICAgICAgJHNjb3BlWydsaXN0XycgKyByZXNqc29ubGlzdHNbaV0uaWRdID0gbWFrZUxpc3QocmVzanNvbmxpc3RzW2ldLmlkKTtcclxuICAgICAgJHNjb3BlWydsaXN0XycgKyByZXNqc29ubGlzdHNbaV0uaWRdLm5hbWUgPSByZXNqc29ubGlzdHNbaV0ubmFtZTtcclxuICAgICAgJHNjb3BlLnJhd1NjcmVlbnMucHVzaCgkc2NvcGVbJ2xpc3RfJyArIHJlc2pzb25saXN0c1tpXS5pZF0pO1xyXG4gICAgfTtcclxuICB9O1xyXG4gIFxyXG4gIC8vINCh0J7Ql9CU0JDQldCcINCb0JjQodCi0KtcclxuICBjcmVhdGVTaGVldHMocmVzanNvbmxpc3RzKTsgXHJcbiAgXHJcbiAgJHNjb3BlLnNvcnRpbmdMb2cgPSBbXTtcclxuICBcclxuICAkc2NvcGUuc29ydGFibGVPcHRpb25zID0ge1xyXG4gICAgcGxhY2Vob2xkZXI6IFwiYXBwXCIsXHJcbiAgICBjb25uZWN0V2l0aDogXCIuYXBwcy1jb250YWluZXJcIixcclxuICAgIHVwZGF0ZTogZnVuY3Rpb24oZXZlbnQsIHVpKSB7XHJcbiAgICAgIGlmICgvLyBlbnN1cmUgd2UgYXJlIGluIHRoZSBmaXJzdCB1cGRhdGUoKSBjYWxsYmFja1xyXG4gICAgICAgICAgIXVpLml0ZW0uc29ydGFibGUucmVjZWl2ZWQgJiZcclxuICAgICAgICAgIC8vIGNoZWNrIHRoYXQgaXRzIGFuIGFjdHVhbCBtb3ZpbmdcclxuICAgICAgICAgIC8vIGJldHdlZW4gdGhlIHR3byBsaXN0c1xyXG4gICAgICAgICAgdWkuaXRlbS5zb3J0YWJsZS5zb3VyY2VbMF0gIT09IHVpLml0ZW0uc29ydGFibGUuZHJvcHRhcmdldFswXSAmJlxyXG4gICAgICAgICAgLy8gY2hlY2sgdGhlIHNpemUgbGltaXRhdGlvblxyXG4gICAgICAgICAgdWkuaXRlbS5zb3J0YWJsZS5kcm9wdGFyZ2V0TW9kZWwubGVuZ3RoID49IHRhc2NrX2xpbWl0KSB7XHJcbiAgICAgICAgdWkuaXRlbS5zb3J0YWJsZS5jYW5jZWwoKTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHN0b3A6IGZ1bmN0aW9uKGV2ZW50LCB1aSkge1xyXG4gICAgICAvLyEhISDQntCR0J3QntCS0JvQr9CV0JwgaWRfbGlzdCDQoyDQn9CV0KDQldCc0JXQqdCV0J3QndCe0Jkg0JfQkNCU0JDQp9CYICEhIVxyXG4gICAgICAvLyB2YXIgc3RyID0gTnVtYmVyKHVpLml0ZW0uc29ydGFibGUuZHJvcHRhcmdldExpc3RbMF0uYXR0cmlidXRlcy5pZC52YWx1ZS5zbGljZSg3LDEwKSk7XHJcbiAgICAgIC8vIHVpLml0ZW0uc29ydGFibGUubW9kZWwuaWRfbGlzdCA9IHN0ciArIDFcclxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCAkc2NvcGUucmF3U2NyZWVucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICRzY29wZS5yYXdTY3JlZW5zW2ldLm1hcChmdW5jdGlvbiAoeCkge1xyXG4gICAgICAgICAgICB4LmlkX2xpc3QgPSBpICsgMTsgXHJcbiAgICAgICAgfSlcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH07IFxyXG4gIFxyXG4gIC8v0JLQq9CS0J7QlCDQodCe0JTQldCg0JbQmNCc0J7Qk9CeINCb0JjQodCi0J7QkiBcclxuICAkc2NvcGUubG9nTW9kZWxzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgJHNjb3BlLnNvcnRpbmdMb2cgPSBbXTtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgJHNjb3BlLnJhd1NjcmVlbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdmFyIGxvZ0VudHJ5ID0gJHNjb3BlLnJhd1NjcmVlbnNbaV0ubWFwKGZ1bmN0aW9uICh4KSB7XHJcbiAgICAgICAgcmV0dXJuIHgudGl0bGUgKyAnLScgKyB4LmlkX2xpc3QgKyAnfCc7XHJcbiAgICAgIH0pLmpvaW4oJywgJyk7XHJcbiAgICAgIGxvZ0VudHJ5ID0gJ2NvbnRhaW5lciAnICsgKGkrMSkgKyAnOiAnICsgbG9nRW50cnk7XHJcbiAgICAgICRzY29wZS5zb3J0aW5nTG9nLnB1c2gobG9nRW50cnkpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIHZhciB0YXNja19jb3VudCA9IDA7XHJcbiAgLy/QlNCe0JHQkNCS0JjQotCsINCX0JDQlNCQ0KfQoyDQkiDQm9CY0KHQolxyXG4gICRzY29wZS5hZGR0YXNjayA9IGZ1bmN0aW9uIChpKSB7XHJcbiAgICBpZigkc2NvcGVbJ2xpc3RfJyArIGldLmxlbmd0aCA8IHRhc2NrX2xpbWl0KXtcclxuICAgICAgJHNjb3BlWydsaXN0XycgKyBpXS5wdXNoKHtcclxuICAgICAgICBpZDogTWF0aC5yYW5kb20oKSxcclxuICAgICAgICB0aXRsZTogJ05ld1Rhc2NrJyArIGkgKyB0YXNja19jb3VudCwgXHJcbiAgICAgICAgaWRfbGlzdDogaSxcclxuICAgICAgICB2YWx1ZTogMTAwIFxyXG4gICAgICB9KTtcclxuICAgICAgdGFzY2tfY291bnQrK1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIC8v0KPQlNCQ0JvQmNCi0Kwg0JfQkNCU0JDQp9CjINCY0Jcg0JvQmNCh0KLQkCAoISEhINCU0JvQryDQrdCi0J7QmSDQl9CQ0JTQkNCn0Jgg0J3Qo9CW0J3QniDQn9Ce0JTQmtCb0K7Qp9CY0KLQrCBMT0RBU0ggISEhKVxyXG4gICRzY29wZS5kZWx0YXNjayA9IGZ1bmN0aW9uIChpLCBqKSB7XHJcbiAgICAvLyAkc2NvcGVbJ2xpc3RfJyArIGldLnNwbGljZShqLCAxKTtcclxuICAgICRzY29wZVsnbGlzdF8nICsgaV0uc3BsaWNlKF8uaW5kZXhPZigkc2NvcGVbJ2xpc3RfJyArIGldLCBfLmZpbmQoJHNjb3BlWydsaXN0XycgKyBpXSwgZnVuY3Rpb24gKGl0ZW0pIHsgcmV0dXJuIGl0ZW0uaWQgPT09IGo7IH0pKSwgMSk7XHJcbiAgfTtcclxuXHJcbiAgLy/QntCi0JrQoNCr0JLQkNCV0Jwg0JfQkNCU0JDQp9CjINCU0JvQryDQn9Ce0JTQoNCe0JHQndCe0JPQniDQn9Cg0J7QodCc0J7QotCg0JAg0Jgg0JLQntCX0JzQntCW0J3QntCT0J4g0KDQldCU0JDQmtCi0JjQoNCe0JLQkNCd0JjQryBcclxuICAkc2NvcGUuZWRpdHRhc2NrID0gZnVuY3Rpb24gKGksIGopIHtcclxuICAgIC8v0KTQmNCb0KzQotCg0KPQldCcINCf0J4g0JvQmNCh0KLQoyDQmCDQmNCUINCX0JDQlNCQ0KfQmFxyXG4gICAgbGV0IGYgPSBfLmZpbmQoJHNjb3BlWydsaXN0XycgKyBpXSwgZnVuY3Rpb24gKGl0ZW0peyByZXR1cm4gaXRlbS5pZCA9PT0gajt9KTtcclxuXHJcbiAgICAvL9CS0KHQlSBcItCa0JvQrtCn0JhcIiDQoSDQlNCQ0J3QndCr0JzQmCDQl9CQ0JPQntCd0K/QldCcINCSINCf0JXQoNCV0JzQldCd0J3Qq9CVINCk0J7QoNCc0KtcclxuICAgIGZvcih2YXIgayBpbiBmKSAkc2NvcGVbJ2h0bWxfJyArIGtdID0gZltrXTsgLy9jb25zb2xlLmxvZyhrLCAnID0gJywgZltrXSk7XHJcblxyXG4gICAgLy/QntCi0JrQoNCr0JLQkNCV0JzQnCDQlNCY0JDQm9Ce0JPQntCS0J7QlSDQntCa0J3QnlxyXG4gICAgJChcIi5tb2RhbERpYWxvZ1wiKS5mYWRlVG9nZ2xlKCk7XHJcbiAgfTtcclxuXHJcbiAgLy/QodCe0KXQoNCQ0J3Qr9CV0Jwg0JfQkNCU0JDQp9CjXHJcbiAgJHNjb3BlLnNhdmV0YXNjayA9IGZ1bmN0aW9uIChpLCBqKSB7XHJcbiAgICBpZihjb25maXJtKFwi0KHQvtGF0YDQsNC90LjRgtGMP1wiKSA9PSB0cnVlKXtcclxuXHJcbiAgICAgIC8v0KTQmNCb0KzQotCg0KPQldCcINCf0J4g0JvQmNCh0KLQoyDQmCDQmNCUINCX0JDQlNCQ0KfQmFxyXG4gICAgICBsZXQgZiA9IF8uZmluZCgkc2NvcGVbJ2xpc3RfJyArIGldLCBmdW5jdGlvbiAoaXRlbSl7IHJldHVybiBpdGVtLmlkID09PSBqO30pO1xyXG5cclxuICAgICAgLy/QktCh0JUgXCLQmtCb0K7Qp9CYXCIg0KEg0JTQkNCd0J3Qq9Cc0Jgg0KEg0KTQntCg0JzQqyDQl9CQ0JPQntCd0K/QldCcINCSINCe0JHQqtCV0JrQoiDQnNCQ0KHQodCY0JLQkFxyXG4gICAgICBmb3IodmFyIGsgaW4gZikgZltrXSA9ICRzY29wZVsnaHRtbF8nICsga107XHJcbiAgICB9XHJcbiAgICAkKFwiLm1vZGFsRGlhbG9nXCIpLmZhZGVUb2dnbGUoKTtcclxuICB9O1xyXG5cclxuICAvL9CS0KvQpdCe0JQg0JjQlyBtb2RhbERpYWxvZyDQkdCV0Jcg0KHQntCl0KDQkNCd0JXQndCY0K8g0JTQkNCd0J3Qq9Cl0KVcclxuICAkc2NvcGUuZXhpdF9tb2RhbCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICQoXCIubW9kYWxEaWFsb2dcIikuZmFkZVRvZ2dsZSgpO1xyXG4gIH07XHJcblxyXG4gIC8v0JLQq9Ca0JvQrtCn0JDQldCcINCe0JbQmNCU0JDQndCY0JVcclxuICAkKFwiI2xvYWRlclwiKS5mYWRlVG9nZ2xlKCk7XHJcbn1dKTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gZnJvbnRlbmQvanMvYXBwLmpzIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7QUN0Q0E7QUFDQTtBQUNBOzs7Ozs7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQXZCQTtBQUNBO0FBeUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUpBO0FBTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Iiwic291cmNlUm9vdCI6IiJ9