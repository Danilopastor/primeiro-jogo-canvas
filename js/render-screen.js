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

    const side = {
        initialize : (car) => {
                car.width = 30
                car.height = 30
                car.y = (! car.y) ? 50 :  car.y
                
                return car
        },
        left : (car) => {       
                car =  side.initialize(car)
                car.x = (!car.x) ? 0 : car.x

                context.fillStyle = "#00000069";
                context.fillRect(car.x-9,car.y-1, car.width+23, car.height+8);
            
                context.fillStyle = "black";
                context.fillRect(car.x+car.width-1,car.y-2, car.width-20, car.height-20);
                context.fillRect(car.x+car.width-1,car.y+car.height-7, car.width-20, car.height-20);
                context.fillRect(car.x-3,car.y+car.height-7, car.width-20, car.height-20);
                context.fillRect(car.x-3,car.y-2, car.width-20, car.height-20);
            
                context.fillStyle = "#A52A2A";
                context.fillRect(car.x,car.y, car.width, car.height);
                context.fillStyle = "#8B1A1A";
                context.fillRect(car.x-8,car.y+1, car.width-20, car.height-1);
                context.fillStyle = "#8B1A1A";
                context.fillRect(car.x+car.width-5,car.y+1, car.width-10, car.height-1);
        },
        right : (car) => {
                car =  side.initialize(car) 
                car.x = (!car.x) ? (w - car.width)  : car.x

                context.fillStyle = "#00000069";
                context.fillRect(car.x-9,car.y-1, car.width+23, car.height+8);
            
                context.fillStyle = "black";
                context.fillRect(car.x+car.width-1,car.y-2, car.width-20, car.height-20);
                context.fillRect(car.x+car.width-1,car.y+car.height-7, car.width-20, car.height-20);
                context.fillRect(car.x-3,car.y+car.height-7, car.width-20, car.height-20);
                context.fillRect(car.x-3,car.y-2, car.width-20, car.height-20);
            
                context.fillStyle = "#A52A2A";
                context.fillRect(car.x,car.y, car.width, car.height);
                context.fillStyle = "#8B1A1A";
                context.fillRect(car.x + car.width,car.y, car.width-20, car.height-1);
                context.fillStyle = "#8B1A1A";
                context.fillRect(car.x - 10,car.y+1, car.width-10, car.height-1);
        }
    }

    for (const carId in game.state.cars) {
        const car = game.state.cars[carId]
        const create = side[car.side]
        if(create){
            create(car)
        }
    }

    for (const playerId in game.state.players) {
        const player = game.state.players[playerId]
        context.fillStyle = "#000";
        context.fillRect(player.x,player.y, 25, 25);
    }

    if(game.state.status === 'perdeu'){
        alert('Você perdeu, click em iniciar pra tentar novamente')
        game.state.status = 'default'
    }
    requestAnimationFrame(() => {
        renderScreen(screen, game, requestAnimationFrame)
    })
}