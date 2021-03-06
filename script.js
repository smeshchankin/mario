kaboom({
    global: true,
    fullscreen: true,
    scale: 1,
    debug: true,
    clearColor: [0, 0, 0, 1]
});

loadRoot('https://i.imgur.com/');
loadSprite('player', 'Wb1qfhK.png');
loadSprite('ground', 'M6rwarW.png');
loadSprite('block', 'pogC9x5.png');
loadSprite('surprise', 'gesQ1KP.png');
loadSprite('unboxed', 'bdrLpi6.png');
loadSprite('coin', 'wbKxhcd.png');
loadSprite('mushroom', '0wMd92p.png');
loadSprite('evil-mushroom', 'KPO3fR9.png');
loadSprite('pipe-top-left', 'ReTPiWY.png');
loadSprite('pipe-top-right', 'hj2GK4n.png');
loadSprite('pipe-bottom-left', 'c1cYSbt.png');
loadSprite('pipe-bottom-right', 'nqQ79eI.png');

scene('game', ({ level, life, score }) => {
    layers(['bg', 'obj', 'ui'], 'obj');

    const map = {
        '1-1': [
        '                                                                                               ',
        '                                                                                               ',
        '                                                                                               ',
        '                                                                                               ',
        '                                                                                @ @            ',
        '                      %                                                         ########   ###%',
        '                                                                                               ',
        '                                                                                               ',
        '                                                                *                              ',
        '                %   #*#%#                     <>         <>                  #*#              %',
        '                                      <>      ()         ()                                    ',
        '                            <>        ()      ()         ()                                    ',
        '                      @     ()        ()@     ()   @@    ()                                    ',
        '=====================================================================  ===============   ======',
        '=====================================================================  ===============   ======'
    ], '1-2': [
        '=                                      =',
        '=                                      =',
        '=                                      =',
        '=                                      =',
        '=                                      =',
        '=                                      =',
        '=    $                       $         =',
        '=    $ $                   $ $         =',
        '=    $ $ $               $ $ $         =',
        '=    $ $ $ $           $ $ $ $         =',
        '=    $ $ $ $ $       $ $ $ $ $         =',
        '=    $ $ $ $ $ $   $ $ $ $ $ $     <>  =',
        '=    $ $ $ $ $ $ $ $ $ $ $ $ $     ()  =',
        '========================================',
        '========================================'
    ]};

    const MOVE_SPEED = 120;
    const JUMP_FORCE = 400;
    const FALL_DEATH = 400;
    let isJumping = true;
    const config = {
        width: 20,
        height: 20,
        '=': [sprite('ground'), solid()],
        '#': [sprite('block'), solid(), 'block'],
        '%': [sprite('surprise'), solid(), 'coin-surprise'],
        '*': [sprite('surprise'), solid(), 'mushroom-surprise'],
        '+': [sprite('unboxed'), solid()],
        '$': [sprite('coin'), 'coin'],
        '^': [sprite('mushroom'), solid(), body(), 'mushroom', 'movable', { dir: vec2(1, 0), speed: MOVE_SPEED / 2 }],
        '@': [sprite('evil-mushroom'), solid(), body(), 'dangerous', 'movable', { dir: vec2(-1, 0), speed: MOVE_SPEED / 2 }],
        '<': [sprite('pipe-top-left'), solid(), scale(0.5), 'pipe'],
        '>': [sprite('pipe-top-right'), solid(), scale(0.5), 'pipe'],
        '(': [sprite('pipe-bottom-left'), solid(), scale(0.5)],
        ')': [sprite('pipe-bottom-right'), solid(), scale(0.5)]
    };

    const gameLevel = addLevel(map['1-' + (level % 2 + 1)], config);
    const scoreLabel = add([
        text('(\/) ' + life + '   $ ' + score),
        pos(30, 6),
        layer('ui'),
        {
            value: score,
            life: life
        }
    ]);

    function big() {
        let timer = 0;
        let isBig = false;
        return {
            update() {
                if (isBig) {
                    timer -= dt();
                    if (timer <= 0) {
                        this.smallify();
                    }
                }
            },
            isBig() {
                return isBig;
            },
            smallify() {
                this.scale = vec2(1);
                timer = 0;
                isBig = false;
            },
            biggify(time) {
                this.scale = vec2(2);
                timer = time;
                isBig = true;
            }
        };
    }

    action('movable', obj => {
        obj.move(obj.dir.scale(obj.speed));
    });

    const player = add([
        sprite('player'),
        solid(),
        pos(30, 0),
        body(),
        big(),
        origin('bot')
    ]);

    player.on('headbump', obj => {
        if (obj.is('coin-surprise')) {
            gameLevel.spawn('$', obj.gridPos.sub(0, 1));
            destroy(obj);
            gameLevel.spawn('+', obj.gridPos.sub(0, 0));
        } else if (obj.is('mushroom-surprise')) {
            gameLevel.spawn('^', obj.gridPos.sub(0, 1));
            destroy(obj);
            gameLevel.spawn('+', obj.gridPos.sub(0, 0));
        } else if (obj.is('block') && player.isBig()) {
            destroy(obj);
        }
    });

    player.collides('mushroom', m => {
        destroy(m);
        player.biggify(6);
    });

    player.collides('coin', c => {
        destroy(c);
        scoreLabel.value++;
        scoreLabel.text = '(\/) ' + scoreLabel.life + '   $ ' + scoreLabel.value;
    });

    player.collides('dangerous', (enemy) => {
        if (isJumping) {
            destroy(enemy);
        } else if (player.isBig()) {
            player.smallify();
            destroy(enemy);
        } else {
            if (scoreLabel.life > 0) {
                scoreLabel.life--;
                scoreLabel.text = '(\/) ' + scoreLabel.life + '   $ ' + scoreLabel.value;
                destroy(enemy);
            } else {
                camShake(10);
                go('lose', { score: scoreLabel.value });
            }
        }
    });

    player.collides('pipe', () => {
        keyPress('down', () => go('game', { level: level + 1, life: scoreLabel.life,  score: scoreLabel.value }));
    });

    player.action(() => {
        if (player.grounded()) {
            isJumping = false;
        }
        camPos(player.pos);
        if (player.pos.y >= FALL_DEATH) {
            go('lose', { score: scoreLabel.value });
        }
    });

    keyDown('left', () => player.move(-MOVE_SPEED, 0));
    keyDown('right', () => player.move(MOVE_SPEED, 0));
    keyPress('space', () => {
        if (player.grounded()) {
            isJumping = true;
            const jumpPower = player.isBig() ? 1.5 : 1
            player.jump(JUMP_FORCE * jumpPower);
        }
    });
});

scene('lose', ({ score }) => {
    add([text('You lose. Total score: ' + score, 32),
    origin('center'), pos(width() / 2, height() / 2)]);
})

start('game', { level: 0, life: 3, score: 0 });
