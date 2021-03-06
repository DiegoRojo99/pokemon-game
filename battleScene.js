function updateMonsterHealth(name, newHealth){
    switch(name){
        case 'Okto':
            monsters.Okto.health = newHealth
            document.getElementById('monster-1-life').innerHTML=newHealth+'/'+monsters.Okto.maxHealth+' HP'
            break
        case 'Skull Crasher':
            monsters.Skull.health = newHealth
            document.getElementById('monster-2-life').innerHTML=newHealth+'/'+monsters.Skull.maxHealth+' HP'
            break
        case 'Emby':
            monsters.Emby.health = newHealth
            document.getElementById('monster-3-life').innerHTML=newHealth+'/'+monsters.Emby.maxHealth+' HP'
            break
        case 'Draggle':
            monsters.Draggle.health = newHealth
            document.getElementById('monster-4-life').innerHTML=newHealth+'/'+monsters.Draggle.maxHealth+' HP'
            break
    }
}

const battleBattlegroundImage = new Image()
battleBattlegroundImage.src = './img/bg/battleBackground.png'
const battleBackground = new Sprite({
    position: {
        x: 0,
        y: 0
    }, image: battleBattlegroundImage
})

let draggle
let emby
let okto
let enemy
let playerMonster
let renderedSprites
let battleAnimationId
let queue

function selectMonsterBasedOnAnimation(){
    switch(monsterAnimationSelected){
        case 'Okto':
            playerMonster = new Monster(monsters.Okto)
            break
        case 'Skull':
            playerMonster = new Monster(monsters.Skull)
            break
        case 'Draggle':
            playerMonster = new Monster(monsters.Draggle)
            break
        case 'Emby':
            playerMonster = new Monster(monsters.Emby)
            break
        default:
            playerMonster = new Monster(monsters.Draggle)
    }
}

function initBattle(){
    document.querySelector('#healthBars').style.display = 'block'
    document.querySelector('#dialogueBox').style.display = 'none'
    document.querySelector('#inventory-briefcase').style.display = 'none'
    document.querySelector('#enemyHealthBar').style.width = '100%'
    document.querySelector('#playerHealthBar').style.width = '100%'
    document.querySelector('#attacksBox').replaceChildren()
        
    //Enemy is chosen here
    let randomEnemyNumber = Math.floor(Math.random() * 4)
    switch(randomEnemyNumber){
        case 0:
            enemy = new Monster(monsters.Skull)
            break
        case 1:
            enemy = new Monster(monsters.Okto)
            break
        case 2:
            enemy = new Monster(monsters.Draggle)
            break
        case 3: 
            enemy = new Monster(monsters.Emby)
            break
        default:
            enemy = new Monster(monsters.Draggle)
            break
    }

    //Player is assigned here
    selectMonsterBasedOnAnimation()

    document.querySelector('#enemyName').innerHTML=enemy.name
    document.querySelector('#playerName').innerHTML=playerMonster.name

    enemy.position = {
        x: 800,
        y: 100
    }
    playerMonster.position = {
        x: 280,
        y: 325
    }
    
    enemy.health=enemy.maxHealth
    enemy.isEnemy = true
    playerMonster.isEnemy = false
    
    document.querySelector('#playerHealthBar').style.width = (playerMonster.health*100/playerMonster.maxHealth)+'%'

    renderedSprites = [enemy, playerMonster]
    queue = []
    
    playerMonster.attacks.forEach(attack => {
        const button = document.createElement('button')
        button.innerHTML = attack.shown
        addPlayerAttack(playerMonster, attack)
        document.querySelector('#attacksBox').append(button)
    })

    document.querySelectorAll('button').forEach((button) => {
        button.addEventListener('click', (e) => {
            let attackShownName=e.currentTarget.innerHTML
            attackShownName=attackShownName.replace(" ","")
            const selectedAttack= attacks[attackShownName]
            
            if(attackHasPPLeft(selectedAttack, playerMonster)){
                    
                playerMonster.attack({ 
                    attack: selectedAttack, 
                    recipient: enemy,
                    renderedSprites
                })

                if(enemy.health <= 0){
                    queue.push(() => {
                        enemy.faint()
                    })
                    queue.push(() => {
                        //Fade back to black
                        gsap.to('#overlappingDiv',{
                            opacity: 1,
                            onComplete: () => {
                                cancelAnimationFrame(battleAnimationId)
                                animate(),
                                document.querySelector('#healthBars').style.display='none'
                                gsap.to('#overlappingDiv',{
                                    opacity: 0
                                })
                                
                                battle.initiated = false
                            }
                        })
                    })

                    console
                    updateMonsterHealth(playerMonster.name, playerMonster.health)
                }

                //Enemy attacks
                const randomAttack = enemy.attacks[Math.floor(Math.random() * enemy.attacks.length)]

                queue.push(() => {
                    enemy.attack({ 
                        attack: randomAttack, 
                        recipient: playerMonster,
                        renderedSprites
                    })

                    if(playerMonster.health <= 0){
                        queue.push(() => {
                            playerMonster.faint()
                        })
                        queue.push(() => {
                            //Fade back to black
                            gsap.to('#overlappingDiv',{
                                opacity: 1,
                                onComplete: () => {
                                    cancelAnimationFrame(battleAnimationId)
                                    animate(),
                                    document.querySelector('#healthBars').style.display='none'
                                    gsap.to('#overlappingDiv',{
                                        opacity: 0
                                    })

                                    battle.initiated = false
                                }
                            })
                        })
                        updateMonsterHealth(playerMonster.name, 0)
                    }
                })
            }
        })
            button.addEventListener('mouseenter', (e) => {
                
                let attackShownName=e.currentTarget.innerHTML
                attackShownName=attackShownName.replace(" ","")
                const selectedAttack = attacks[attackShownName]
                let ppAttack = getPPAttack(selectedAttack, playerMonster)
                if(ppAttack===-1){
                    ppAttack=selectedAttack.maxNumberMoves
                }
                let ppLeft = '\n '+ppAttack+'/'+selectedAttack.maxNumberMoves+' PP'
                document.querySelector('#attackType').innerHTML = selectedAttack.type + ppLeft
                document.querySelector('#attackType').style.color = selectedAttack.color
            })
    })
}

