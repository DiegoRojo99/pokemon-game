
class Sprite{
    constructor({
        position, 
        image, 
        frames = {max: 1, hold: 10 }, 
        sprites, 
        animate = false,
        rotation = 0
    }){
        this.position = position
        this.image = new Image()
        this.frames = {...frames, val: 0, elapsed:0}
        this.image.onload = () => {
            this.width = this.image.width / this.frames.max
            this.height = this.image.height
        }
        this.image.src = image.src
        this.animate = animate
        this.sprites = sprites
        this.opacity = 1
        this.rotation=rotation
    }

    draw(){
        c.save()

        c.translate(this.position.x + this.width / 2, this.position.y + this.height / 2)
        c.rotate(this.rotation)
        c.translate(- this.position.x - this.width / 2, - this.position.y - this.height / 2)

        c.globalAlpha = this.opacity
        c.drawImage(
            this.image, 
            this.frames.val * this.width,
            0,
            this.image.width / this.frames.max,
            this.image.height,
            this.position.x,
            this.position.y,
            this.image.width / this.frames.max,
            this.image.height
        )
        c.restore()

        if(!this.animate) return

        if(this.frames.max > 1) {
            this.frames.elapsed++
        }

        if(this.frames.elapsed % this.frames.hold === 0){
            if(this.frames.val< this.frames.max - 1){
                this.frames.val++
            }else{
                this.frames.val=0
            } 
        }

    }

}

class Monster extends Sprite{
    constructor({ 
        position, 
        image, 
        frames = {max: 1, hold: 10 }, 
        sprites, 
        animate = false,
        rotation = 0,
        isEnemy=false, 
        backImage,
        maxHealth,
        health,
        name,
        type,
        attacks
    }){
        super({
            position, 
            image, 
            frames, 
            sprites, 
            animate,
            rotation
        })
        
        this.backImage = new Image()
        this.backImage.src=backImage.src
        this.maxHealth = maxHealth
        this.health = health
        this.isEnemy=isEnemy
        this.name=name
        this.type=type
        this.attacks=attacks
    }

    drawBack(){
        c.save()

        this.backImage.onload = () => {
            this.width = this.backImage.width / this.frames.max
            this.height = this.backImage.height
        }

        c.translate(this.position.x + this.width / 2, this.position.y + this.height / 2)
        c.rotate(this.rotation)
        c.translate(- this.position.x - this.width / 2, - this.position.y - this.height / 2)

        c.globalAlpha = this.opacity
        c.drawImage(
            this.backImage, 
            this.frames.val * this.width,
            0,
            this.backImage.width / this.frames.max,
            this.backImage.height,
            this.position.x,
            this.position.y,
            this.backImage.width / this.frames.max,
            this.backImage.height
        )
        c.restore()

        if(!this.animate) return

        if(this.frames.max > 1) {
            this.frames.elapsed++
        }

        if(this.frames.elapsed % this.frames.hold === 0){
            if(this.frames.val< this.frames.max - 1){
                this.frames.val++
            }else{
                this.frames.val=0
            } 
        }

    }

    faint(){
        document.querySelector('#dialogueBox').innerHTML = this.name + ' fainted!'
        gsap.to(this.position, {
            y: this.position.y + 20
        })
        gsap.to(this, {
            opacity: 0
        })
    }

