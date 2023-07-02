// carousel
// let navbar = document.querySelector('.navbar');

// document.querySelector('#menu-btn').onclick = () => {
//     navbar.classList.toggle('active');
// }

// window.onscroll = () => {
//     navbar.classList.remove('active');
// }

/*famework angular js */
//
var myApp = angular.module("myApp", ["ngRoute"]);
myApp.config(function ($routeProvider) {
  $routeProvider

    .when("/", {
      templateUrl: "../views/home.html",
      controller: "homeCtrl",
    })
    .when("/shop", {
      templateUrl: "./views/shop.html",
      controller: "shopCtrl",
    })
    .otherwise({
      redirectTo: "/",
    })
    .when("/contact", {
      templateUrl: "./views/contact.html",
    })
    .when("/about", {
      templateUrl: "./views/about.html",
    });
  // .when("/detail", {
  //   templateUrl: "./views/detail.html",
  // });
});
myApp.run(function ($rootScope, $http) {
  $http.get("./data/data.json").then(function (response) {
    $rootScope.dataProduct = response.data.details;
    console.log(response);
  });
});
// factory
myApp.factory("myService", function () {
  var savedData = {};
  var saveType = "";
  // set data product
  function set(data) {
    savedData = data;
  }
  function get() {
    return savedData;
  }

  // save type product
  function setTypeProduct(type) {
    saveType = type;
  }
  function getTypeproduct() {
    return saveType;
  }

  return {
    set: set,
    get: get,
    setTypeProduct: setTypeProduct,
    getTypeproduct: getTypeproduct,
  };
});
// nav constroller
myApp.controller("navCtrl", function ($scope) {
  $scope.showNavbar = function () {
    $(".nav").hide();
    $(".nav-sidebar").show();
  };
  $scope.hidenNavbar = function () {
    $(".nav").show();
    $(".nav-sidebar").hide();
  };
});
// home controller
myApp.controller("homeCtrl", function ($scope, myService) {
  let fade = document.querySelectorAll(".fade");

  let index = 0;

  $scope.next = function () {
    fade[index].classList.remove("show");
    index = (index + 1) % fade.length;
    fade[index].classList.add("show");
  };

  $scope.prev = function () {
    fade[index].classList.remove("show");
    index = (index - 1 + fade.length) % fade.length;
    fade[index].classList.add("show");
  };
  // save data to myService
  $scope.saveData = function (data) {
    myService.set(data);
  };
  // save type to myserevice
  $scope.saveType = function (type) {
    myService.setTypeProduct(type);
  };
});
// shop controller
myApp.controller("shopCtrl", function ($scope, myService) {
  // get type from myservice
  $scope.typeProduct = myService.getTypeproduct();
  console.log($scope.dataProduct);
  // get data from filr json

  // varible nagination page

  ($scope.currentPage = 1), ($scope.pageSize = 12);

  // get type from myservice

  $scope.filter = $scope.typeProduct;
  console.log($scope.filter);
  $scope.getType = function (typeProduct) {
    console.log(typeProduct);
    $scope.type = typeProduct;
  };
  $scope.orderfilEgg = function (egg) {
    $scope.egg = egg;
  };

  //

  // save item data  myservice
  $scope.saveData = function (item) {
    myService.set(item);
  };

  // range input change background by price

  // filter product from data
});

// contact controller
myApp.controller("contactCtrl", function ($scope) {});
// detail controller
myApp.controller("detailCtrl", function ($scope, myService) {
  // get  data from myservice
  $scope.data = myService.get();

  $scope.data.image == null
    ? ($scope.data.image =
        "../images/Cute_girl_bakery_logo_homemade_bakery_shop_hand_drawn_cartoon_art_illustration.jpg")
    : null;

  // get by class tag
  let contentBody = document.querySelector(".content-product-body");
  let btnDown = document.querySelector(".content-product__down");
  let btnUp = document.querySelector(".content-product__up");
  // show hiden content  body Product
  $scope.showContent = function () {
    contentBody.classList.add("product-active");

    btnDown.classList.add("hiden-btn");

    btnUp.classList.remove("hiden-btn");
    btnUp.classList.add("show-btn");
  };
  $scope.hidenContent = function () {
    contentBody.classList.remove("product-active");

    btnDown.classList.add("show-btn");
    btnDown.classList.remove("hiden-btn");

    btnUp.classList.add("hiden-btn");
    btnUp.classList.remove("show-btn");
  };
  // zoom img product

  // let magnifying_area = document.getElementById("magnifying_area");
  // let magnifying_img = document.getElementById("magnifying_img");
  // magnifying_area.addEventListener("mousemove", function (event) {
  //   let clientX = event.clientX - magnifying_area.offsetLeft;
  //   let clinetY = event.clientY - magnifying_area.offsetTop;

  //   mWidth = magnifying_area.offsetWidth;
  //   mHeight = magnifying_area.offsetHeight;

  //   clientX = (clientX / mWidth) * 100;
  //   clinetY = (clinetY / mWidth) * 100;

  //   magnifying_img.style.transform =
  //     "translate(-" + clientX + "%,-" + clinetY + "%) scale(2.4)";
  // });
  // magnifying_area.addEventListener("mouseleave", function () {
  //   magnifying_img.style.transform = "translate(-50%,-50%) scale(1)";
  // });
});
myApp.controller("aboutCtrl", function ($scope) {});