function animateBattle(){    
    battleAnimationId = window.requestAnimationFrame(animateBattle)
    battleBackground.draw()


    renderedSprites.forEach((sprite) => {
        if(sprite.isEnemy!==null){
            if(sprite.isEnemy===true){
                sprite.drawBack()
            }else{
                sprite.draw()
            }
        }else{
            sprite.draw()
        }
    })
}

function getBattle(){
    initBattle()
    animateBattle()
}


animate()
//getBattle()

document.querySelector('#dialogueBox').addEventListener('click', (e) => {
    if(queue.length > 0){
        queue[0]()
        queue.shift()
    }else{
        e.currentTarget.style.display='none'
    }

})

function checkEfectiveness(attackType, recipientType){

    switch(recipientType){
        case 'Fire':
            switch(attackType){
                case 'Water':
                    return 2
                case 'Rock':
                    return 2
                case 'Plant':
                    return 0.5
                case 'Fire':
                    return 0.5
                case 'Ice':
                    return 0.5
                case 'Rock':
                    return 2
                case 'Fairy':
                    return 0.5
                case 'Steel':
                    return 0.5
                case 'Bug':
                    return 0.5
                case 'Ground':
                    return 2
                default:
                    return 1
            }
        case 'Water':
            switch(attackType){
                case 'Water':
                    return 0.5
                case 'Plant':
                    return 2
                case 'Fire':
                    return 0.5
                default:
                    return 1
            }
        case 'Plant':
            switch(attackType){
                case 'Fire':
                    return 2
                case 'Water':
                    return 0.5
                case 'Plant':
                    return 0.5
                case 'Electric':
                    return 0.5
                case 'Flying':
                    return 2
                case 'Ice':
                    return 2
                case 'Bug':
                    return 2
                case 'Poison':
                    return 2
                case 'Ground':
                    return 0.5
                default:
                    return 1
            }
        default:
            return 1
    }

    return 1

}

function updateAllMonsterHPs(){
    updateMonsterHealth('Okto',monsters.Okto.health)
    updateMonsterHealth('Skull Crasher',monsters.Skull.health)
    updateMonsterHealth('Emby',monsters.Emby.health)
    updateMonsterHealth('Draggle',monsters.Draggle.health)
}
updateAllMonsterHPs()

