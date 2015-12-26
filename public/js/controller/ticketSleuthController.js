var app = angular.module("ticketSleuthController", [])

app.controller("ticketSleuthController", function ($scope, $http, $location, $route, $routeParams, ticketSleuthService)
{
  $scope.login = function()
  {
    $scope.getSeatingLevels();
    $scope.setView("/selectLevel");
  }
  
  $scope.logout = function()
  {
    $scope.user = {};
    $scope.setView("/login");
  }

  $scope.addAlert = function(type, message)
  {
    var alert = {};
    alert.type = type;
    alert.msg = message;
    
    $scope.alerts.push(alert);
  };

  $scope.closeAlert = function(index)
  {
    $scope.alerts.splice(index, 1);
  };

  $scope.displayError = function(status, data)
  {
    $scope.addAlert("danger", "Oh snap! Something went wrong, plesase contact support. status='" + status + "' message='" + data + "'");
  };

  $scope.selectLevel = function(level)
  {
    $scope.ticketRequest.minLevel = level;
    $scope.ticketRequest.maxLevel = level;
    $scope.pushView("/findTickets/" + level.id);
  };

  $scope.setView = function (path)
  {
    $location.path(path);
    
    $scope.viewStack = [];
    $scope.viewStack.push(path);
  };

  $scope.isView = function(path)
  {
    return $location.path() == path;
  };
  
  $scope.pushView = function(path)
  {
    $location.path(path);
    $scope.viewStack.push(path);
  };

  $scope.popView = function()
  {
    $scope.viewStack.pop();
    $location.path($scope.viewStack[$scope.viewStack.length-1]);
  };

  $scope.getSeatingLevels = function()
  {
    var response = ticketSleuthService.getSeatingLevels();

    response.success(function (data, status, headers, config)
    {
      $scope.levels = data;
      $scope.updateSeatAvailability();
    });

    response.error(function (data, status, headers, config)
    {
      $scope.displayError(status, data);
    });
  };

  $scope.updateSeatAvailability = function()
  {
    // Need to keep the seating availability numbers as real-time as possible
    for (i=0; i<$scope.levels.length; i++)
    {
      $scope.numSeatsAvailable($scope.levels[i]);
    }
  };
    
  $scope.numSeatsAvailable = function(level)
  {
    var response = ticketSleuthService.numSeatsAvailable(level);

    response.success(function (data, status, headers, config)
    {
      level.available = data;
    });

    response.error(function (data, status, headers, config)
    {
      $scope.displayError(status, data);
    });
  };
    
  $scope.findAndHoldSeats = function()
  {
    var response = ticketSleuthService.findAndHoldSeats($scope.ticketRequest.numSeats, $scope.ticketRequest.minLevel, $scope.ticketRequest.maxLevel, $scope.user.email);

    response.success(function (data, status, headers, config)
    {
      $scope.seatHold = data;
      
      if ( !$scope.seatHold.seats )
      {
        $scope.addAlert("info", "We're sorry your request could not be fulfilled at this time. Please update your request and try again.");
      }
    });

    response.error(function (data, status, headers, config)
    {
      $scope.displayError(status, data);
    });
  };
    
  $scope.reserveSeats = function()
  {
    var response = ticketSleuthService.reserveSeats($scope.seatHold, $scope.user.email);

    response.success(function (data, status, headers, config)
    {
      if ( !data )
      {
        $scope.addAlert("info", "We're sorry your request could not be fulfilled at this time. Please try your request again.");
      }
      else
      {
        $scope.addAlert("success", "Enjoy the show! Your order confirmation number is '" + data + "'. Thanks for using Ticket Sleuth!");
      }
      
      $scope.updateSeatAvailability();
      $scope.ticketRequest = {};
      $scope.seatHold = null;
    });

    response.error(function (data, status, headers, config)
    {
      // CSC - should I update availability on error?
      $scope.displayError(status, data);
    });
  };
    
  $scope.releaseSeats = function()
  {
    if (!$scope.seatHold)
    {
      $scope.updateSeatAvailability();
      return;
    }
    
    var response = ticketSleuthService.releaseSeats($scope.seatHold, $scope.user.email);

    response.success(function (data, status, headers, config)
    {
      // No data returned by service
      $scope.updateSeatAvailability();
      $scope.ticketRequest = {};
      $scope.seatHold = null;
    });

    response.error(function (data, status, headers, config)
    {
      // CSC - should I update availability on error?
      $scope.displayError(status, data);
    });
  };
    
  $scope.user = {};
  $scope.ticketRequest = {};
  $scope.alerts = [];
});
