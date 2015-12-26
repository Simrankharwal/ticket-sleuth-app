var app = angular.module("ticketSleuth", ["ticketSleuthController", "ticketSleuthService", "ngRoute", "ui.bootstrap"]);

app.config(function($routeProvider) 
{
  $routeProvider

      .when("/", {
        redirectTo: "/login"
      })

      .when("/login", {
          templateUrl : "template/login.html",
//          controller  : "mainController"
      })

      .when("/selectLevel", {
          templateUrl : "template/select-ticket-level.html",
//          controller  : "aboutController"
      })

      .when("/findTickets/:levelId", {
          templateUrl : "template/find-hold-tickets.html",
//          controller  : "contactController"
      });

});
