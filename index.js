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
backgroundImage.src='./img/bg/PelletTown.png'

const playerDownImage = new Image()
playerDownImage.src='./img/player/playerDown.png'

const playerUpImage = new Image()
playerUpImage.src='./img/player/playerUp.png'

const playerLeftImage = new Image()
playerLeftImage.src='./img/player/playerLeft.png'

const playerRightImage = new Image()
playerRightImage.src='./img/player/playerRight.png'

//Monster Images
const monsterDownImage = new Image()
monsterDownImage.src='./img/monsters/walking/oktoLeft.png'

const monsterUpImage = new Image()
monsterUpImage.src='./img/monsters/walking/oktoLEft.png'

const monsterLeftImage = new Image()
monsterLeftImage.src='./img/monsters/walking/oktoLeft.png'

const monsterRightImage = new Image()
monsterRightImage.src='./img/monsters/walking/oktoLeft.png'

//Foreground
const foregroundImage = new Image()
foregroundImage.src='./img/bg/foregroundObjects.png'


const player = new Sprite({
    position: {
        x: canvas.width / 2 - 192 / 4 / 2,
        y: canvas.height / 2 - 68 / 2
    },
    image: playerDownImage,
    frames: {
        max: 4,
        hold: 10
    },
    sprites: {
        up: playerUpImage,
        down: playerDownImage,
        left: playerLeftImage,
        right: playerRightImage
    }
})

const monsterSprite = new Sprite({
    position: {
        x: canvas.width / 2 - 192 / 4 / 2,
        y: canvas.height / 2 - 68 / 2
    },
    image: monsterDownImage,
    frames: {
        max: 4,
        hold: 10
    },
    sprites: {
        up: monsterUpImage,
        down: monsterDownImage,
        left: monsterLeftImage,
        right: monsterRightImage
    }
})

function drawUp(monster){
    monster.image = monster.sprites.up
    monster.position={
        x: player.position.x,
        y: player.position.y + (player.height)
    }
}
function drawDown(monster){
    monster.image = monster.sprites.down
    monster.position={
        x: player.position.x,
        y: player.position.y - (player.height / player.frames.max * 3)
    }
}
function drawLeft(monster){
    monster.image = monster.sprites.left
    monster.position={
        x: player.position.x + (player.width),
        y: player.position.y + (player.height / player.frames.max)
    }
}
function drawRight(monster){
    monster.image = monster.sprites.right
    monster.position={
        x: player.position.x - (player.width),
        y: player.position.y + (player.height / player.frames.max)
    }
}

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

const battle={
    initiated:false
}

function animate(){
    
    const animationId = window.requestAnimationFrame(animate)
    background.draw()
    
    boundaries.forEach(Boundary => {
        Boundary.draw()
    })
    battleZones.forEach((bz => {
        bz.draw()
    }))
    
   player.draw()
   monsterSprite.draw()
   foreground.draw()

   
   let moving = true
   player.animate=false

   if(battle.initiated) return

   //ACtivate a battle
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
         }) && 
         overlappingArea > (player.width * player.height) / 2 && Math.random() < 0.01){

            
            // deactivate current animation loop
            window.cancelAnimationFrame(animationId)
            battle.initiated=true
            gsap.to('#overlappingDiv',{
                opacity: 1,
                repeat: 3,
                yoyo: true,
                duration: 0.4,
                onComplete(){
                    gsap.to('#overlappingDiv', {
                        opacity: 1,
                        duration: 0.4,
                        onComplete(){
                            getBattle()
                            gsap.to('#overlappingDiv', {
                                opacity: 0,
                                duration: 0.4,
                            })
                        }
                    })
                }
            })
            break
        }
    }
   }
   
    if(keys.w.pressed && lastKey === 'w'){ 
        player.animate=true
        player.image = player.sprites.up
        drawUp(monsterSprite)
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
        player.animate=true
        player.image = player.sprites.left
        drawLeft(monsterSprite)
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
        player.animate=true 
        player.image = player.sprites.down
        drawDown(monsterSprite)
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
        player.animate=true 
        player.image = player.sprites.right
        drawRight(monsterSprite)
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