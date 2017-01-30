var codes = {
        'drink': 'dr1nk',
        'dare': 'ch1ps',
        'move': 'sn4cks',
        'truth': 'truthdr1nk'
    },
    challengeDB = {
        'drink': ['Everybody with short hair drinks', 'Skip Drinks for One Round', 'Full glass on the table drinks double', 'All Women Drink', 'Buys next Drinking Chips'],
        'dare': ['Tell an embarrassing story', 'Choose someone from the opposite sex to drink', 'What was your worst day drunk?', 'Whistle for 2 minutes', 'Tell a joke'],
        'move': ['Stand up and go around your friends 2 times', 'Shake your head for 30 seconds', 'Your friends should dare you right now!', 'Refill', 'Teach your friends your favorite dance'],
        'truth': ['Did you think about the hangover you’ll have tomorrow?', 'If you’re still playing, then you must go for more Drinking Chips and Drinks', 'Refill all the shots/glasses/cup', 'There is no ugly couple, but few alcohol', 'Still can read what is written here?']
    },
    currentChallenge = 'drink';
challenges = challengeDB.drink,
    players = ['Player'];

$(document).ready(function () {
    $('.challenges').click(function () {
        Challenges(function (challengeType) {
            var approvedCode = codes[challengeType];
            currentChallenge = challengeType;
            if (challengeType !== 'drink') {
                CodeInput(approvedCode, function (isValid) {
                    if (isValid) {
                        challenges = challengeDB[currentChallenge]
                    }
                    UserRegistration(function (data) {
                        players = data;
                        PlayGame(players, challenges);
                    });
                });
            } else {
                UserRegistration(function (data) {
                    players = data;
                    PlayGame(players, challenges);
                });
            }
        });
    });
    $('.addPlayers').click(function () {
        UserRegistration(function (data) {
            players = data;
            PlayGame(players, challenges);
        });
    });
    $('.playGame').click(function () {
        PlayGame(players, challenges);
    });
});

//Returns challenge type
function Challenges(callback) {
    var template = $(
        '<p>Select a Challenge:</p>' +
        '<div class="drink-btn">' +
        '    <a id="drink" href="#"><img src="http://drinkingchips.com/img/1drink.png" height="48px"></a>' +
        '</div>' +
        '<div class="dare-btn">' +
        '    <a id="dare" href="#"><img src="http://drinkingchips.com/img/2dareblock.png" height="48px"></a>' +
        '</div>' +
        '<div class="move-btn">' +
        '    <a id="move" href="#"><img src="http://drinkingchips.com/img/3moveblock.png" height="48px"></a>' +
        '</div>' +
        '<div class="truth-btn">' +
        '    <a id="truth" href="#"><img src="http://drinkingchips.com/img/4truthblock.png" height="48px"></a>' +
        '</div>');

    //Clear #targetDiv and then add template
    $('#targetDiv').html('');
    $('#targetDiv').append(template);
    //Call callback when any challenge type is selected
    $('#drink').click(function () {
        callback('drink');
    });
    $('#dare').click(function () {
        callback('dare');
    });
    $('#move').click(function () {
        callback('move');
    });
    $('#truth').click(function () {
        callback('truth');
    });
}

//Returns true when code is valid
function CodeInput(approvedCode, callback) {
    var approved = false,
        template =
        '<p>Enter the Code under the lid of your New Package:</p>' +
        '<p class="incorrectCode">**Incorrect Code**</p>' +
        ' <input class="inputStyle codeInput" type="text" name="code" placeholder="Enter Code" required>' +
        '<div class="btn submitCode">' +
        '<a id="addCode" href="#">Submit</a>' +
        '</div>';

    //Clear #targetDiv and then add template
    $('#targetDiv').html('');
    $('#targetDiv').append(template);
    //Error message is hidden by default
    $('.incorrectCode').hide();
    //Call checkCode function when submit button is pressed
    $('.submitCode').click(checkCode);

    function checkCode() {
        if ($('.codeInput').val() === approvedCode) {
            approved = true;
        }
        if (approved) {
            callback(true);
        } else {
            //Reset input value and show error message
            $('.incorrectCode').show();
        }
    }
}

//Returns players array
function UserRegistration(callback) {
    var players = [],
        //You can make a dom element in js by putting it inside jQuery's $() function
        template = $(
            '<div class="btn code-btn">' +
            '    <a class="addUser" href="#">Add</a>' +
            '</div>' +
            '<div class="btn play-btn">' +
            '    <a class="submitUser" href="#">Play</a>' +
            '</div>'
        ),
        userElement = $(
            '<input class="inputStyle userText" type="text" name="players" placeholder="New Player" required>'
        );

    //The append method is used to insert a previously created element to the dom
    //Clear #targetDiv and then add template
    $('#targetDiv').html('');
    $('#targetDiv').append(template);
    $('#targetDiv').prepend(userElement.clone());
    //Add user input box
    $('.addUser').click(function () {
        $('#targetDiv').prepend(userElement.clone());
    });
    //Add all users to array
    $('.submitUser').click(submitUsers);

    /* This function takes each user and adds it to the players array.
       The length of the players array and the array that contains all the .userText
       divs are compared to see if they're equal to see if all users have been added
       to the players array.
       When all users are added the callback function is called.
    */
    function submitUsers() {
        //This function loops through all the .userText divs
        $('.userText').each(function (index) {
            players[index] = $(this).val();
            if (players.length === $('.userText').length) {
                //Call function that was passed with the UserRegistration function
                callback(players);
            }
        });
    }
}

//Doesn't return anything
function PlayGame(players, challenges, callback) {
    var current = 0,
        template = $(
            '<p class="timeCounter"></p>' +
            '<p class="currentPlayer"></p>' +
            '<p class="currentChallenge"></p>' +
            '<img class="showChallenge" src="http://drinkingchips.com/img/game.png">'
        );

    //Clear #targetDiv and then add template
    $('#targetDiv').html('');
    $('#targetDiv').append(template);
    //Call checkCode function when submit button is pressed
    $('.nextChallenge').click(nextChallenge);
    $('.showChallenge').click(displayChallenge);
    //Initialize game
    nextChallenge();
    $('#targetDiv p').hide();
    $('.showChallenge').show();

    function displayChallenge() {
        $('.showChallenge').fadeOut();
        var countdown = 30,
            interval = setInterval(function () {
                $('.timeCounter').html(countdown + ' seconds left');
                if (countdown === 0) {
                    nextChallenge();
                    clearInterval(interval);
                }
                if (countdown === 30) {
                    //Hide image and show text and btn
                    $('#targetDiv p').fadeIn();
                }
                countdown--;
            }, 1000);
    }

    function nextChallenge() {
        $('.currentChallenge').html(getRandomChallenge());
        $('.currentPlayer').html(players[current] + '\'s turn');
        //Hide Text and btn and show image
        $('#targetDiv p').hide();
        $('.showChallenge').fadeIn();
        if (current < (players.length - 1)) {
            current = current + 1;
        } else {
            current = 0;
        }
    }

    function getRandomChallenge() {
        return challenges[getRandomInt(challenges.length)];
    }

    function getRandomInt(max) {
        return Math.floor(Math.random() * (max + 1));
    }
}