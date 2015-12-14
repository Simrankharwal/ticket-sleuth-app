angular.module("ticketSleuthService", [])

.factory("ticketSleuthService", function($http)
{
  return {
    getSeatingLevels : function()
    {
      return $http.get("http://localhost:8080/ticket-sleuth/v1/api/venue/capacity");
    },
    getSeatingCapacity : function(level)
    {
      return $http.get("http://localhost:8080/ticket-sleuth/v1/api/venue/" + level.id + "/capacity");
    },
    numSeatsAvailable : function(level)
    {
      return $http.get("http://localhost:8080/ticket-sleuth/v1/api/tickets/" + level.id + "/available");
    },
    findAndHoldSeats : function(numSeats, minLevel, maxLevel, customerEmail)
    {
      return $http.post("http://localhost:8080/ticket-sleuth/v1/api/tickets/hold?numSeats=" + numSeats + "&minLevel=" + minLevel.id + "&maxLevel=" + maxLevel.id + "&customerEmail=" + customerEmail);
    },
    reserveSeats : function(seatHold, customerEmail)
    {
      return $http.post("http://localhost:8080/ticket-sleuth/v1/api/tickets/reserve?seatHoldId=" + seatHold.id + "&customerEmail=" + customerEmail);
    },
    releaseSeats : function(seatHold)
    {
      return $http.delete("http://localhost:8080/ticket-sleuth/v1/api/tickets/reserve/" + seatHold.id);
    }
  }
});