    attack({attack, recipient, renderedSprites}){
        document.querySelector('#dialogueBox').style.display="block"
        document.querySelector('#dialogueBox').innerHTML = this.name + ' used ' +attack.shown
        
        let healthBar = '#enemyHealthBar'
        let rotation=1
        if(this.isEnemy){
            healthBar = '#playerHealthBar'
            rotation=-2.2
        }
         
        recipient.health -= (attack.damage * checkEfectiveness(attack.type, recipient.type))
        
        if(checkEfectiveness(attack.type, recipient.type)===2){
            queue.push(() => {
                document.querySelector('#dialogueBox').innerHTML = 'It was very effective'
            })            
        }else if(checkEfectiveness(attack.type, recipient.type)===0.5){
            queue.push(() => {
                document.querySelector('#dialogueBox').innerHTML = 'It was NOT very effective'
            })            
        }

        switch(attack.name){
            case 'PowerWhip':
                const leafImage=new Image()
                leafImage.src="./img/projectiles/plantSpike.png"
                const leaf = new Sprite ({
                    position: {
                        x: this.position.x,
                        y: this.position.y
                    },
                    rotation: 5.6,
                    image: leafImage,
                    frames: {
                        max: 4,
                        hold: 10
                    },
                    animate: true
                })
                renderedSprites.splice(1, 0, leaf)

                if(this.isEnemy){
                    leaf.rotation=-4
                }

                gsap.to(leaf.position, {
                    x: recipient.position.x,
                    y: recipient.position.y,
                    onComplete: () => {
                        gsap.to(healthBar, {
                            width: (recipient.health/recipient.maxHealth*100) + '%'
                        })

                        gsap.to(recipient.position, {
                            x: recipient.position.x + 10,
                            yoyo: true,
                            repeat: 5,
                            duration: 0.08  
                        })

                        gsap.to(recipient, {
                            opacity: 0,
                            repeat: 5,
                            yoyo: true,
                            duration: 0.08
                        })
                        
                        renderedSprites.splice(1, 1)
                    }
                })
                break
            case 'RockWrecker':
                const rockImage=new Image()
                rockImage.src="./img/projectiles/rock.png"
                const rock = new Sprite ({
                    position: {
                        x: this.position.x,
                        y: this.position.y
                    },
                    image: rockImage,
                    frames: {
                        max: 4,
                        hold: 10
                    },
                    animate: true,
                    rotation: rotation
                })
                renderedSprites.splice(1, 0, rock)

                gsap.to(rock.position, {
                    x: recipient.position.x,
                    y: recipient.position.y,
                    onComplete: () => {
                        gsap.to(healthBar, {
                            width: (recipient.health/recipient.maxHealth*100) + '%'
                        })

                        gsap.to(recipient.position, {
                            x: recipient.position.x + 10,
                            yoyo: true,
                            repeat: 5,
                            duration: 0.08  
                        })

                        gsap.to(recipient, {
                            opacity: 0,
                            repeat: 5,
                            yoyo: true,
                            duration: 0.08
                        })
                        
                        renderedSprites.splice(1, 1)
                    }
                })
                break
            case 'WaterStorm':
                const waterImage=new Image()
                waterImage.src="./img/projectiles/energyBall.png"
                const water = new Sprite ({
                    position: {
                        x: this.position.x,
                        y: this.position.y
                    },
                    image: waterImage,
                    frames: {
                        max: 4,
                        hold: 10
                    },
                    animate: true,
                    rotation: rotation
                })
                renderedSprites.splice(1, 0, water)

                gsap.to(water.position, {
                    x: recipient.position.x,
                    y: recipient.position.y,
                    onComplete: () => {
                        gsap.to(healthBar, {
                            width: (recipient.health/recipient.maxHealth*100) + '%'
                        })

                        gsap.to(recipient.position, {
                            x: recipient.position.x + 10,
                            yoyo: true,
                            repeat: 5,
                            duration: 0.08  
                        })

                        gsap.to(recipient, {
                            opacity: 0,
                            repeat: 5,
                            yoyo: true,
                            duration: 0.08
                        })
                        
                        renderedSprites.splice(1, 1)
                    }
                })
                break
            case 'Fireball':
                const fireballImage=new Image()
                fireballImage.src="./img/projectiles/fireball.png"
                const fireball = new Sprite ({
                    position: {
                        x: this.position.x,
                        y: this.position.y
                    },
                    image: fireballImage,
                    frames: {
                        max: 4,
                        hold: 10
                    },
                    animate: true,
                    rotation: rotation
                })
                renderedSprites.splice(1, 0, fireball)

                gsap.to(fireball.position, {
                    x: recipient.position.x,
                    y: recipient.position.y,
                    onComplete: () => {
                        gsap.to(healthBar, {
                            width: (recipient.health/recipient.maxHealth*100) + '%'
                        })

                        gsap.to(recipient.position, {
                            x: recipient.position.x + 10,
                            yoyo: true,
                            repeat: 5,
                            duration: 0.08  
                        })

                        gsap.to(recipient, {
                            opacity: 0,
                            repeat: 5,
                            yoyo: true,
                            duration: 0.08
                        })
                        
                        renderedSprites.splice(1, 1)
                    }
                })

                break
            case 'Tackle':
                const tl = gsap.timeline()
        

                let movementDistance = 20
                if(this.isEnemy){
                    movementDistance = -20
                }

                tl.to(this.position,{
                    x: this.position.x - movementDistance
                }).to(this.position, {
                    x: this.position.x + (movementDistance * 2),
                    duration: 0.1,
                    onComplete: () => {
                        gsap.to(healthBar, {
                            width: (recipient.health/recipient.maxHealth*100) + '%'
                        })

                        gsap.to(recipient.position, {
                            x: recipient.position.x + 10,
                            yoyo: true,
                            repeat: 5,
                            duration: 0.08  
                        })

                        gsap.to(recipient, {
                            opacity: 0,
                            repeat: 5,
                            yoyo: true,
                            duration: 0.08
                        })
                    }
                }).to(this.position, {
                    x: this.position.x
                })
                
                break
        }

        addPlayerAttack(this, attack)
        if(this.isEnemy===false){
            removePPFromAttack(attack.name, this.name)
        }
    }
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
        c.fillStyle = 'rgba(255, 0, 0, 0)'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}

