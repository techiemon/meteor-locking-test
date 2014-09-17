angular.module("app").controller("SeatsCtrl", [
  "$scope", "$collection", function($scope, $collection) {
    var client_color = Math.floor(Math.random()*16777215).toString(16);

    $scope.mdebug = function() {
      return console.debug($scope.seats);
    };
    $scope.start = function() {
      console.debug('BUY BUY BUY !!!!!!!!!!!!!!');


      $.each($scope.seats, function(i,seat) {
        // seat = angular.copy(bseat);
        if (! seat.lock) {
          seat.username = $scope.username;
          seat.color = '#' + client_color;
          seat.lock = true;



          Meteor.call('buySeat', seat, function(err, response) {
            console.debug(err, response);
          });

          // $scope.seats.save(seat);
        }
      });
    };

    $scope.buySeat = function(seat) {

        if (! seat.lock) {
          seat.username = $scope.username;
          seat.color = '#' + client_color;
          seat.lock = true;

          // $scope.seats.save(seat);

          Meteor.call('buySeat', seat, function(err, response) {
            console.debug(err, response);
          });

          // $scope.seats.save(seat);

        }
    }

  // chatStream.on('message', function(message) {
  //   console.log('user ng: ' + message);
  // });
    chatStream.on('message', function(message) {

      $scope.next_purchase = message.toString();
      starttimer(message);
      console.log('EMIT REC: ' + message);
    });

    $scope.next_purchase = 'Not Set';
    $scope.restart = function() {
      Meteor.call('resetSeats', function(err, message) {
        console.debug(err, message);
        chatStream.emit('message', message);
        starttimer(message);

      });
    };

    var starttimer = function(message) {
        console.log('timer REC: ' + message);
        $scope.next_purchase = message.toString();

        var millisTill10 = Math.abs(new Date() - message);
        ticker = setInterval(countdown(message), 1000);

        setTimeout(function() {
          $scope.start();
          clearInterval(ticker);
        }, millisTill10);
    }

  // sendChat = function(message) {
  //   chatStream.emit('message', message);
  //   console.log('me: ' + message);
  // };

    var countdown = function(target){
      cd = Math.abs(new Date() - target);
      console.debug(cd);
    };


    return $collection(Seats).bind($scope, 'seats');
  }
]);

