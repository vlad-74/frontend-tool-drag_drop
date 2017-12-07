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

	  //ФУНКЦИЯ ИМПОРТА СПИСКА ЛИСТОВ
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
	  var resjson = getResultFromJson('../db/listsName.json');

	  var arrListsName = [];

	  // ЗАПОЛНЯЕМ МАССИВ "ИМЁН ЛИСТОВ" ИМПОРТИРУЕМЫМИ ИМЕНАМИ
	  for (var i = 0; i < resjson.length; i++) {
	    arrListsName.push(resjson[i].name);
	  };

	  // МАССИВ ЛИСТОВ
	  $scope.rawScreens = [];

	  //ФУНКЦИЯ НАПОЛНЕНИЯ КАЖДОГО ЛИСТА СОДЕРЖИМЫМ (item - элементы, задачи например)
	  function makeList(list_name, list_id) {
	    var j = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

	    var tmpItems = [];

	    for (var i = 1; i <= j; i++) {
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
	  function createSheets(arrListsName) {
	    var j = 9;
	    for (var i = 0; i < arrListsName.length; i++) {
	      if (i == 2) {
	        $scope['list_' + String(i)] = makeList(arrListsName[i], i); //СОЗДАСТЬСЯ 1 ЭЛЕМЕНТ
	        $scope['list_' + String(i)].name = arrListsName[i];

	        //ДОБАВИТЬ ВНЕШНИЙ ЭЛЕМЕНТ
	        $scope['list_' + String(i)].push({
	          title: 'Item in vitro',
	          id_list: 2,
	          name_list: arrListsName[i],
	          value: 0
	        });
	      } else {
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
	    update: function update(event, ui) {
	      if ( // ensure we are in the first update() callback
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
	          if (x.id_list != i) {
	            x.id_list = i;
	            x.name_list = $scope.rawScreens[i].name;
	          };
	        });
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
	      logEntry = 'container ' + (i + 1) + ': ' + logEntry;
	      $scope.sortingLog.push(logEntry);
	    }
	  };
	}]);

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vL3dlYnBhY2svYm9vdHN0cmFwIGYyOTcyNWIwMzMyN2JhYTViNDE2Iiwid2VicGFjazovLy9mcm9udGVuZC9qcy9hcHAuanMiXSwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGlkOiBtb2R1bGVJZCxcbiBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiL2pzL1wiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIGYyOTcyNWIwMzMyN2JhYTViNDE2IiwidmFyIG15YXBwID0gYW5ndWxhci5tb2R1bGUoJ3NvcnRhYmxlQXBwJywgWyd1aS5zb3J0YWJsZSddKTtcclxuXHJcbi8qIFxyXG7QoNCV0KjQldCd0JjQlSDQn9Cg0J7QkdCb0JXQnNCrINCf0KDQmCDQnNCY0J3QmNCk0JjQmtCQ0KbQmNCYIEpTINCk0JDQmdCb0JBcclxu0JHQq9Cb0J4gLSBhcHAuY29udHJvbGxlcignYXBwQ29udHJvbGxlcicsIGZ1bmN0aW9uICgkc2NvcGUsIGFuaW1hdGUpIHtcclxu0KHQotCQ0JvQniAtIGFwcC5jb250cm9sbGVyKCdhcHBDb250cm9sbGVyJywgWyckc2NvcGUnLCAnYW5pbWF0ZScsIGZ1bmN0aW9uICgkc2NvcGUsIGFuaW1hdGUpIHtcclxuKi8gXHJcblxyXG5teWFwcC5jb250cm9sbGVyKCdzb3J0YWJsZUNvbnRyb2xsZXInLCBbJyRzY29wZScsIGZ1bmN0aW9uICgkc2NvcGUpIHtcclxuXHJcbiAgLy/QpNCj0J3QmtCm0JjQryDQmNCc0J/QntCg0KLQkCDQodCf0JjQodCa0JAg0JvQmNCh0KLQntCSXHJcbiAgY29uc3QgZ2V0UmVzdWx0RnJvbUpzb24gPSBmdW5jdGlvbihwYXRoKXtcclxuICAgIC8vIHBhdGggPSAnLi4vLi4vJyArIHBhdGg7IC8vY29uc29sZS5sb2cocGF0aCk7XHJcblxyXG4gICAgdmFyIHJlc3VsdEZyb21Kc29uID0gbnVsbDtcclxuICAgIHRyeSB7IFxyXG4gICAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcblxyXG4gICAgICB4aHIub3BlbignR0VUJywgcGF0aCwgZmFsc2UpO1xyXG4gICAgICB4aHIuc2VuZCgpO1xyXG5cclxuICAgICAgaWYgKHhoci5zdGF0dXMgIT0gMjAwKSB7XHJcbiAgICAgLy8g0L7QsdGA0LDQsdC+0YLQsNGC0Ywg0L7RiNC40LHQutGDXHJcbiAgICAgYWxlcnQoJ9Ce0YjQuNCx0LrQsCAnICsgeGhyLnN0YXR1cyArICc6ICcgKyB4aHIuc3RhdHVzVGV4dCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAvLyDQstGL0LLQtdGB0YLQuCDRgNC10LfRg9C70YzRgtCw0YJcclxuICAgIC8vIGFsZXJ0KHhoci5yZXNwb25zZVRleHQpO1xyXG4gICAgICB9XHJcbiAgICAgIHJlc3VsdEZyb21Kc29uID0gSlNPTi5wYXJzZSh4aHIucmVzcG9uc2VUZXh0KTtcclxuICAgICAgcmV0dXJuIHJlc3VsdEZyb21Kc29uO1xyXG4gICAgfVxyXG4gICAgY2F0Y2goZXJyKSB7XHJcbiAgICAgIHJlc3VsdEZyb21Kc29uID0gZ2V0UmVzdWx0RnJvbUpzb25Ob2RlKHBhdGgpOyBcclxuICAgICAgcmV0dXJuIHJlc3VsdEZyb21Kc29uO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIC8v0JjQnNCf0J7QoNCi0JjQoNCj0JXQnCDQodCf0JjQodCe0Jog0JvQmNCh0KLQntCSXHJcbiAgbGV0IHJlc2pzb24gPSBnZXRSZXN1bHRGcm9tSnNvbignLi4vZGIvbGlzdHNOYW1lLmpzb24nKTsgXHJcblxyXG4gIHZhciBhcnJMaXN0c05hbWUgPSBbXTtcclxuXHJcbiAgLy8g0JfQkNCf0J7Qm9Cd0K/QldCcINCc0JDQodCh0JjQkiBcItCY0JzQgdCdINCb0JjQodCi0J7QklwiINCY0JzQn9Ce0KDQotCY0KDQo9CV0JzQq9Cc0Jgg0JjQnNCV0J3QkNCc0JhcclxuICBmb3IodmFyIGk9MDsgaSA8IHJlc2pzb24ubGVuZ3RoOyBpKyspe1xyXG4gICAgYXJyTGlzdHNOYW1lLnB1c2gocmVzanNvbltpXS5uYW1lKTsgXHJcbiAgfTtcclxuXHJcbiAgLy8g0JzQkNCh0KHQmNCSINCb0JjQodCi0J7QklxyXG4gICRzY29wZS5yYXdTY3JlZW5zID0gW107IFxyXG5cclxuICAvL9Ck0KPQndCa0KbQmNCvINCd0JDQn9Ce0JvQndCV0J3QmNCvINCa0JDQltCU0J7Qk9CeINCb0JjQodCi0JAg0KHQntCU0JXQoNCW0JjQnNCr0JwgKGl0ZW0gLSDRjdC70LXQvNC10L3RgtGLLCDQt9Cw0LTQsNGH0Lgg0L3QsNC/0YDQuNC80LXRgClcclxuICBmdW5jdGlvbiBtYWtlTGlzdCAobGlzdF9uYW1lLCBsaXN0X2lkLCBqID0gMSkge1xyXG4gICAgdmFyIHRtcEl0ZW1zID0gW107XHJcblxyXG4gICAgZm9yICh2YXIgaSA9IDE7IGkgPD0gajsgaSsrKXtcclxuICAgICAgdG1wSXRlbXMucHVzaCh7XHJcbiAgICAgICAgdGl0bGU6ICdJdGVtICcgKyBpICsgJ3wnICsgbGlzdF9uYW1lLnN1YnN0cmluZygxLCA0KSArICd8JyxcclxuICAgICAgICB2YWx1ZTogaSxcclxuICAgICAgICBpZF9saXN0OiBsaXN0X2lkLFxyXG4gICAgICAgIG5hbWVfbGlzdDogbGlzdF9uYW1lXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRtcEl0ZW1zO1xyXG4gIH07XHJcblxyXG4gIC8v0KTQo9Cd0JrQptCY0K8g0KHQntCX0JTQkNCd0JjQryDQm9CY0KHQotCe0JJcclxuICBmdW5jdGlvbiBjcmVhdGVTaGVldHMoYXJyTGlzdHNOYW1lKXtcclxuICAgIGxldCBqID0gOTtcclxuICAgIGZvcih2YXIgaT0wOyBpIDwgYXJyTGlzdHNOYW1lLmxlbmd0aDsgaSsrKXtcclxuICAgICAgaWYoaSA9PSAyKSB7XHJcbiAgICAgICAgJHNjb3BlWydsaXN0XycgKyBTdHJpbmcoaSldID0gbWFrZUxpc3QoYXJyTGlzdHNOYW1lW2ldLCBpKTsgLy/QodCe0JfQlNCQ0KHQotCs0KHQryAxINCt0JvQldCc0JXQndCiXHJcbiAgICAgICAgJHNjb3BlWydsaXN0XycgKyBTdHJpbmcoaSldLm5hbWUgPSBhcnJMaXN0c05hbWVbaV07XHJcblxyXG4gICAgICAgIC8v0JTQntCR0JDQktCY0KLQrCDQktCd0JXQqNCd0JjQmSDQrdCb0JXQnNCV0J3QolxyXG4gICAgICAgICRzY29wZVsnbGlzdF8nICsgU3RyaW5nKGkpXS5wdXNoKHtcclxuICAgICAgICAgIHRpdGxlOiAnSXRlbSBpbiB2aXRybycsIFxyXG4gICAgICAgICAgaWRfbGlzdDogMixcclxuICAgICAgICAgIG5hbWVfbGlzdDogYXJyTGlzdHNOYW1lW2ldLFxyXG4gICAgICAgICAgdmFsdWU6IDAgXHJcbiAgICAgICAgfSkgXHJcbiAgICAgIFxyXG4gICAgICB9ZWxzZXtcclxuICAgICAgICAkc2NvcGVbJ2xpc3RfJyArIFN0cmluZyhpKV0gPSBtYWtlTGlzdChhcnJMaXN0c05hbWVbaV0sIGksIGopOyAvL9Ch0J7Ql9CU0JDQodCi0KzQodCvIDkg0K3Qm9CV0JzQldCd0KLQntCSXHJcbiAgICAgICAgJHNjb3BlWydsaXN0XycgKyBTdHJpbmcoaSldLm5hbWUgPSBhcnJMaXN0c05hbWVbaV07XHJcbiAgICAgIH1cclxuICAgICAgJHNjb3BlLnJhd1NjcmVlbnMucHVzaCgkc2NvcGVbJ2xpc3RfJyArIFN0cmluZyhpKV0pO1xyXG4gICAgfTtcclxuICB9O1xyXG4gIFxyXG4gIC8vINCh0J7Ql9CU0JDQldCcINCb0JjQodCi0KtcclxuICBjcmVhdGVTaGVldHMoYXJyTGlzdHNOYW1lKTsgXHJcbiAgXHJcbiAgJHNjb3BlLnNvcnRpbmdMb2cgPSBbXTtcclxuICBcclxuICAkc2NvcGUuc29ydGFibGVPcHRpb25zID0ge1xyXG4gICAgcGxhY2Vob2xkZXI6IFwiYXBwXCIsXHJcbiAgICBjb25uZWN0V2l0aDogXCIuYXBwcy1jb250YWluZXJcIixcclxuICAgIHVwZGF0ZTogZnVuY3Rpb24oZXZlbnQsIHVpKSB7XHJcbiAgICAgIGlmICgvLyBlbnN1cmUgd2UgYXJlIGluIHRoZSBmaXJzdCB1cGRhdGUoKSBjYWxsYmFja1xyXG4gICAgICAgICAgIXVpLml0ZW0uc29ydGFibGUucmVjZWl2ZWQgJiZcclxuICAgICAgICAgIC8vIGNoZWNrIHRoYXQgaXRzIGFuIGFjdHVhbCBtb3ZpbmdcclxuICAgICAgICAgIC8vIGJldHdlZW4gdGhlIHR3byBsaXN0c1xyXG4gICAgICAgICAgdWkuaXRlbS5zb3J0YWJsZS5zb3VyY2VbMF0gIT09IHVpLml0ZW0uc29ydGFibGUuZHJvcHRhcmdldFswXSAmJlxyXG4gICAgICAgICAgLy8gY2hlY2sgdGhlIHNpemUgbGltaXRhdGlvblxyXG4gICAgICAgICAgdWkuaXRlbS5zb3J0YWJsZS5kcm9wdGFyZ2V0TW9kZWwubGVuZ3RoID49IDEwKSB7XHJcbiAgICAgICAgdWkuaXRlbS5zb3J0YWJsZS5jYW5jZWwoKTtcclxuICAgICAgfVxyXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8ICRzY29wZS5yYXdTY3JlZW5zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgJHNjb3BlLnJhd1NjcmVlbnNbaV0ubWFwKGZ1bmN0aW9uICh4KSB7XHJcbiAgICAgICAgICBpZiggeC5pZF9saXN0ICE9IGkpe1xyXG4gICAgICAgICAgICB4LmlkX2xpc3QgPSBpOyBcclxuICAgICAgICAgICAgeC5uYW1lX2xpc3QgPSAkc2NvcGUucmF3U2NyZWVuc1tpXS5uYW1lXHJcbiAgICAgICAgICB9O1xyXG4gICAgICAgIH0pXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9O1xyXG4gIFxyXG4gIC8v0JLQq9CS0J7QlCDQodCe0JTQldCg0JbQmNCc0J7Qk9CeINCb0JjQodCi0J7QkiBcclxuICAkc2NvcGUubG9nTW9kZWxzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgJHNjb3BlLnNvcnRpbmdMb2cgPSBbXTtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgJHNjb3BlLnJhd1NjcmVlbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdmFyIGxvZ0VudHJ5ID0gJHNjb3BlLnJhd1NjcmVlbnNbaV0ubWFwKGZ1bmN0aW9uICh4KSB7XHJcbiAgICAgICAgcmV0dXJuIHgudGl0bGUgKyAnLScgKyB4LmlkX2xpc3QgKyAnIHwnICsgeC5uYW1lX2xpc3Q7XHJcbiAgICAgIH0pLmpvaW4oJywgJyk7XHJcbiAgICAgIGxvZ0VudHJ5ID0gJ2NvbnRhaW5lciAnICsgKGkrMSkgKyAnOiAnICsgbG9nRW50cnk7XHJcbiAgICAgICRzY29wZS5zb3J0aW5nTG9nLnB1c2gobG9nRW50cnkpO1xyXG4gICAgfVxyXG4gIH07XHJcbn1dKTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gZnJvbnRlbmQvanMvYXBwLmpzIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7QUN0Q0E7QUFDQTtBQUNBOzs7Ozs7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSkE7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFKQTtBQU9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFyQkE7QUFDQTtBQXVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OyIsInNvdXJjZVJvb3QiOiIifQ==