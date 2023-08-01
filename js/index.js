"use strict";
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
      templateUrl: "views/home.html",
      controller: "homeCtrl",
    })
    .when("/home", {
      templateUrl: "views/home.html",
      controller: "homeCtrl",
    })
    .when("/shop/:nameProduct", {
      templateUrl: "views/shop.html?" + Math.random(),
    })
    .otherwise({
      redirectTo: "/",
    })
    .when("/contact", {
      templateUrl: "views/contact.html",
    })
    .when("/about", {
      templateUrl: "views/about.html",
    })
    .when("/blog", {
      templateUrl: "views/blog.html",
    })
    .when("/cart", {
      templateUrl: "views/cart.html",
    })
    .when("/detail", {
      templateUrl: "views/detail.html",
      controller: "detailCtrl",
    })
    .when("/login", {
      templateUrl: "views/login.html",
    })
    .when("/user", {
      templateUrl: "views/user.html",
    })
    .when("/blog-detail/:id", {
      templateUrl: "views/blog-Detail.html",
    });
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
  var listCart = [];
  var orderCart = [];
  var user = {};
  var orderList = [];

  // set data product
  function set(data) {
    savedData = data;
  }
  function get() {
    return savedData;
  }

  // set list cart
  function setListCart(item) {
    let check = listCart.indexOf(item);
    console.log(check);
    if (check == -1) {
      listCart.push(item);
    }
  }
  // get list cart
  function getListCart() {
    return listCart;
  }
  // get quantyitem product
  // reset list cart
  function resetListCart() {
    listCart.splice(0, listCart.length);
  }
  // delete product item cart
  function deleteItemListCart(item) {
    listCart.forEach((element, index) => {
      if (element.id == item.id) {
        listCart.splice(index, 1);
      }
    });
  }

  // save type product
  function setTypeProduct(type) {
    saveType = type;
  }
  function getTypeProduct() {
    return saveType;
  }

  //login
  function loginUser(element) {
    user = element;
  }

  function getUser() {
    return user;
  }

  function logoutUser(data) {
    const objWithIdIndex = user.findIndex((obj) => obj.id === data.id);
    if (objWithIdIndex > -1) {
      user.splice(objWithIdIndex, 1);
    }
    return user;
  }

  return {
    set: set,
    get: get,

    setTypeProduct: setTypeProduct,
    getTypeProduct: getTypeProduct,

    //  myservice list cart
    setListCart: setListCart,
    getListCart: getListCart,
    deleteItemListCart: deleteItemListCart,
    resetListCart: resetListCart,
    // get quantily item product

    // login/logout user
    loginUser: loginUser,
    getUser: getUser,
    logoutUser: logoutUser,
  };
});
myApp.filter("myFilter", function () {
  return function (items, search) {
    if (!search) {
      return items;
    }
    var type = search;
    if (!type || "shop" == type) {
      return items;
    }

    if (search == "no" || search == "with") {
      return items.filter(function (element, index) {
        console.log(search);
        return element.egg == search;
      });
    }

    return items.filter(function (element, index) {
      return element.type == search;
    });
  };
});
// filte price
myApp.filter("rangePrice", function () {
  return function (items, rangePrice) {
    var filteredValue = [];
    var toPrice =
      rangePrice.toPrice != undefined ? parseInt(rangePrice.toPrice) : 1;
    var fromPrice =
      rangePrice.fromPrice != undefined ? parseInt(rangePrice.fromPrice) : 100;
    angular.forEach(items, function (item) {
      if (item.price >= toPrice) {
        filteredValue.push(item);
      }
    });
    return filteredValue;
  };
});
// home controller
myApp.controller("homeCtrl", function ($scope, myService, $http) {
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
  // function set list cart
  $scope.setItemListCart = function (item) {
    myService.setListCart(item);
  };
  $http.get("./data/blog.json").then(function (response) {
    $scope.listBlogs = response.data.blog;
  });
});
// nav constroller
myApp.controller("navCtrl", function ($scope, myService) {
  $scope.showNavbar = function () {
    $(".nav").hide();
    $(".nav-sidebar").show();
  };
  $scope.hidenNavbar = function () {
    $(".nav").show();
    $(".nav-sidebar").hide();
  };
  // save type to myService
  $scope.saveType = function (type) {
    myService.setTypeProduct(type);
  };

  // get typeproduct
});
// app custommer filter

// shop controller
myApp.controller("shopCtrl", function ($scope, $routeParams, myService, $http) {
  $scope.prop = $routeParams.nameProduct;
  //pagination product
  $scope.begin = 0;
  $scope.pageSize = 12;
  $scope.pageCount = Math.ceil($scope.dataProduct.length / $scope.pageSize);

  $scope.first = function () {
    $scope.begin = 0;
  };
  $scope.previous = function () {
    if ($scope.begin > 0) {
      $scope.begin -= $scope.pageSize;
    }
  };
  $scope.next = function () {
    if ($scope.begin < ($scope.pageSize - 1) * $scope.pageSize) {
      $scope.begin += $scope.pageSize;
    }
  };
  $scope.last = function () {
    $scope.begin = ($scope.pageSize - 1) * $scope.pageSize;
  };
  $scope.sortBy = function (prop) {
    $scope.prop = prop;
  };

  // range input change background by price
  $("#slider-range").slider({
    range: true,
    min: 0,
    max: 200,
    values: [1, 100],
    slide: function (event, ui) {
      $("#amount").val("$" + ui.values[0] + " - $" + ui.values[1]);
    },
  });
  $("#amount").val(
    "$" +
      $("#slider-range").slider("values", 0) +
      " - $" +
      $("#slider-range").slider("values", 1)
  );

  $("#slider-range-shop").slider({
    range: true,
    min: 0,
    max: 200,
    values: [1, 100],
    slide: function (event, ui) {
      $("#amount-shop").val("$" + ui.values[0] + " - $" + ui.values[1]);
      $scope.to_price = ui.values[0];
      $scope.from_price = ui.values[1];
    },
  });
  $("#amount-shop").val(
    "$" +
      $("#slider-range-shop").slider("values", 0) +
      " - $" +
      $("#slider-range-shop").slider("values", 1)
  );

  // save item data  myservice
  $scope.saveData = function (item) {
    myService.set(item);
  };

  // function set list cart
  $scope.setItemListCart = function (item) {
    myService.setListCart(item);
  };
  // modal
});

