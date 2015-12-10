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
 * Class Time
 */
function Time(timeElement) {
    var getTime = function (timeElement) {
        var time = timeElement.getAttribute('data-times');
        var regex = /(\[)"(\d{2}:\d{2})(.*)/;
        var m;

        if ((m = regex.exec(time)) !== null) {
            if (m.index === regex.lastIndex) {
                regex.lastIndex++;
            }
        }
        return m[2];
    };

    this.dateTime = getTime(timeElement);
    this.isActive = function (timeElement) {
        return !timeElement.classList.contains('btn-disabled');
    };
}

/**
 * Class Movie
 */
function Movie(DOMElement) {
    var getTimesElements = function (DOMElement) {
        var pan = DOMElement.getElementsByClassName("pane");
        var index;

        for (var i = 0; i < pan.length; i++) {
            if (!pan[i].classList.contains('hide')) {
                index = i;
            }
        }

        return pan[index].getElementsByTagName("em");
    };

    var getTimes = function (DOMElement) {
        if (typeof DOMElement.querySelector(".showtimescore .last") !== 'undefined' && DOMElement.querySelector(".showtimescore .last").textContent == "Aucune séance pour l'horaire sélectionné ") {
            return null;
        }
        var times = [];
        var timesElement = getTimesElements(DOMElement);
        for (var i = 0; i < timesElement.length; i++) {
            var time = new Time(timesElement[i]);
            times.push(time);
        }
        return times;
    };

    var testIfIsShowedToday = function (timesArray) {
        for (var i = 0; i < timesArray.length; i++) {
            if (timesArray[i].isActive) {
                return true;
            }
        }
        return false;
    };

    this.DOMElement = DOMElement;
    this.timesArray = getTimes(DOMElement);
    this.isShowedToday = testIfIsShowedToday(this.timesArray);
}

Movie.prototype.shouldBeDisplayed = function (filter) {
    var from, to;

    if (!filter.isActive) {
        return true;
    }

    if (filter.hideUnShowed && !this.isShowedToday) {
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
    //}

    if (from !== '' || to !== '') {
        if (!this.isShowedToday) {
            return true;
        }
        if (from === '') {
            from = '00:00';
        }
        if (to === '') {
            to = '23:59';
        }
        for (var i = 0; i < this.timesArray.length; i++) {
            if (this.timesArray[i].dateTime >= from && this.timesArray[i].dateTime <= to) {
                return true;
            }
        }
        return false;
    }

    return true;
};

/**
 * Function getMovies
 * return an array of movies
 */
function getMovies() {
    var moviesElement = document.querySelector('.colgeneral').querySelectorAll(".datablock");
    var movies = [];
    for (var i = 0; i < moviesElement.length; i++) {
        movies.push(new Movie(moviesElement[i]));
    }
    return movies;
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
