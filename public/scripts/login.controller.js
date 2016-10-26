angular.module('passportApp')
.controller('LoginController', LoginController);

function LoginController($http) {
  var ctrl = this;

  ctrl.login = function() {
    console.log('logging in');
    $http.post('/login', {
      username: ctrl.username,
      password: ctrl.password
    }).then(function(response){
      console.log(response);
    }, function(error) {
      console.log('error loggin in', error);
    });
  };
}
