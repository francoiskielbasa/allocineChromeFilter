/**
 * Created by francois on 27/10/15.
 */

/**
 * Class Filter
 */
function Filter(isActive, hideUnShowed, startTimeFrom, startTimeTo) {
    this.isActive = isActive;
    this.hideUnShowed = hideUnShowed;
    this.startTimeFrom = startTimeFrom;
    this.startTimeTo = startTimeTo;
}

/**
 * Class Movie
 */
function Movie(movie, showtimes) {
    this.movie = movie;
    this.showtimes = showtimes;
    this.DOMElement = document.querySelector('#movie' + this.movie.id);

    this.startTimes = function () {
        var startTimes = [];

        for (var firstKey in this.showtimes) {
            for (var secondKey in this.showtimes[firstKey].showtimes) {
                var showtimePart = this.showtimes[firstKey].showtimes[secondKey];

                var startTime = new Date(showtimePart.showStart);
                startTime.setHours(startTime.getHours() - 1);

                startTimes.push(startTime);
            }
        }

        return startTimes;
    };

    this.isDisplayedToday = function () {
        var now = new Date();

        for (var key in this.startTimes()) {
            if (this.startTimes()[key] >= now) {
                return true;
            }
        }
        return false;
    }
}

Movie.prototype.shouldBeDisplayed = function (filter) {
    var from, to;

    if (!filter.isActive) {
        return true;
    }

    if (filter.hideUnShowed && !this.isDisplayedToday()) {
        return false;
    }

    if (typeof filter.startTimeFrom !== 'undefined') {
        from = filter.startTimeFrom;
    } else {
        from = '';
    }

    if (typeof filter.startTimeTo !== 'undefined') {
        to = filter.startTimeTo;
    } else {
        to = '';
    }

    if (from !== '' || to !== '') {
        if (from === '') {
            from = '00:00';
        }
        if (to === '') {
            to = '23:59';
        }

        for (var key in this.startTimes()) {
            var startTime = this.startTimes()[key];
            var fromDate = getDate(from);
            var toDate = getDate(to);

            if (startTime >= fromDate && startTime <= toDate) {
                return true;
            }
        }
        return false;
    }

    return true;
};

/**
 * return Date from "hh:mm" format string
 */
function getDate(time) {
    var today = new Date();
    var hours = time.split(':')[0];
    var minutes = time.split(':')[1];

    return new Date(today.getFullYear(), today.getMonth(), today.getDate(), hours, minutes, 0);
}

/**
 * Function getMovies
 * return an array of movies
 */
function getMovies() {
    var data = getData();

    var now = new Date();
    var showtimesList = getShowtimes(data, now);


    var movies = [];

    var moviesId = Object.keys(data.movies);

    moviesId.forEach(function (id) {
        //Sometimes, movie has no show-times
        if (showtimesList.hasOwnProperty(id)) {
            var showtimes = showtimesList[id];
            var movie = data.movies[id];

            movies.push(new Movie(movie, showtimes));
        }
    });

    return movies;
}

function getShowtimes(data, date) {
    var currentTheatre = Object.keys(data.showtimes)[0];
    var dateString = date.toISOString().slice(0, 10);

    return data.showtimes[currentTheatre][dateString];
}

function getData() {
    return JSON.parse(document.querySelector('#content-start section').dataset.moviesShowtimes);
}

/**
 * Function run
 * Main process is here
 */
function run(movies) {
    chrome.storage.local.get(['filtersAreActive', 'hideUnShowed', 'startTimeFrom', 'startTimeTo'], function (result) {
        var filter = new Filter(result.filtersAreActive, result.hideUnShowed, result.startTimeFrom, result.startTimeTo);
        movies.forEach(function (movie) {
            if (movie.shouldBeDisplayed(filter)) {
                movie.DOMElement.style.display = 'block';
            } else {
                movie.DOMElement.style.display = 'none';
            }
        });

    });
}

/**
 * Plugin update listener
 */
chrome.runtime.onMessage.addListener(
    function (request) {
        if (request.reload) {
            run(movies);
        }
    }
);

var movies = getMovies();
run(movies);
