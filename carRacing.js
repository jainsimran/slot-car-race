function slotCarRace(len) {
  this.fetchData= () => {
    fetch('data.json')
    .then(data => data.json())
    .then( data => {
      this.carsDescription = data.carsDescription;
      this.checkIntervals();
    })
    .catch(error =>{
      console.log("error");
    });
  }

  this.raceTrack = {
    lengthofTrack: len,
    weather: [
      { name: 'rainy', speed: 'slow'},
      { name: 'snowy', speed: 'slow'},
      { name: 'sunny', speed: 'fast'},
      { name: 'foggy', speed: 'slow'}
    ],
    winner: 0,
  };

  // function expression to find winner
  this.winner = () => {
    clearInterval(this.timer);
    console.log(`Race is completed!`);
    this.carsDescription.sort(function(car1, car2) {
      return car1.trackPosition - car2.trackPosition;
    });
    const winnerCar =  this.carsDescription[this.carsDescription.length-1]
    if(winnerCar.trackPosition > this.raceTrack.lengthofTrack) console.log(`${winnerCar.name} has won the race!`);
  }

  // function expression to check intervals
  this.checkIntervals = () => {
    // display random weather condition
    let randomWeather = this.raceTrack.weather[Math.floor(Math.random()*this.raceTrack.weather.length)];
    console.log(`Its current ${randomWeather.name} weather`);
    this.timer = setInterval(()=> {
      const workingCars = this.workingCars();
      const carsCompletedRace = workingCars.filter((car) => car.trackPosition > this.raceTrack.lengthofTrack);
      if(workingCars.length === 0) return this.winner();
      else if(carsCompletedRace.length === workingCars.length) return this.winner();
      this.update(this.workingCars());
    }, 3000);
  }

  // function expression to update
  this.update = (cars) => {
    cars.forEach((car) => {
      if(car.trackPosition <= this.raceTrack.lengthofTrack)
      car.trackPosition += car.maxSpeed * 3;
    });
    const workingCars = this.workingCars();
    this.trackPosition(workingCars);
    this.isNitroBoostUsed(workingCars);
    this.isCarBreakDown(workingCars);
  }
}

// function expression to start race
slotCarRace.prototype.start = function() {
  console.log(`Get Set Go!!`);
  this.fetchData();
}

// function expression to see working cars
slotCarRace.prototype.workingCars = function () {
  return this.carsDescription.filter(car => car.workingStatus === true);
}

// function expression to check car break down
slotCarRace.prototype.isCarBreakDown = function(cars) {
  cars.forEach(car => {
    let chanceofDown = Math.random();
    let isDown = chanceofDown < car.chanceofBreakown;
    if(isDown && car.trackPosition < this.raceTrack.lengthofTrack) {
      console.log(`${car.name} breaks down in the current round`);
      car.workingStatus = false;
    }
  });
}

//  function expression for use of nitro boost used by cars
slotCarRace.prototype.isNitroBoostUsed = function(cars) {
  cars.forEach(car => {
    let chanceofNitroBoosted = Math.random();
    let isNitroBoosted = car.nitroBoosts ? chanceofNitroBoosted > car.chanceOfNitroBoostPerTurn : false;
    if(isNitroBoosted) {
      console.log(`${car.name} uses nitro boosters`);
      car.nitroBoosts--;
      if(car.trackPosition <= this.raceTrack.lengthofTrack) {
        car.trackPosition += (car.maxSpeed + 100) *3;
      }
    }
  });
}

// function expression to track the position of the cars
slotCarRace.prototype.trackPosition =  function(cars) {
  cars.forEach((car) => {
    if(car.trackPosition < this.raceTrack.lengthofTrack) console.log(`${car.name} left ${this.raceTrack.lengthofTrack - car.trackPosition} kms to complete the race!`);
  });
}


// to start car race
let obj1 = new slotCarRace(10000);
obj1.start();