function removePPFromAttack(attackName, monsterName){
    switch(monsterName){
        case 'Emby':
            switch(attackName){
                case 'PowerWhip':  
                    monsterXattack.EmbyAttacks.PowerWhip.pp-=1
                    break
                case 'Fireball':  
                    monsterXattack.EmbyAttacks.Fireball.pp-=1
                    break
                case 'RockWrecker':  
                    monsterXattack.EmbyAttacks.RockWrecker.pp-=1
                    break
                case 'WaterStorm':  
                    monsterXattack.EmbyAttacks.WaterStorm.pp-=1
                    break
                case 'Tackle':
                    monsterXattack.EmbyAttacks.Tackle.pp-=1
                    break
            }
            break
        case 'Draggle':
            switch(attackName){
                case 'PowerWhip':  
                    monsterXattack.DraggleAttacks.PowerWhip.pp-=1
                    break
                case 'Fireball':  
                    monsterXattack.DraggleAttacks.Fireball.pp-=1
                    break
                case 'RockWrecker':  
                    monsterXattack.DraggleAttacks.RockWrecker.pp-=1
                    break
                case 'WaterStorm':  
                    monsterXattack.DraggleAttacks.WaterStorm.pp-=1
                    break
                case 'Tackle':
                    monsterXattack.DraggleAttacks.Tackle.pp-=1
                    break
            }
            break
        case 'Skull Crasher':
                switch(attackName){
                    case 'PowerWhip':  
                        monsterXattack.SkullAttacks.PowerWhip.pp-=1
                        break
                    case 'Fireball':  
                        monsterXattack.SkullAttacks.Fireball.pp-=1
                        break
                    case 'RockWrecker':  
                        monsterXattack.SkullAttacks.RockWrecker.pp-=1
                        break
                    case 'WaterStorm':  
                        monsterXattack.SkullAttacks.WaterStorm.pp-=1
                        break
                    case 'Tackle':
                        monsterXattack.SkullAttacks.Tackle.pp-=1
                        break
                }
                break
        case 'Okto':
            switch(attackName){
                case 'PowerWhip':  
                    monsterXattack.OktoAttacks.PowerWhip.pp-=1
                    break
                case 'Fireball':  
                    monsterXattack.OktoAttacks.Fireball.pp-=1
                    break
                case 'RockWrecker':  
                    monsterXattack.OktoAttacks.RockWrecker.pp-=1
                    break
                case 'WaterStorm':  
                    monsterXattack.OktoAttacks.WaterStorm.pp-=1
                    break
                case 'Tackle':
                    monsterXattack.OktoAttacks.Tackle.pp-=1
                    break
            }
            break
    }
}