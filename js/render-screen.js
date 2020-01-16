export default function renderScreen(screen,game,requestAnimationFrame){

    var context = screen.getContext("2d");
    let w = screen.width
    let h = screen.height
    let sidewalk = 150
    let ground = h - (sidewalk * 2 )
    let totalLines = w / 20


    context.fillStyle = "dimgray";
    context.fillRect(0, 0, w, h);

    context.fillStyle = "lightgray";
    context.fillRect(0, 0, w, sidewalk);

    context.fillStyle = "lightgray";
    context.fillRect(0, h - sidewalk , w, sidewalk);

    context.fillStyle = "white";
    for(var i = 0; i < totalLines; i++){
        context.fillRect(i*30-5, (ground / 2) + sidewalk , 20, 4);
    }

    function createCar(car){
                car.width = 30
                car.height = 30
                car.y = (! car.y) ? 50 :  car.y
                car.x = (!car.x) ? 0 : car.x

                context.fillStyle = "#A52A2A";
                context.fillRect(car.x,car.y, car.width, car.height);
            
    }
    for (const carId in game.state.cars) {
        const car = game.state.cars[carId]
        createCar(car)
    }

    for (const playerId in game.state.players) {
        const player = game.state.players[playerId]
        context.fillStyle = "#000";
        context.fillRect(player.x,player.y, 25, 25);
    }

    if(game.state.status === 'loose'){
        alert('Você perdeu, click em iniciar pra tentar novamente')
        game.state.status = 'default'
    }

    
    requestAnimationFrame(() => {
        renderScreen(screen, game, requestAnimationFrame)
    })
}