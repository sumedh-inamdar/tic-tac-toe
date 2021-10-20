/* 
factory function
- player

*/

function newPlayer(name, marker, gameMode, score) {
    let _playerData = [name, marker, gameMode, score];
    const getName = () => _playerData[0];
    const getMarker = () => _playerData[1];
    const getgameMode = () => _playerData[2];
    const getScore = () => _playerData[3];
    const setName = (name) => _playerData[0] = name;
    const setMarker = (marker) => _playerData[1] = marker;
    const setgameMode = (gameMode) => _playerData[2] = gameMode;
    const addScore = () => _playerData[3]++;
    const resetScore = () => _playerData[3] = 0;
   
    return { getName, getMarker, getgameMode, getScore, setName, setMarker, setgameMode, addScore, resetScore };
}

let gameBoard = (function() {
    let myGameBoard = {};
    let _state = [
        ['x',0,'o'],
        [0,'x',0],
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

    return myGameBoard;
    
})();

let displayController = (function() {
    document.querySelectorAll('.square').forEach(square => square.addEventListener('click', sqHandler));

    function sqHandler(event) {
        console.log(`${event.target.id} clicked!`)

    }
    function updateDisplay() {
        for (let row = 0; row < gameBoard.getNumRows(); row++) {
            for (let col = 0; col < gameBoard.getNumCols(); col++) {
                const sqVal = gameBoard.getState(row, col);
                if (sqVal) {
                    const sqNode = document.querySelector(`#sq${row}${col}`);
                    sqNode.textContent = sqVal.toUpperCase();
                    sqNode.classList.add(sqVal);
                }
                
            }
        }
    }
    function closeAllDisplays() {
        document.querySelectorAll('.display').forEach(dispItem => dispItem.style.display = 'none');
    }
    function openDisplay(dispItem) {
        document.querySelector(`.display.${dispItem}`).style.display = 'flex';
    }
    return { updateDisplay, closeAllDisplays, openDisplay };
})();

let gameController = (function() {
    
    let player1 = newPlayer('', 'X', '', 0);
    let player2 = newPlayer('', 'O', '', 0);
    let _prevMenu = [];

    document.querySelectorAll('.menuSelect').forEach(select => select.addEventListener('click', menuHandler));

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
                    player2.setName(document.querySelector('#p1human').value || 'Player 2');

                player1.resetScore();
                player2.resetScore();
                break;
        }

        displayController.closeAllDisplays();
        displayController.openDisplay(_nextMenu);

    }

    return { player1, player2 };
})();
// displayController.updateDisplay();

