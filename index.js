const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

const collisionsMap = []
for(let i = 0; i < collisions.length; i+= 70){
    collisionsMap.push(collisions.slice(i,70+i))
}

const battleZonesMap = []
for(let i = 0; i < battleZonesData.length; i+= 70){
    battleZonesMap.push(battleZonesData.slice(i,70+i))
}


const boundaries = []
const offset={
    x: -735,
    y: -650
}

collisionsMap.forEach((row,i) => {
    row.forEach((symbol, j) => {
        if(symbol === 1025){
            boundaries.push(
                new Boundary({
                    position: {
                        x: j * Boundary.width + offset.x,
                        y: i * Boundary.height + offset.y
                    }
                })
            )
        }
    })
})

const battleZones= []
battleZonesMap.forEach((row,i) => {
    row.forEach((symbol, j) => {
        if(symbol === 1025){
            battleZones.push(
                new Boundary({
                    position: {
                        x: j * Boundary.width + offset.x,
                        y: i * Boundary.height + offset.y
                    }
                })
            )
        }
    })
})

const backgroundImage = new Image()
backgroundImage.src='./img/PelletTown.png'

const playerDownImage = new Image()
playerDownImage.src='./img/playerDown.png'

const playerUpImage = new Image()
playerUpImage.src='./img/playerUp.png'

const playerLeftImage = new Image()
playerLeftImage.src='./img/playerLEft.png'

const playerRightImage = new Image()
playerRightImage.src='./img/playerRight.png'


const foregroundImage = new Image()
foregroundImage.src='./img/foregroundObjects.png'


const player = new Sprite({
    position: {
        x: canvas.width / 2 - 192 / 4 / 2,
        y: canvas.height / 2 - 68 / 2
    },
    image: playerDownImage,
    frames: {
        max: 4
    },
    sprites: {
        up: playerUpImage,
        down: playerDownImage,
        left: playerLeftImage,
        right: playerRightImage
    }
})

const background = new Sprite({
    position: {
        x: offset.x,
        y: offset.y
    },
    image: backgroundImage
})
const foreground = new Sprite({
    position: {
        x: offset.x,
        y: offset.y
    },
    image: foregroundImage
})

const keys = {
    w: {
        pressed: false
    },
    a: {
        pressed: false
    },
    s: {
        pressed: false
    },
    d: {
        pressed: false
    }
}

const movables = [background, ...boundaries, foreground, ...battleZones]
function rectangularCollisions({ r1,r2}){
    return (
        r1.position.x + r1.width >= r2.position.x && 
        r1.position.x <= r2.position.x + r2.width &&
        r1.position.y + r1.height >= r2.position.y &&
        r1.position.y <= r2.position.y + r2.height
        )
}

function animate(){
    window.requestAnimationFrame(animate)
    background.draw()
    
    boundaries.forEach(Boundary => {
        Boundary.draw()
    })
    battleZones.forEach((bz => {
        bz.draw()
    }))
    
   player.draw()
   foreground.draw()

   if(keys.w.pressed || keys.a.pressed || keys.s.pressed || keys.d.pressed){
    for( let i = 0; i < battleZones.length; i++){
        const bz =  battleZones[i]
        const overlappingArea = 
        (Math.min(player.position.x + player.width, bz.width +bz.position.x) - 
        Math.max(player.position.x, bz.position.x)) * 
        (Math.min(player.position.y + player.height, bz.position.y +bz.height) - 
        Math.max(player.position.y, bz.position.y))

        if(rectangularCollisions({
            r1: player, 
            r2: bz
         }) && overlappingArea > (player.width * player.height) / 2 && Math.random() < 0.01
         ){
             console.log("BZ Activation")
            break
        }
    }
   }
   
    let moving = true
    player.moving=false
    if(keys.w.pressed && lastKey === 'w'){ 
        player.moving=true
        player.image = player.sprites.up
        for( let i = 0; i < boundaries.length; i++){
            const boundary =  boundaries[i]
            if(rectangularCollisions({
                r1: player, 
                r2: {...boundary, position: {
                    x: boundary.position.x,
                    y: boundary.position.y + 3
                }}
             })){
                moving=false
                break
            }
        }
        if(moving){
            movables.forEach(movable => {
                movable.position.y += 3
            })
        }
    } else if(keys.a.pressed && lastKey === 'a'){ 
        player.moving=true
        player.image = player.sprites.left
        for( let i = 0; i < boundaries.length; i++){
            const boundary =  boundaries[i]
            if(rectangularCollisions({
                r1: player, 
                r2: {...boundary, position: {
                    x: boundary.position.x + 3,
                    y: boundary.position.y
                }}
             })){
                moving=false
                break
            }
        }
        if(moving){
            movables.forEach(movable => {
                movable.position.x += 3
            })
        }
    } else if(keys.s.pressed && lastKey === 's'){
        player.moving=true 
        player.image = player.sprites.down
        for( let i = 0; i < boundaries.length; i++){
            const boundary =  boundaries[i]
            if(rectangularCollisions({
                r1: player, 
                r2: {...boundary, position: {
                    x: boundary.position.x,
                    y: boundary.position.y - 3
                }}
             })){
                moving=false
                break
            }
        }
        if(moving){
            movables.forEach(movable => {
                movable.position.y -= 3
            })
        }
    } else if(keys.d.pressed && lastKey === 'd'){
        player.moving=true 
        player.image = player.sprites.right
        for( let i = 0; i < boundaries.length; i++){
            const boundary =  boundaries[i]
            if(rectangularCollisions({
                r1: player, 
                r2: {...boundary, position: {
                    x: boundary.position.x - 3,
                    y: boundary.position.y
                }}
             })){
                moving=false
                break
            }
        }
        if(moving){
            movables.forEach(movable => {
                movable.position.x -= 3
            })
        }
    }
}
animate()

lastKey=''
window.addEventListener('keydown',(e) => {
    switch(e.key){
        case 'w':
            keys.w.pressed=true
            lastKey = 'w'
            break
        case 'a':
            keys.a.pressed=true
            lastKey = 'a'
            break
        case 's':
            keys.s.pressed=true
            lastKey = 's'
            break
        case 'd':
            keys.d.pressed=true
            lastKey = 'd'
            break
    }
})
window.addEventListener('keyup',(e) => {
    switch(e.key){
        case 'w':
            keys.w.pressed=false
            break
        case 'a':
            keys.a.pressed=false
            break
        case 's':
            keys.s.pressed=false
            break
        case 'd':
            keys.d.pressed=false
            break
    }
})