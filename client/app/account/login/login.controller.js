'use strict';

class LoginController {
  //start-non-standard
  user = {};
  errors = {};
  submitted = false;
  //end-non-standard

  constructor(Auth, $location, version, $analytics) {
    this.Auth = Auth;
    this.$location = $location;
    this.version = version.getVersion();
    this.$analytics = $analytics;
  }

  login(form) {
    this.submitted = true;

    if (form.$valid) {
      this.Auth.login({
        email: this.user.email,
        password: this.user.password
      })
      .then((us) => {
        ga('set', 'userId', us._id);
        // Logged in, redirect to home
        this.$location.path('/');
      })
      .catch(err => {
        this.errors.other = err.message;
      });
    }
  }
}

angular.module('proteoWebApp')
  .controller('LoginController', LoginController);