function addPlayerAttack(monster, attack){
    switch(monster.name){
        case 'Skull Crasher':
            switch(attack.name){
                case 'PowerWhip':
                    if(monsterXattack.SkullAttacks.PowerWhip===undefined){
                        monsterXattack.SkullAttacks.PowerWhip={
                            attackName: attack.name,
                            pp: attack.maxNumberMoves
                        }
                    }
                    break
                case 'Fireball':
                    if(monsterXattack.SkullAttacks.Fireball===undefined){
                        monsterXattack.SkullAttacks.Fireball={
                            attackName: attack.name,
                            pp: attack.maxNumberMoves
                        }
                    }
                    break
                case 'RockWrecker':
                    if(monsterXattack.SkullAttacks.RockWrecker===undefined){
                        monsterXattack.SkullAttacks.RockWrecker={
                            attackName: attack.name,
                            pp: attack.maxNumberMoves
                        }
                    }
                    break
                case 'WaterStorm':
                    if(monsterXattack.SkullAttacks.WaterStorm===undefined){
                        monsterXattack.SkullAttacks.WaterStorm={
                            attackName: attack.name,
                            pp: attack.maxNumberMoves
                        }
                    }
                    break
                case 'Tackle':
                    if(monsterXattack.SkullAttacks.Tackle===undefined){
                        monsterXattack.SkullAttacks.Tackle={
                            attackName: attack.name,
                            pp: attack.maxNumberMoves
                        }
                    }
                    break
            }
            break
        case 'Draggle':
            switch(attack.name){
                case 'PowerWhip':
                    if(monsterXattack.DraggleAttacks.PowerWhip===undefined){
                        monsterXattack.DraggleAttacks.PowerWhip={
                            attackName: attack.name,
                            pp: attack.maxNumberMoves
                        }
                    }
                    break
                case 'Fireball':
                    if(monsterXattack.DraggleAttacks.Fireball===undefined){
                        monsterXattack.DraggleAttacks.Fireball={
                            attackName: attack.name,
                            pp: attack.maxNumberMoves
                        }
                    }
                    break
                case 'RockWrecker':
                    if(monsterXattack.DraggleAttacks.RockWrecker===undefined){
                        monsterXattack.DraggleAttacks.RockWrecker={
                            attackName: attack.name,
                            pp: attack.maxNumberMoves
                        }
                    }
                    break
                case 'WaterStorm':
                    if(monsterXattack.DraggleAttacks.WaterStorm===undefined){
                        monsterXattack.DraggleAttacks.WaterStorm={
                            attackName: attack.name,
                            pp: attack.maxNumberMoves
                        }
                    }
                    break
                case 'Tackle':
                    if(monsterXattack.DraggleAttacks.Tackle===undefined){
                        monsterXattack.DraggleAttacks.Tackle={
                            attackName: attack.name,
                            pp: attack.maxNumberMoves
                        }
                    }
                    break
            }
            break
        case 'Emby':
            switch(attack.name){
                case 'PowerWhip':
                    if(monsterXattack.EmbyAttacks.PowerWhip===undefined){
                        monsterXattack.EmbyAttacks.PowerWhip={
                            attackName: attack.name,
                            pp: attack.maxNumberMoves
                        }
                    }
                    break
                case 'Fireball':
                    if(monsterXattack.EmbyAttacks.Fireball===undefined){
                        monsterXattack.EmbyAttacks.Fireball={
                            attackName: attack.name,
                            pp: attack.maxNumberMoves
                        }
                    }
                    break
                case 'RockWrecker':
                    if(monsterXattack.EmbyAttacks.RockWrecker===undefined){
                        monsterXattack.EmbyAttacks.RockWrecker={
                            attackName: attack.name,
                            pp: attack.maxNumberMoves
                        }
                    }
                    break
                case 'WaterStorm':
                    if(monsterXattack.EmbyAttacks.WaterStorm===undefined){
                        monsterXattack.EmbyAttacks.WaterStorm={
                            attackName: attack.name,
                            pp: attack.maxNumberMoves
                        }
                    }
                    break
                case 'Tackle':
                    if(monsterXattack.EmbyAttacks.Tackle===undefined){
                        monsterXattack.EmbyAttacks.Tackle={
                            attackName: attack.name,
                            pp: attack.maxNumberMoves
                        }
                    }
                    break
            }
            break
        case 'Okto':
            switch(attack.name){
                case 'PowerWhip':
                    if(monsterXattack.OktoAttacks.PowerWhip===undefined){
                        monsterXattack.OktoAttacks.PowerWhip={
                            attackName: attack.name,
                            pp: attack.maxNumberMoves
                        }
                    }
                    break
                case 'Fireball':
                    if(monsterXattack.OktoAttacks.Fireball===undefined){
                        monsterXattack.OktoAttacks.Fireball={
                            attackName: attack.name,
                            pp: attack.maxNumberMoves
                        }
                    }
                    break
                case 'RockWrecker':
                    if(monsterXattack.OktoAttacks.RockWrecker===undefined){
                        monsterXattack.OktoAttacks.RockWrecker={
                            attackName: attack.name,
                            pp: attack.maxNumberMoves
                        }
                    }
                    break
                case 'WaterStorm':
                    if(monsterXattack.OktoAttacks.WaterStorm===undefined){
                        monsterXattack.OktoAttacks.WaterStorm={
                            attackName: attack.name,
                            pp: attack.maxNumberMoves
                        }
                    }
                    break
                case 'Tackle':
                    if(monsterXattack.OktoAttacks.Tackle===undefined){
                        monsterXattack.OktoAttacks.Tackle={
                            attackName: attack.name,
                            pp: attack.maxNumberMoves
                        }
                    }
                    break
            }
            break
    }
}

