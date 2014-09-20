angular.module("app").controller("SeatsCtrl", [
  "$scope", "$collection", function($scope, $collection) {
    var client_color = Math.floor(Math.random()*16777215).toString(16);

    $scope.username = 'user';
    $scope.mdebug = function() {
      return console.debug($scope.seats);
    };
    $scope.start = function() {
      console.debug('BUY BUY BUY !!!!!!!!!!!!!!');

      function randomIntFromInterval(min,max)
      {
          return Math.floor(Math.random()*(max-min+1)+min);
      }

      // $.each($scope.seats, function(i,seat) {
      //   // seat = angular.copy(bseat);
      //   if (! seat.lock) {
      //     seat.username = $scope.username;
      //     seat.color = '#' + client_color;
      //     seat.lock = true;


      //     mofo(seat);

      //     // $scope.seats.save(seat);
      //   }
      // });
      // 
      // 
      var available_seats = [];
      $.each($scope.seats, function(i,seat) {
        if (seat.lock == false) {
          available_seats.push(seat);
        }
      });


      var max = available_seats.length - 2; // minus 1 , minus 1 seat so 2 can be allocated.
      var position = randomIntFromInterval(0, max);

      // while (available_seats[position].lock == true) {
      //   position = randomIntFromInterval(0, max);
      // }

      var two_seats = [
            available_seats[position],
            available_seats[position+1]
          ];
// console.debug(max, position, two_seats);
      $.each(two_seats, function(i, seat) {
        seat.username = $scope.username;
        seat.color = '#' + client_color;
        seat.lock = true;
        mofo(seat);
      });

      var done = true;
      $.each($scope.seats, function(i,seat) {
        if (seat.lock == false) {
          done = false;
        }
      });
console.debug('done:', done);
      if (! done) {
        $scope.start();
      }
    };

    function mofo(seat) {
          // console.debug(seat._id);
          return Meteor.apply('buySeat', [seat],  {wait: true}, function(err,res) {
            // console.debug(err, res);
          });
    }

    $scope.buySeat = function(seat) {

        if (! seat.lock) {
          seat.username = $scope.username;
          seat.color = '#' + client_color;
          seat.lock = true;

          // $scope.seats.save(seat);

          Meteor.apply('buySeat', [seat], {wait: true}, function(err, response) {
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

