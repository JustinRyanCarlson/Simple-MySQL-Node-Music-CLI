var mysql = require("mysql");
var inquirer = require('inquirer');


var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "top_songsDB"
});


connection.connect(function(err) {
    if (err) throw err;
});

run();

function run() {
    inquirer.prompt([{
        type: 'list',
        name: 'argument',
        message: 'What would you like to do?',
        choices: ['All songs by an artist', 'All artists with more than one top 5000 song', 'All songs within a year constraint', 'Song data search']
    }]).then(function(answers) {
        if (answers.argument === 'All songs by an artist') {
            allArtistSongs();
        } else if (answers.argument === 'All artists with more than one top 5000 song') {
            artistsMoreThanOneTopSong();
        } else if (answers.argument === 'All songs within a year constraint') {
            songConstraint();
        } else {
            songSearch();
        }
    });
}


function allArtistSongs() {
    inquirer.prompt([{
        name: 'searchterm',
        message: 'Enter a artist'
    }]).then(function(answers) {
        connection.query("SELECT song FROM top5000 WHERE artist=?", [answers.searchterm], function(err, res) {
            for (var i = 0; i < res.length; i++) {
                console.log(res[i].song);
            }
            console.log('');
            run();
        });
    });
}


function artistsMoreThanOneTopSong() {
    connection.query("SELECT artist, COUNT(*) c FROM top5000 GROUP BY artist HAVING c > 1", function(err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].artist);
        }
        console.log('');
        run();
    });
}


function songConstraint() {
    var startYear;
    var endYear;

    inquirer.prompt([{
        name: 'startingYear',
        message: 'Please enter a starting year'
    }]).then(function(answers) {
        startYear = answers.startingYear;

        inquirer.prompt([{
            name: 'endingYear',
            message: 'Please enter a ending year'
        }]).then(function(answers) {
            endYear = answers.endingYear;

            connection.query("SELECT song FROM top5000 WHERE year>? and year<?", [startYear, endYear], function(err, res) {
                for (var i = 0; i < res.length; i++) {
                    console.log(res[i].song);
                }
                console.log('');
                run();
            });
        });
    });
}

function songSearch() {
    inquirer.prompt([{
        name: 'searchTermSong',
        message: 'Enter a song to search'
    }]).then(function(answers) {
        connection.query("SELECT * FROM top5000 WHERE song=?", [answers.searchTermSong], function(err, res) {
            console.log('Position: ' + res[0].position);
            console.log('Artist: ' + res[0].artist);
            console.log('Song: ' + res[0].song);
            console.log('Year: ' + res[0].year);
            console.log('Raw Total: ' + res[0].raw_total);
            console.log('Raw US: ' + res[0].raw_usa);
            console.log('Raw UK: ' + res[0].raw_uk);
            console.log('Raw EU: ' + res[0].raw_eur);
            console.log('Raw Row: ' + res[0].raw_row);
            console.log('');
            run();
        });
    });
}