function attackHasPPLeft(attack, monster){
    switch(monster.name){
        
        case 'Skull Crasher':
            switch(attack.name){
                case 'RockWrecker':
                    if(monsterXattack.SkullAttacks.RockWrecker===undefined){
                        addPlayerAttack(monster,attack)
                        return true
                    }else{
                        if(monsterXattack.SkullAttacks.RockWrecker.pp>0){
                            return true
                        }else{
                            return false
                        }
                    }
                    break
                case 'Fireball':
                    if(monsterXattack.SkullAttacks.Fireball===undefined){
                        addPlayerAttack(monster,attack)
                        return true
                    }else{
                        if(monsterXattack.SkullAttacks.Fireball.pp>0){
                            return true
                        }else{
                            return false
                        }
                    }
                    break
                case 'PowerWhip':
                    if(monsterXattack.SkullAttacks.PowerWhip===undefined){
                        addPlayerAttack(monster,attack)
                        return true
                    }else{
                        if(monsterXattack.SkullAttacks.PowerWhip.pp>0){
                            return true
                        }else{
                            return false
                        }
                    }
                    break
                case 'WaterStorm':
                    if(monsterXattack.SkullAttacks.WaterStorm===undefined){
                        addPlayerAttack(monster,attack)
                        return true
                    }else{
                        if(monsterXattack.SkullAttacks.WaterStorm.pp>0){
                            return true
                        }else{
                            return false
                        }
                    }
                    break
                case 'Tackle':
                    if(monsterXattack.SkullAttacks.Tackle===undefined){
                        addPlayerAttack(monster,attack)
                        return true
                    }else{
                        if(monsterXattack.SkullAttacks.Tackle.pp>0){
                            return true
                        }else{
                            return false
                        }
                    }
                    break
            }
            break
        case 'Draggle':
        switch(attack.name){
            case 'RockWrecker':
                if(monsterXattack.DraggleAttacks.RockWrecker===undefined){
                    addPlayerAttack(monster,attack)
                    return true
                }else{
                    if(monsterXattack.DraggleAttacks.RockWrecker.pp>0){
                        return true
                    }else{
                        return false
                    }
                }
                break
            case 'Fireball':
                if(monsterXattack.DraggleAttacks.Fireball===undefined){
                    addPlayerAttack(monster,attack)
                    return true
                }else{
                    if(monsterXattack.DraggleAttacks.Fireball.pp>0){
                        return true
                    }else{
                        return false
                    }
                }
                break
            case 'PowerWhip':
                if(monsterXattack.DraggleAttacks.PowerWhip===undefined){
                    addPlayerAttack(monster,attack)
                    return true
                }else{
                    if(monsterXattack.DraggleAttacks.PowerWhip.pp>0){
                        return true
                    }else{
                        return false
                    }
                }
                break
            case 'WaterStorm':
                if(monsterXattack.DraggleAttacks.WaterStorm===undefined){
                    addPlayerAttack(monster,attack)
                    return true
                }else{
                    if(monsterXattack.DraggleAttacks.WaterStorm.pp>0){
                        return true
                    }else{
                        return false
                    }
                }
                break
            case 'Tackle':
                if(monsterXattack.DraggleAttacks.Tackle===undefined){
                    addPlayerAttack(monster,attack)
                    return true
                }else{
                    if(monsterXattack.DraggleAttacks.Tackle.pp>0){
                        return true
                    }else{
                        return false
                    }
                }
                break
        }
        break
        case 'Emby':
        switch(attack.name){
            case 'RockWrecker':
                if(monsterXattack.EmbyAttacks.RockWrecker===undefined){
                    addPlayerAttack(monster,attack)
                    return true
                }else{
                    if(monsterXattack.EmbyAttacks.RockWrecker.pp>0){
                        return true
                    }else{
                        return false
                    }
                }
                break
            case 'Fireball':
                if(monsterXattack.EmbyAttacks.Fireball===undefined){
                    addPlayerAttack(monster,attack)
                    return true
                }else{
                    if(monsterXattack.EmbyAttacks.Fireball.pp>0){
                        return true
                    }else{
                        return false
                    }
                }
                break
            case 'PowerWhip':
                if(monsterXattack.EmbyAttacks.PowerWhip===undefined){
                    addPlayerAttack(monster,attack)
                    return true
                }else{
                    if(monsterXattack.EmbyAttacks.PowerWhip.pp>0){
                        return true
                    }else{
                        return false
                    }
                }
                break
            case 'WaterStorm':
                if(monsterXattack.EmbyAttacks.WaterStorm===undefined){
                    addPlayerAttack(monster,attack)
                    return true
                }else{
                    if(monsterXattack.EmbyAttacks.WaterStorm.pp>0){
                        return true
                    }else{
                        return false
                    }
                }
                break
            case 'Tackle':
                if(monsterXattack.EmbyAttacks.Tackle===undefined){
                    addPlayerAttack(monster,attack)
                    return true
                }else{
                    if(monsterXattack.EmbyAttacks.Tackle.pp>0){
                        return true
                    }else{
                        return false
                    }
                }
                break
        }
        break
        case 'Okto':
            switch(attack.name){
                case 'RockWrecker':
                    if(monsterXattack.OktoAttacks.RockWrecker===undefined){
                        addPlayerAttack(monster,attack)
                        return true
                    }else{
                        if(monsterXattack.OktoAttacks.RockWrecker.pp>0){
                            return true
                        }else{
                            return false
                        }
                    }
                    break
                case 'Fireball':
                    if(monsterXattack.OktoAttacks.Fireball===undefined){
                        addPlayerAttack(monster,attack)
                        return true
                    }else{
                        if(monsterXattack.OktoAttacks.Fireball.pp>0){
                            return true
                        }else{
                            return false
                        }
                    }
                    break
                case 'PowerWhip':
                    if(monsterXattack.OktoAttacks.PowerWhip===undefined){
                        addPlayerAttack(monster,attack)
                        return true
                    }else{
                        if(monsterXattack.OktoAttacks.PowerWhip.pp>0){
                            return true
                        }else{
                            return false
                        }
                    }
                    break
                case 'WaterStorm':
                    if(monsterXattack.OktoAttacks.WaterStorm===undefined){
                        addPlayerAttack(monster,attack)
                        return true
                    }else{
                        if(monsterXattack.OktoAttacks.WaterStorm.pp>0){
                            return true
                        }else{
                            return false
                        }
                    }
                    break
                case 'Tackle':
                    if(monsterXattack.OktoAttacks.Tackle===undefined){
                        addPlayerAttack(monster,attack)
                        return true
                    }else{
                        if(monsterXattack.OktoAttacks.Tackle.pp>0){
                            return true
                        }else{
                            return false
                        }
                    }
                    break
            }
            break
        default:
            return true
    }
}