// contact controller
myApp.controller("contactCtrl", function ($scope) {});
// detail controller
myApp.controller("detailCtrl", function ($scope, myService) {
  // get  data from myservice
  $scope.data = myService.get();
  $scope.setItemListCart = function (item) {
    myService.setListCart(item);
  };
  $scope.data.image == null
    ? ($scope.data.image =
        "./images/Cute_girl_bakery_logo_homemade_bakery_shop_hand_drawn_cartoon_art_illustration.jpg")
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

  let magnifying_area = document.getElementById("magnifying_area");
  let magnifying_img = document.getElementById("magnifying_img");
  magnifying_area.addEventListener("mousemove", function (event) {
    let clientX = event.clientX - magnifying_area.offsetLeft;
    let clinetY = event.clientY - magnifying_area.offsetTop;

    let mWidth = magnifying_area.offsetWidth;
    let mHeight = magnifying_area.offsetHeight;

    clientX = (clientX / mWidth) * 100;
    clinetY = (clinetY / mWidth) * 100;

    magnifying_img.style.transform =
      "translate(-" + clientX + "%,-" + clinetY + "%) scale(2.4)";
  });
  magnifying_area.addEventListener("mouseleave", function () {
    magnifying_img.style.transform = "translate(-50%,-50%) scale(1)";
  });
});
myApp.controller("aboutCtrl", function ($scope) {});

// blog controller
myApp.controller("blogCtrl", function ($scope, $http) {
  $http.get("./data/blog.json").then(function (response) {
    $scope.listBlog = response.data.blog;
  });
});

myApp.controller("cartCtrl", function ($scope, myService) {
  // get list cart
  let list = "";
  list = myService.getListCart();
  console.log(list);

  list == ""
    ? (($scope.checkout = false), ($scope.checkList = true))
    : (($scope.checkout = true), ($scope.checkList = false));
  // total order
  $scope.totalOrder = function () {
    var total = 0;
    list.forEach((element) => {
      total += element.price * element.amount;
    });
    return total;
  };
  // quantily order
  $scope.quantily = function () {
    var quantily = 0;
    list.forEach((element, index) => {
      if (element.amount > 0) {
        quantily += element.amount;
      } else {
        quantily = 0;
      }
    });
    return quantily;
  };
  //  order name producct
  $scope.nameProduct = function () {
    var listname = [];
    list.forEach((element, index) => {
      listname.push(element.name);
    });
    return listname.toString();
  };
  // remover item cart
  $scope.removeItem = function (item) {
    myService.deleteItemListCart(item);
  };
  //
  $scope.listCart = list;

  // reset list car and from
  $scope.resetList = function () {
    myService.resetListCart();
    $("#modal-from").trigger("reset");
    $scope.checkout = false;
    $scope.checkList = true;
  };

  const exampleModal = document.getElementById("exampleModal");
  if (exampleModal) {
    exampleModal.addEventListener("show.bs.modal", (event) => {
      // Button that triggered the modal
      const button = event.relatedTarget;
      // Extract info from data-bs-* attributes
      const recipient = button.getAttribute("data-bs-whatever");
      // If necessary, you could initiate an Ajax request here
      // and then do the updating in a callback.

      // Update the modal's content.
      const modalTitle = exampleModal.querySelector(".modal-title");
      const modalBodyInput = exampleModal.querySelector(".modal-body input");
    });
  }
});

/**
 * LOGIN CONTROLLER
 * **/
myApp.controller("loginCtrl", function ($scope, myService, $http) {
  var listUser = [];
  var user = {
    email: "",
    password: false,
  };
  $http.get("./data/user.json").then(function (response) {
    listUser = response.data.details;
  });

  // login
  console.log(listUser);
  //validateEmail
  function validateEmail(email) {
    let res = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return res.test(email);
  }

  $scope.login = function () {
    user.email = $scope.email;
    user.password = $scope.password;

    let item = listUser.filter((el) => el.password == user.password);
    if (item.length == 1) {
      myService.loginUser(item);

      $("#to-user").attr("href", "#!/user");
    } else {
      $scope.check = true;
    }
  };

  //logout
  $scope.logout = function (data) {
    myService.logoutUser(data);
  };
});
// controoler userCrtl

myApp.controller("userCtrl", function ($scope, myService) {
  // get my service  user
  $scope.items = myService.getUser();
});
// detail blog
myApp.controller("blogDetailCtrl", function ($scope, $routeParams, $http) {
  var listDetailBlog = [];
  let idBlog = $routeParams.id;

  $http.get("./data/detail-blog.json").then(function (response) {
    listDetailBlog = response.data.blogDetail;
    $scope.itemBlog = listDetailBlog.filter((item) => item.id == idBlog);
    console.log($scope.itemBlog);
  });
});
//scroll to top
const button = document.querySelector("a");
const btn = document.querySelector("button");
const div = document.querySelector("div");
button.addEventListener("click", () => {
  window.scrollTo(0, 0);
});
btn.addEventListener("click", () => {
  window.scrollTo(0, 0);
});
button.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: `smooth`,
  });
});
btn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: `smooth`,
  });
});
