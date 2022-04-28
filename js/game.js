let playerTurn = 1;
let victoryPlayer = 0;
let isGameStarted = false;
let isGameEnded = false;
let moves = [];
let winArray = [];
let p1Array = [];
let p2Array = [];
let imgSource = '';
let audioSource = '';
let timer;
let victoryGif = './img/victory.gif';
let victoryConditions = [ [ 1, 2, 3 ], [ 1, 4, 7 ], [ 1, 5, 9 ],
    [ 2, 5, 8 ], [ 3, 5, 7 ], [ 3, 6, 9 ], [ 4, 5, 6 ], [ 7, 8, 9 ] ];


function buttonListeners()
{
    $('#start').one('click', function () {
        tictac();
        fieldListeners();
    });

    $('#reset').click(function () {
        location.reload();
    });
}

function fieldListeners()
{
    if(isGameStarted) {
        $('#game-holder > div').click(function () {
            var clickedId = $(this).attr('id');

            checkClickedField(clickedId);

            if (playerTurn < 2) {
                playerTurn = 2;
            } else {
                playerTurn = 1;
            }

            if(!isGameEnded) {
                $('#info-box-text').text('Player - ' + playerTurn + ' turn!');
            }
        });
    }
}

function checkClickedField(clickedId)
{
    var clickedElement = '#'+clickedId;
    var isImgLoaded = parseInt($(clickedElement).find('img').length);

    if(!isGameEnded) {
        if (isImgLoaded) {
            alert('Click another box, this one is already taken !');
            return;
        }
        var position = parseInt($(''+clickedElement+'').data('position'));

        if (playerTurn > 1) {
            moves.push({[position]:2});
            imgSource = './img/x.png';
            audioSource = './audio/p1.mp3';
        }else{
            moves.push({[position]:1});
            imgSource = './img/o.png';
            audioSource = './audio/p2.mp3';
        }

        $(clickedElement).find('span').after('<img src="' + imgSource + '" alt="x-mark" class="x-mark">');
        $(clickedElement).animate({'opacity': 0.2}, 200).delay(50).animate({'opacity': 1}, 200)
        $(clickedElement).css('background-color','#F0E4E2');
        const audio = new Audio(audioSource);
        audio.play();

        checkVictoryConditions();

        return;
    }
}

function checkVictoryConditions()
{
    var p1match = 0,p2match = 0;
    $.each(victoryConditions, function (vkey,set){
        $.each(set, function (key,winPos) {
            $.each(moves, function (key,positionSet) {
                $.each(positionSet, function (position,val) {
                    if (winPos == position) {
                        if (val === 1) {
                            p1match++;
                            p1Array.push(position);
                        } else {
                            p2match++;
                            p2Array.push(position);
                        }
                    }

                    if (p1match > 2 || p2match > 2) {
                        isGameEnded = true;
                        endGame();
                        return;
                    }
                });
            });
        });
        p1match = 0;
        p2match = 0;
    });
    if(moves.length > 8){
        isGameEnded = true;
        victoryPlayer = 0;
        endGame('no winner, try again');
    }
}

function endGame(message = '')
{
    if(message.length === 0) {
        if (playerTurn < 2) {
            winArray = p1Array.slice(-3);
        } else {
            winArray = p2Array.slice(-3);
        }

        $.each(winArray, function (key, position) {
            $('div').find(`[data-position=\'${position}\']`).css('background-color', '#90E886');
        });
        $('#victory-gif').attr('src',victoryGif).animate({'opacity': 0.8}, 200).delay(50).animate({'opacity': 1}, 500).delay(700).fadeOut("slow");
    }

    if (isGameEnded) {
        clearInterval(timer);
        victoryPlayer = playerTurn;
        $('#game-holder > div').unbind();

        if(message){
            $('#info-box-text').text(message);
            return;
        }

        $('#info-box-text').text("Player " + victoryPlayer + " VICTORY !!!");
    }
}

function tictac(){
    var seconds = 0;
    var mins = 0;
    isGameStarted = true;
    timer = window.setInterval(function () {
        seconds++;
        if (seconds > 59) {
            seconds = 0;
            mins++;
        }
        if (seconds < 10) {
            $("#time").text('time: ' + mins + ':0' + seconds + ' sec.');
        } else {
            $("#time").text('time: ' + mins + ':' + seconds + ' sec.');
        }
    }, 1000);
}