function getPPAttack(attack, monster){
    switch(monster.name){
        case 'Skull Crasher':
            switch(attack.name){
                case 'RockWrecker':
                    if(monsterXattack.SkullAttacks.RockWrecker===undefined){
                        addPlayerAttack(monster, attack)
                        return -1
                    }else{
                        return monsterXattack.SkullAttacks.RockWrecker.pp
                    }
                    break
                case 'Fireball':
                    if(monsterXattack.SkullAttacks.Fireball===undefined){
                        addPlayerAttack(monster,attack)
                        return -1
                    }else{
                        return monsterXattack.SkullAttacks.Fireball.pp
                    }
                    break
                case 'PowerWhip':
                    if(monsterXattack.SkullAttacks.PowerWhip===undefined){
                        addPlayerAttack(monster,attack)
                        return -1
                    }else{
                        return monsterXattack.SkullAttacks.PowerWhip.pp
                    }
                    break
                case 'WaterStorm':
                    if(monsterXattack.SkullAttacks.WaterStorm===undefined){
                        addPlayerAttack(monster,attack)
                        return -1
                    }else{
                        return monsterXattack.SkullAttacks.WaterStorm.pp
                    }
                    break
                case 'Tackle':
                    if(monsterXattack.SkullAttacks.Tackle===undefined){
                        addPlayerAttack(monster,attack)
                        return -1
                    }else{
                        return monsterXattack.SkullAttacks.Tackle.pp
                    }
                    break
            }
            break
        case 'Draggle':
        switch(attack.name){
            case 'RockWrecker':
                if(monsterXattack.DraggleAttacks.RockWrecker===undefined){
                    addPlayerAttack(monster,attack)
                    return -1
                }else{
                    return monsterXattack.DraggleAttacks.RockWrecker.pp>0
                }
                break
            case 'Fireball':
                if(monsterXattack.DraggleAttacks.Fireball===undefined){
                    addPlayerAttack(monster,attack)
                    return -1
                }else{
                    return monsterXattack.DraggleAttacks.Fireball.pp
                }
                break
            case 'PowerWhip':
                if(monsterXattack.DraggleAttacks.PowerWhip===undefined){
                    addPlayerAttack(monster,attack)
                    return -1
                }else{
                    return monsterXattack.DraggleAttacks.PowerWhip.pp
                }
                break
            case 'WaterStorm':
                if(monsterXattack.DraggleAttacks.WaterStorm===undefined){
                    addPlayerAttack(monster,attack)
                    return -1
                }else{
                    return monsterXattack.DraggleAttacks.WaterStorm.pp
                }
                break
            case 'Tackle':
                if(monsterXattack.DraggleAttacks.Tackle===undefined){
                    addPlayerAttack(monster,attack)
                    return true
                }else{
                    return monsterXattack.DraggleAttacks.Tackle.pp
                }
                break
        }
        break
        case 'Emby':
        switch(attack.name){
            case 'RockWrecker':
                if(monsterXattack.EmbyAttacks.RockWrecker===undefined){
                    addPlayerAttack(monster,attack)
                    return -1
                }else{
                    return monsterXattack.EmbyAttacks.RockWrecker.pp
                }
                break
            case 'Fireball':
                if(monsterXattack.EmbyAttacks.Fireball===undefined){
                    addPlayerAttack(monster,attack)
                    return -1
                }else{
                    return monsterXattack.EmbyAttacks.Fireball.pp  
                }
                break
            case 'PowerWhip':
                if(monsterXattack.EmbyAttacks.PowerWhip===undefined){
                    addPlayerAttack(monster,attack)
                    return -1
                }else{
                    return monsterXattack.EmbyAttacks.PowerWhip.pp
                }
                break
            case 'WaterStorm':
                if(monsterXattack.EmbyAttacks.WaterStorm===undefined){
                    addPlayerAttack(monster,attack)
                    return -1
                }else{
                    return monsterXattack.EmbyAttacks.WaterStorm.pp
                }
                break
            case 'Tackle':
                if(monsterXattack.EmbyAttacks.Tackle===undefined){
                    addPlayerAttack(monster,attack)
                    return true
                }else{
                    return monsterXattack.EmbyAttacks.Tackle.pp
                }
                break
        }
        break
        case 'Okto':
            switch(attack.name){
                case 'RockWrecker':
                    if(monsterXattack.OktoAttacks.RockWrecker===undefined){
                        addPlayerAttack(monster,attack)
                        return -1
                    }else{
                        return (monsterXattack.OktoAttacks.RockWrecker.pp)
                    }
                    break
                case 'Fireball':
                    if(monsterXattack.OktoAttacks.Fireball===undefined){
                        addPlayerAttack(monster,attack)
                        return -1
                    }else{
                        return(monsterXattack.OktoAttacks.Fireball.pp)
                    }
                    break
                case 'PowerWhip':
                    if(monsterXattack.OktoAttacks.PowerWhip===undefined){
                        addPlayerAttack(monster,attack)
                        return -1
                    }else{
                        return(monsterXattack.OktoAttacks.PowerWhip.pp) 
                    }
                    break
                case 'WaterStorm':
                    if(monsterXattack.OktoAttacks.WaterStorm===undefined){
                        addPlayerAttack(monster,attack)
                        return -1
                    }else{
                        return(monsterXattack.OktoAttacks.WaterStorm.pp)                            
                    }
                    break
                case 'Tackle':
                    if(monsterXattack.OktoAttacks.Tackle===undefined){
                        addPlayerAttack(monster,attack)
                        return -1
                    }else{
                        return(monsterXattack.OktoAttacks.Tackle.pp)
                    }
                    break
            }
            break
        default:
            return true
    }
}