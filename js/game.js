export default function createGame(){
    const state = {
        status : 'stop',
        players: {},
        cars: {},
        screen: {
            width: 900,
            height: 700
        }
    }

    const observers = []

    function start(){
        if(state.status !== 'stop') return
            state.status = 'start'
            const positions = {
                left : [160,205,250,295],
                right : [380,425,470,510]
            }
            let carId = 1
            for (const position in positions) {
                let key = position
                positions[key].forEach(pos => {
                    createCar({ playerId: carId, y: pos, side: key})
                    carId++
                });
                
            };
    }
    function subscribe(observerFunction) {
        observers.push(observerFunction)
    }
    function notifyAll(command) {
        for (const observerFunction of observers) {
            observerFunction(command)
        }
    }
    function setState(newState) {
        Object.assign(state, newState)
    }
    function addPlayer(callback) {
        const playerId = Math.floor(Math.random() * 10)
        const playerX =  Math.floor(Math.random() * state.screen.width)
        const playerY =  state.screen.height - 50 
        callback(playerId)
        state.players[playerId] = {
            x: playerX,
            y: playerY
        }

        notifyAll({
            type: 'add-player',
            playerId: playerId,
            playerX: playerX,
            playerY: playerY
        })
    }
    function removePlayer(playerId) {        
        if(state.players[playerId]){
            delete state.players[playerId]

            notifyAll({
                type: 'remove-player',
                playerId: playerId
            })
       }
    }
    function loosePlayer(playerId){

        removePlayer(playerId)
        notifyAll({
            type: 'loose-player',
            playerId: playerId
        })
    }
    function movePlayer(command) {
        notifyAll(command)

        const acceptedMoves = {
            ArrowUp(player) {
                if (player.y - 1 >= 0) {
                    player.y = player.y - 5
                }
            },
            ArrowRight(player) {
                if (player.x + 1 < state.screen.width) {
                    player.x = player.x + 5
                }
            },
            ArrowDown(player) {
                if (player.y + 1 < state.screen.height) {
                    player.y = player.y + 5
                }
            },
            ArrowLeft(player) {
                if (player.x - 1 >= 0) {
                    player.x = player.x - 5
                }
            }
        }

        const keyPressed = command.keyPressed
        const playerId = command.playerId
        const player = state.players[playerId]
        const moveFunction = acceptedMoves[keyPressed]

        if (player && moveFunction) {
            moveFunction(player)
           //checkForFruitCollisionPlayer(playerId)
        }

    }
    function createCar(command){
        const playerId = command.playerId
        state.cars[playerId] = {
            x: command.x,
            y: command.y,
            side: command.side
        }
        
        moveCar(playerId,command,()=>{
           createCar(command)
        })
        
    }
    function moveCar(interval,command,callback){

        let position = (command.side === 'right') ? state.screen.width : 0
        let limite = (command.side === 'right') ? 0 : state.screen.width

        const sideCarr = {
            left: () =>{
                    if(position >= limite) {
                        clearInterval(interval)
                        callback(command)
                    }
                    state.cars[command.playerId] = {
                        x: position,
                        y: state.cars[command.playerId].y,
                        side: state.cars[command.playerId].side
                    }
                    checkForFruitCollision(command.playerId)
                    position = position+4
            },
            right: ()=>{
                    if(position <= limite) {
                        clearInterval(interval)
                        callback(command)
                    }
                    state.cars[command.playerId] = {
                        x: position,
                        y: state.cars[command.playerId].y,
                        side: state.cars[command.playerId].side
                    } 
                    checkForFruitCollision(command.playerId)
                    position = position - 4
            }
        }

        interval = setInterval(function(){
           sideCarr[command.side]()
        }, getRandomIntInclusive(8, 18) )

    }
    function checkForFruitCollision(carId) {
        const car = state.cars[carId]
        for (let playerId in state.players) {
            const player = state.players[playerId]
            const PlayerX = player.x+50
            const PlayerY = player.y+25
            
            const CarX = car.x+40
            const CarY = car.y+30

            
            if(CarY >= player.y && car.y <= PlayerY && car.x >=  player.x && CarX <= PlayerX){

                
                loosePlayer(playerId)
                setState({status: 'loose'})
            }
            
        }
    }
    function getRandomIntInclusive(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
      }
    return {
        addPlayer,
        removePlayer,
        loosePlayer,
        movePlayer,
        start,
        createCar,
        setState,
        subscribe,
        state
        
    }
}