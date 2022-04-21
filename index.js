const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

const collisionsMap = []
for(let i = 0; i < collisions.length; i+= 70){
    collisionsMap.push(collisions.slice(i,70+i))
}

class Boundary{
    static width=48
    static height=48
    constructor({position}){
        this.position=position
        this.width=48
        this.height=48
    }

    draw(){
        c.fillStyle = 'red'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}

const boundaries = []
const offset={
    x: -785,
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

const backgroundImage = new Image()
backgroundImage.src='./img/PelletTown.png'

const playerImage = new Image()
playerImage.src='./img/playerDown.png'

class Sprite{
    constructor({position, velocity, image, frames = {max: 1 }}){
        this.position = position
        this.image = image
        this.frames = frames
        this.image.onload = () => {
            this.width = this.image.width / this.frames.max
            this.height = this.image.height
        }
    }

    draw(){
        c.drawImage(this.image, 
            0,
            0,
            this.image.width / this.frames.max,
            this.image.height,
            this.position.x,
            this.position.y,
            this.image.width / this.frames.max,
            this.image.height
        )
    }
}

const player = new Sprite({
    position: {
        x: canvas.width / 2 - 192 / 4 / 2,
        y: canvas.height / 2 - 68 / 2
    },
    image: playerImage,
    frames: {
        max: 4
    }
})

const background = new Sprite({
    position: {
        x: offset.x,
        y: offset.y
    },
    image: backgroundImage
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

const movables = [background, ...boundaries]
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
    
   player.draw()

   
    let moving = true
    if(keys.w.pressed && lastKey === 'w'){ 
        for( let i = 0; i < boundaries.length; i++){
            const boundary =  boundaries[i]
            if(rectangularCollisions({
                r1: player, 
                r2: {...boundary, position: {
                    x: boundary.position.x,
                    y: boundary.position.y + 3
                }}
             })){
                console.log('colliding')
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
        movables.forEach(movable => {
            movable.position.x +=3 
        })
    } else if(keys.s.pressed && lastKey === 's'){ 
        movables.forEach(movable => {
            movable.position.y -=3 
        })
    } else if(keys.d.pressed && lastKey === 'd'){ 
        movables.forEach(movable => {
            movable.position.x -=3 
        })
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