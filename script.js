/* 
factory function
- player

*/

function newPlayer(name, number, marker, gameMode, score) {
    let _playerData = [name, number, marker, gameMode, score];
    const getName = () => _playerData[0];
    const getNumber = () => _playerData[1];
    const getMarker = () => _playerData[2];
    const getgameMode = () => _playerData[3];
    const getScore = () => _playerData[4];
    const setName = (name) => _playerData[0] = name;
    const setgameMode = (gameMode) => _playerData[3] = gameMode;
    const addScore = () => _playerData[4]++;
    const resetScore = () => _playerData[4] = 0;
   
    return { getName, getNumber, getMarker, getgameMode, getScore, setName, setgameMode, addScore, resetScore };
}

let gameBoard = (function() {
    let myGameBoard = {};
    let _state = [
        [0,0,0],
        [0,0,0],
        [0,0,0]
    ];
    myGameBoard.getState = (row, col) => {
        return _state[row][col];
    };
    myGameBoard.setState = (val, row, col) => {
        _state[row][col] = val;
        return val;
    }
    myGameBoard.getNumRows = () => _state.length;
    myGameBoard.getNumCols = () => _state[0].length;
    myGameBoard.resetBoard = () => {
        for (let row = 0; row < gameBoard.getNumRows(); row++) {
            for (let col = 0; col < gameBoard.getNumCols(); col++) {
                myGameBoard.setState(0, row, col);
            }
        }
    }
    myGameBoard.isGameOver = () => {
        let threeinARow = false;
        
        // check all rows
        threeinARow += _state.some(row => row.every((val, i, arr) => val != 0 && val === arr[0]));
        
        // check all columns
        threeinARow += _state[0].some((val, i) => val != 0 && val === _state[1][i] && val === _state[2][i]);

        // check both diags
        threeinARow += (_state[0][0] != 0 && 
            _state[0][0] === _state[1][1] && 
            _state[1][1] === _state[2][2]) || 
            (_state[0][2] != 0 && 
            _state[0][2] === _state[1][1] && 
            _state[1][1] === _state[2][0]);

        return threeinARow;

    }
    return myGameBoard;
    
})();

let displayController = (function() {
    
    const _p1name = document.querySelector('#p1name');
    const _p2name = document.querySelector('#p2name');
    const _p1score = document.querySelector('#p1score');
    const _p2score = document.querySelector('#p2score');
    const _p1marker = document.querySelector('#p1marker');
    const _p2marker = document.querySelector('#p2marker');

    function updateGameBoard() {
        for (let row = 0; row < gameBoard.getNumRows(); row++) {
            for (let col = 0; col < gameBoard.getNumCols(); col++) {
                const sqNode = document.querySelector(`#sq${row}${col}`);
                const sqVal = gameBoard.getState(row, col);

                sqNode.classList.remove('X', 'O');
                sqNode.textContent = '';
                
                if (sqVal) {
                    sqNode.textContent = sqVal;
                    sqNode.classList.add(sqVal);
                }
            }
        }
    }
    function updateGameDisplay() {
        // Update player score cards
        _p1name.textContent = gameController.player1.getName();
        _p2name.textContent = gameController.player2.getName();
        _p1score.textContent = gameController.player1.getScore();
        _p2score.textContent = gameController.player2.getScore();
        _p1marker.textContent = gameController.player1.getMarker();
        _p2marker.textContent = gameController.player2.getMarker();

        // Update current active player scorecard
        
        const activePlayerDiv = document.querySelector(`div.${gameController.getActivePlayer().getNumber()}`);
        const inactivePlayerDiv = document.querySelector(`div.${gameController.getActivePlayer().getNumber() == 'p1' ? 'p2' : 'p1'}`);
        activePlayerDiv.classList.add('activeP');
        inactivePlayerDiv.classList.remove('activeP');
    }
    function closeAllDisplays() {
        document.querySelectorAll('.display').forEach(dispItem => dispItem.style.display = 'none');
    }
    function openDisplay(dispItem) {
        document.querySelector(`.display.${dispItem}`).style.display = 'flex';
    }
    return { updateGameBoard, updateGameDisplay, closeAllDisplays, openDisplay };
})();

let gameController = (function() {
    
    let player1 = newPlayer('', 'p1', 'X', '', 0);
    let player2 = newPlayer('', 'p2', 'O', '', 0);
    let currActivePlayer = player1;
    let _prevMenu = [];

    document.querySelectorAll('.menuSelect').forEach(select => select.addEventListener('click', menuHandler));

    document.querySelectorAll('.square').forEach(square => square.addEventListener('click', sqHandler));

    function menuHandler(event) {
        let _currMenu = event.target.name;
        let _nextMenu = event.target.value;
        
        switch(_nextMenu) {
            case 'back':
                _nextMenu = _prevMenu.pop();
                break;
            case 'human':
                _prevMenu.push(_currMenu);
                player1.setgameMode('human');
                player2.setgameMode('human');
                break;
            case 'ai':
                _prevMenu.push(_currMenu);
                player1.setgameMode('ai');
                player2.setName('HAL 9000');
                player2.setgameMode('ai');
                break;
            case 'play':
                _prevMenu.push(_currMenu);
                player1.setName(document.querySelector(`#p1${player1.getgameMode()}`).value || 'Player 1');
                if (player2.getgameMode() === 'human')
                    player2.setName(document.querySelector('#p2human').value || 'Player 2');
                player1.resetScore();
                player2.resetScore();
                resetGame();
                break;
            case 'resetScore':
                player1.resetScore();
                player2.resetScore();
                resetGame();
                _nextMenu = 'play';
                break;
            case 'restartGame':
                resetGame();
                _nextMenu = 'play';
                break;
        }

        displayController.closeAllDisplays();
        displayController.openDisplay(_nextMenu);

    }

    function resetGame() {
        currActivePlayer = player1;
        gameBoard.resetBoard();
        displayController.updateGameBoard();
        displayController.updateGameDisplay();
    }

    function switchActivePlayer() {
        switch(currActivePlayer.getNumber()) {
            case 'p1':
                currActivePlayer = player2;
                break;
            case 'p2':
                currActivePlayer = player1;
                break;
        }
    }

    function getActivePlayer() {
        return currActivePlayer;
    }

    function sqHandler(event) {
        if (event.target.classList.contains('X') || event.target.classList.contains('O')) {
            return; // prevent square from changing once it's been selected
        }

        gameBoard.setState(currActivePlayer.getMarker(), event.target.id[2], event.target.id[3]);
        displayController.updateGameBoard();

        if (gameBoard.isGameOver()) {
            console.log('Game Over!');

            // increment score for winning player
            currActivePlayer.addScore();
            
            // display end game modal

            // Display button for next round (resetGame handler)
            
        } else {
            switchActivePlayer();
        }
        
        displayController.updateGameDisplay();

    }
    return { player1, player2, getActivePlayer, switchActivePlayer };
})();


