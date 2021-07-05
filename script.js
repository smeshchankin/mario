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

scene('game', () => {
    layers(['bg', 'obj', 'ui'], 'obj');

    const map = [
        '                                        ',
        '                                        ',
        '                                        ',
        '                                        ',
        '                                        ',
        '                      %                 ',
        '                                        ',
        '                                        ',
        '                                        ',
        '                %   #*#%#               ',
        '                                        ',
        '                                        ',
        '                                        ',
        '========================================',
        '========================================'
    ];

    const MOVE_SPEED = 120;
    const JUMP_FORCE = 360;
    const config = {
        width: 20,
        height: 20,
        '=': [sprite('ground'), solid()],
        '#': [sprite('block'), solid()],
        '%': [sprite('surprise'), solid(), 'coin-surprise'],
        '*': [sprite('surprise'), solid(), 'mushroom-surprise'],
        '+': [sprite('unboxed'), solid()],
        '$': [sprite('coin')],
        '^': [sprite('mushroom'), solid()]
    };
    const gameLevel = addLevel(map, config);
    const player = add([
        sprite('player'),
        solid(),
        pos(30, 0),
        body(),
        origin('bot')
    ]);

    player.on('headbump', obj => {
        if (obj.is('coin-surprise')) {
            gameLevel.spawn('$', obj.gridPos.sub(0, 1));
            destroy(obj);
            gameLevel.spawn('+', obj.gridPos.sub(0, 0));
        }
    });

    keyDown('left', () => player.move(-MOVE_SPEED, 0));
    keyDown('right', () => player.move(MOVE_SPEED, 0));
    keyPress('space', () => {
        if (player.grounded()) {
            player.jump(JUMP_FORCE);
        }
    });
});

start('game');
