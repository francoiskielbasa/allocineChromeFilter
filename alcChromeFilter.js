/**
 * Created by francois on 27/10/15.
 */
function getTitle(movieElement) {
    return movieElement.querySelector('.titlebar').textContent.trim();
}

function getTimes(movieElement) {
    if (typeof movieElement.querySelector(".showtimescore .last") !== 'undefined' && movieElement.querySelector(".showtimescore .last").textContent == "Aucune séance pour l'horaire sélectionné ") {
        return null;
    }
    var times = [];
    var timesElement = getTimesElements(movieElement);
    for (var i = 0; i < timesElement.length; i++) {
        var time = {datetime: getTime(timesElement[i]), isActive: isActive(timesElement[i])};
        times.push(time);
    }
    return times;
}

function getTime(timesElement) {
    time = timesElement.getAttribute('data-times');
    var regex = /(\[)"(\d{2}:\d{2})(.*)/;
    var m;

    if ((m = regex.exec(time)) !== null) {
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }
    }
    return m[2];
}

function isActive(timesElement) {
    if (timesElement.classList.contains('btn-disabled')) {
        return false;
    }

    return !timesElement.classList.contains('btn-disabled');
}

function getMovies() {
    var moviesElement = document.querySelector('.colgeneral').querySelectorAll(".datablock");
    var movies = [];
    for (var i = 0; i < moviesElement.length; i++) {
        var movie = {element: moviesElement[i], title: getTitle(moviesElement[i]), time: getTimes(moviesElement[i])};
        movies.push(movie);
    }
    return movies;
}

function getTimesElements(movieElement) {
    var pan = movieElement.getElementsByClassName("pane");
    var index;

    for (var i = 0; i < pan.length; i++) {
        if (!pan[i].classList.contains('hide')) {
            index = i;
        }
    }

    return pan[index].getElementsByTagName("em");
}

function isDisplaying(movie, value) {
    if (movie.time === null) {
        return false;
    }
    for (var i = 0; i < movie.time.length; i++) {
        //if (Date.parse('01/01/2001 ' + movie.time[i].datetime) > Date.parse('01/01/2001 ' + value) && movie.time[i].isActive) {
        if (movie.time[i].isActive) {
            return true;
        }
    }
    return false;

}

function displayNone(movies, date) {
    movies.forEach(function (movie) {
        if (!isDisplaying(movie, date)) {
            movie.element.style.display = 'none';
        }
    });
}

function displayAll(movies) {
    movies.forEach(function (movie) {
        movie.element.style.display = 'block';
    })
}


var date = '22:00';
var movies = getMovies();
var hide;
chrome.storage.local.get('hide', function (result) {
    hide = result.hide;
});
displayNone(movies, date);
/*
 if (hide) {
 displayNone(movies, date);
 }
 */












