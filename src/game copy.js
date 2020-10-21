export default function createGame(height,width){
    const state = {
        tetriminos:{},
        currentTetriminoId: null,
        height: height,
        width : width,
        time_round  : 250,
        list_shapes :['I','O','T','S','Z','J','L']
    }
    
    const observers = []

    function start(){
        AddShape(state.list_shapes[Math.floor(Math.random() * 7)])
        setInterval(PassRound, state.time_round);
    }

    function PassRound(){
        if(state.currentTetriminoId){
            const moved = MoveDown(state.currentTetriminoId)

            if( !moved ){
                AddShape(state.list_shapes[Math.floor(Math.random() * 7)])
            }
        }
    }

    
    function AddShape(type){
        const shape = {
            color : '#0000ff',
            type  : type,
            degrees : 0,
            blocks: []
        }

        function CreateBlock(positionX,positionY){
            return {'x':positionX,'y':positionY}
        }

        const acceptedShapes = {
            'I' : () => {
                let leftBlock           = CreateBlock(state.width/2 - 2, 0);
                let middleLeftBlock     = CreateBlock(state.width/2 - 1, 0);
                let middleRightBlock    = CreateBlock(state.width/2    , 0);
                let rightBlock          = CreateBlock(state.width/2 + 1, 0);
                shape.blocks = [leftBlock,middleLeftBlock,middleRightBlock,rightBlock]
                shape.color  = '#0000ff'
                shape.degrees = 0
            },
            'O' : () =>{
                let topLeftBlock        = CreateBlock(state.width/2,-1);
                let topRightBlock       = CreateBlock(state.width/2 + 1,-1);
                let bottomLeftBlock     = CreateBlock(state.width/2,0);
                let bottomRightBlock    = CreateBlock(state.width/2 + 1,0);
                shape.blocks = [topLeftBlock,topRightBlock,bottomLeftBlock,bottomRightBlock]
                shape.color  = '#00ff00'
            },
            'T' : () =>{
                let topBlock      = CreateBlock(state.width/2    , -1);
                let leftBlock     = CreateBlock(state.width/2 - 1,  0);
                let middleBlock   = CreateBlock(state.width/2    ,  0);
                let rightBlock    = CreateBlock(state.width/2 + 1,  0);
                shape.blocks = [topBlock,leftBlock,middleBlock,rightBlock]
                shape.color  = '#ff0000'
            },
            'S' : () =>{
                let block_1_0     = CreateBlock(state.width/2    , -1);
                let block_2_0     = CreateBlock(state.width/2 + 1, -1);
                let block_0_1     = CreateBlock(state.width/2 - 1,  0);
                let block_1_1     = CreateBlock(state.width/2    ,  0);
                shape.blocks = [block_1_1,block_1_0,block_2_0,block_0_1]
                shape.color  = '#00ffff'
            },
            'Z' : () =>{
                let block_0_0     = CreateBlock(state.width/2 - 1, -1);
                let block_1_0     = CreateBlock(state.width/2    , -1);
                let block_1_1     = CreateBlock(state.width/2    ,  0);
                let block_2_1     = CreateBlock(state.width/2 + 1,  0);
                shape.blocks = [block_0_0,block_1_0,block_1_1,block_2_1]
                shape.color  = '#ffff00'
            },
            'J' : () =>{
                let block_0_0     = CreateBlock(state.width/2 - 1, -1);
                let block_0_1     = CreateBlock(state.width/2 - 1,  0);
                let block_1_1     = CreateBlock(state.width/2    ,  0);
                let block_2_1     = CreateBlock(state.width/2 + 1,  0);
                shape.blocks = [block_1_1,block_0_0,block_0_1,block_2_1]
                shape.color  = '#ff00ff'
            },
            'L' : () =>{
                let block_2_0     = CreateBlock(state.width/2 + 1, -1);
                let block_0_1     = CreateBlock(state.width/2 - 1,  0);
                let block_1_1     = CreateBlock(state.width/2    ,  0);
                let block_2_1     = CreateBlock(state.width/2 + 1,  0);
                shape.blocks = [block_1_1,block_2_0,block_0_1,block_2_1]
                shape.color  = '#ed58d4'
            },
        }

        const moveDown = {
            'I' : () =>{
                // bottomBlock = shape.blocks.filter()
                //Talvez usar matriz seja uma ideia muito muito muito melhor, 
                // sendo 0 = vazio, 1 = shape, 2 = outro shape e assim por diante
            }
        }

        const createShape = acceptedShapes[type];

        if(createShape){
            createShape();
            let id = Math.random().toString(36).substr(2, 9)
            console.log('Id da nova peça : '+id)
            state.tetriminos[id] = shape;

            state.currentTetriminoId = id
        }
        
    }

    
    function MoveDown(tetriminoId){
        const tetriminoFalling = state.tetriminos[tetriminoId]

        if ( CheckIfTetriminoCanMoveDown(tetriminoId) ){
            // console.log('Moving Tetrimino '+tetriminoId+' down')
            state.tetriminos[tetriminoId].blocks.forEach( (block,index) => {
                state.tetriminos[tetriminoId].blocks[index].y = block.y + 1;
            })
            return true
        }else{
            return false
        }
    }
    
    function MoveTetrimino(command){
        const acceptedMoves = {  
            Z(tetriminoId){
                RotateTetrimino(tetriminoId)
            },
            z(tetriminoId){
                RotateTetrimino(tetriminoId)
            },
            ArrowRight(tetriminoId) {
                let canMove = true
                for(const tetriminoKey in state.tetriminos){
                    if(tetriminoKey !== tetriminoId){
                        const tetrimino = state.tetriminos[tetriminoKey]
                        state.tetriminos[tetriminoId].blocks.forEach( (blockTetriminoMoving,index) => {
                            tetrimino.blocks.forEach( (blockTetrimino) => {
                                if(! BlockCanMoveRight(blockTetriminoMoving,blockTetrimino)){
                                    console.log("Cannot move Right")
                                    canMove = false
                                }
                            })
                        })
                    }else{  
                        state.tetriminos[tetriminoId].blocks.forEach( (blockTetriminoMoving,index) => {    
                            if(blockTetriminoMoving.x + 1 >= 10){
                                canMove = false
                            }
                        }) 
                    }
                }
                if(canMove){
                    state.tetriminos[tetriminoId].blocks.forEach( (blockTetriminoMoving,index) => {
                        blockTetriminoMoving.x += 1;
                    })
                }else{
                    return false
                }
            },
            ArrowDown(tetriminoId) {
                let canMove = true
                for(const tetriminoKey in state.tetriminos){
                    if(tetriminoKey !== tetriminoId){
                        const tetrimino = state.tetriminos[tetriminoKey]
                        state.tetriminos[tetriminoId].blocks.forEach( (blockTetriminoMoving,index) => {
                            tetrimino.blocks.forEach( (blockTetrimino) => {
                                if(! BlockCanMoveDown(blockTetriminoMoving,blockTetrimino)){
                                    console.log("Cannot move Down")
                                    canMove = false
                                }
                            })
                        })
                    }else{
                        state.tetriminos[tetriminoId].blocks.forEach( (blockTetriminoMoving,index) => {
                            if(blockTetriminoMoving.y + 1 >= 20){
                                canMove = false
                            }
                        }) 
                    }
                }
                if(canMove){
                    state.tetriminos[tetriminoId].blocks.forEach( (blockTetriminoMoving,index) => {
                        blockTetriminoMoving.y += 1;
                    })
                }else{
                    return false
                }
            },
            ArrowLeft(tetriminoId) {
                let canMove = true
                for(const tetriminoKey in state.tetriminos){
                    if(tetriminoKey !== tetriminoId){
                        const tetrimino = state.tetriminos[tetriminoKey]
                        state.tetriminos[tetriminoId].blocks.forEach( (blockTetriminoMoving,index) => {
                            tetrimino.blocks.forEach( (blockTetrimino) => {
                                if(! BlockCanMoveLeft(blockTetriminoMoving,blockTetrimino)){
                                    console.log("Cannot move Left")
                                    canMove = false
                                }
                            })
                        })
                    }else{
                        state.tetriminos[tetriminoId].blocks.forEach( (blockTetriminoMoving,index) => {
                            if(blockTetriminoMoving.x - 1 < 0){
                                canMove = false
                            }
                        }) 
                    }
                }
                if(canMove){
                    state.tetriminos[tetriminoId].blocks.forEach( (blockTetriminoMoving,index) => {
                        blockTetriminoMoving.x -= 1;
                    })
                }else{
                    return false
                }
            }
        }

        function BlockCanMoveLeft(blockTetriminoMoving, blockTetrimino){
            if( (blockTetriminoMoving.y === blockTetrimino.y) && (blockTetriminoMoving.x - 1 === blockTetrimino.x) ){
                return false
            }
            return true
        }
        function BlockCanMoveRight(blockTetriminoMoving, blockTetrimino){
            if( (blockTetriminoMoving.y === blockTetrimino.y) && (blockTetriminoMoving.x + 1 === blockTetrimino.x) ){
                return false
            }
            return true
        }
        function BlockCanMoveDown(blockTetriminoMoving, blockTetrimino){
            if( (blockTetriminoMoving.x === blockTetrimino.x) && (blockTetriminoMoving.y + 1 === blockTetrimino.y) ){
                return false
            }
            return true
        }
        console.log(command)
        const keyPressed   = command.keyPressed
        const tetriminoId  = state.currentTetriminoId
        const tetrimino    = state.tetriminos[tetriminoId]
        const moveFunction = acceptedMoves[keyPressed]

        if (tetrimino && moveFunction) {
            moveFunction(tetriminoId)
        }
    }

    function CheckIfTetriminoCanMoveDown(tetriminoId){
        const tetriminoFalling = state.tetriminos[tetriminoId]

        let canTetriminoCanMoveDown = true

        tetriminoFalling.blocks.forEach( (blockTetriminoFalling,index) => {
            if(blockTetriminoFalling.y + 1 > 19){
                console.log('Tetrimino '+tetriminoId+' cannot move down')
                canTetriminoCanMoveDown =  false;
            }
            else{
                // console.log('Tetrimino '+tetriminoId+' can move down')
            }
        })

        for(const tetriminoKey in state.tetriminos){
            if(tetriminoKey !== tetriminoId){
                const tetrimino = state.tetriminos[tetriminoKey]
                tetriminoFalling.blocks.forEach( (blockTetriminoFalling,index) => {
                    tetrimino.blocks.forEach( (blockTetrimino) => {
                        if(blockTetrimino.y === blockTetriminoFalling.y + 1 && blockTetrimino.x === blockTetriminoFalling.x ){
                            canTetriminoCanMoveDown = false;
                        } 
                    })
                })
            }
        }
        return canTetriminoCanMoveDown;
    }
    
    function RotateTetrimino(tetriminoId){

            
        function CreateBlock(positionX,positionY){
            return {'x':positionX,'y':positionY}
        }

        function BlocksHasValidPosition(blocksNewPosition){

            let canTetriminoCanMove = true
            
            blocksNewPosition.forEach( (blockNewPosition,index) => {
                if(blockNewPosition.x > 9 || blockNewPosition.x < 0 || blockNewPosition.y > 19){
                    canTetriminoCanMove = false
                    // break
                } 
            })

            for(const tetriminoKey in state.tetriminos){
                if(tetriminoKey !== tetriminoId){
                    const tetrimino = state.tetriminos[tetriminoKey]
                    tetrimino.blocks.forEach( (blockTetrimino) => {
                        blocksNewPosition.forEach( (blockNewPosition,index) => {
                            if(blockTetrimino.y === blockNewPosition.y && blockTetrimino.x === blockNewPosition.x ){
                                canTetriminoCanMove = false
                                // break
                            } 
                        })
                    })
                }
            }
            return canTetriminoCanMove
        }

        const acceptedShapes = {
            'I' : (tetriminoId) => {
                let topBlock,middleTopBlock,middleBottomBlock,bottomBlock,leftBlock,middleLeftBlock,middleRightBlock,rightBlock
                let newBlocks = []
                switch(tetrimino.degrees){
                    case 0:
                        leftBlock = tetrimino.blocks[0]

                        topBlock            = CreateBlock(leftBlock.x + 2, leftBlock.y - 1)
                        middleTopBlock      = CreateBlock(leftBlock.x + 2, leftBlock.y    )
                        middleBottomBlock   = CreateBlock(leftBlock.x + 2, leftBlock.y + 1)
                        bottomBlock         = CreateBlock(leftBlock.x + 2, leftBlock.y + 2)

                        newBlocks = [topBlock,middleTopBlock,middleBottomBlock,bottomBlock]

                        if(BlocksHasValidPosition (newBlocks)){
                            state.tetriminos[tetriminoId].blocks = newBlocks
                            state.tetriminos[tetriminoId].degrees = 90
                        }
                        break;
                    case 90:
                        topBlock = tetrimino.blocks[0]
                        
                        leftBlock          = CreateBlock(topBlock.x - 2, topBlock.y + 2)
                        middleLeftBlock    = CreateBlock(topBlock.x    , topBlock.y + 2)
                        middleRightBlock   = CreateBlock(topBlock.x - 1, topBlock.y + 2)
                        rightBlock         = CreateBlock(topBlock.x + 1, topBlock.y + 2)

                        newBlocks = [leftBlock,middleLeftBlock,middleRightBlock,rightBlock]

                        if(BlocksHasValidPosition (newBlocks)){
                            state.tetriminos[tetriminoId].blocks = newBlocks
                            state.tetriminos[tetriminoId].degrees = 180
                        }
                        break;
                    case 180:
                        leftBlock = tetrimino.blocks[0]

                        topBlock            = CreateBlock(leftBlock.x + 1, leftBlock.y - 2)
                        middleTopBlock      = CreateBlock(leftBlock.x + 1, leftBlock.y - 1)
                        middleBottomBlock   = CreateBlock(leftBlock.x + 1, leftBlock.y    )
                        bottomBlock         = CreateBlock(leftBlock.x + 1, leftBlock.y + 1)

                        newBlocks = [topBlock,middleTopBlock,middleBottomBlock,bottomBlock]

                        if(BlocksHasValidPosition (newBlocks)){
                            state.tetriminos[tetriminoId].blocks = newBlocks
                            state.tetriminos[tetriminoId].degrees = 270
                        }
                        break;
                    case 270:
                        topBlock = tetrimino.blocks[0]

                        leftBlock            = CreateBlock(topBlock.x - 1, topBlock.y + 1)
                        middleLeftBlock      = CreateBlock(topBlock.x    , topBlock.y + 1)
                        middleRightBlock     = CreateBlock(topBlock.x + 1, topBlock.y + 1)
                        rightBlock           = CreateBlock(topBlock.x + 2, topBlock.y + 1)

                        newBlocks = [leftBlock,middleLeftBlock,middleRightBlock,rightBlock]

                        if(BlocksHasValidPosition (newBlocks)){
                            state.tetriminos[tetriminoId].blocks = newBlocks
                            state.tetriminos[tetriminoId].degrees = 0
                        }
                        break;
                }
            },
            'O' : () =>{
                //Rotação do O não altera nada
            },
            'T' : () =>{
                let topBlock,leftBlock,middleBlock,rightBlock,bottomBlock
                let newBlocks = []
                switch(tetrimino.degrees){
                    case 0:
                        topBlock    = tetrimino.blocks[0]
                        middleBlock = tetrimino.blocks[2]
                        rightBlock  = tetrimino.blocks[3]

                        bottomBlock    = CreateBlock(middleBlock.x, middleBlock.y + 1)

                        newBlocks = [topBlock,middleBlock,rightBlock,bottomBlock]

                        if(BlocksHasValidPosition (newBlocks)){
                            state.tetriminos[tetriminoId].blocks = newBlocks
                            state.tetriminos[tetriminoId].degrees = 90
                        }
                        break
                    case 90:
                        middleBlock = tetrimino.blocks[1]
                        rightBlock  = tetrimino.blocks[2]
                        bottomBlock  = tetrimino.blocks[3]

                        leftBlock    = CreateBlock(middleBlock.x -1, middleBlock.y)

                        newBlocks = [leftBlock,middleBlock,rightBlock,bottomBlock]

                        if(BlocksHasValidPosition (newBlocks)){
                            state.tetriminos[tetriminoId].blocks = newBlocks
                            state.tetriminos[tetriminoId].degrees = 180
                        }
                        break
                    case 180:
                        leftBlock    = tetrimino.blocks[0]
                        middleBlock  = tetrimino.blocks[1]
                        bottomBlock  = tetrimino.blocks[3]

                        topBlock    = CreateBlock(middleBlock.x , middleBlock.y - 1)

                        newBlocks = [topBlock,leftBlock,middleBlock,bottomBlock]

                        if(BlocksHasValidPosition (newBlocks)){
                            state.tetriminos[tetriminoId].blocks = newBlocks
                            state.tetriminos[tetriminoId].degrees = 270
                        }
                        break
                    case 270:
                        topBlock     = tetrimino.blocks[0]
                        leftBlock    = tetrimino.blocks[1]
                        middleBlock  = tetrimino.blocks[2]

                        rightBlock    = CreateBlock(middleBlock.x + 1, middleBlock.y)

                        newBlocks = [topBlock,leftBlock,middleBlock,rightBlock]

                        if(BlocksHasValidPosition (newBlocks)){
                            state.tetriminos[tetriminoId].blocks = newBlocks
                            state.tetriminos[tetriminoId].degrees = 0
                        }
                        break
                }
            },
            'S' : () =>{
                let block_0_0,block_1_0,block_2_0,block_0_1,block_1_1,block_2_1,block_0_2,block_1_2,block_2_2
                let newBlocks = []
                switch(tetrimino.degrees){
                    case 0:
                        block_1_1 = tetrimino.blocks[0]

                        block_1_0      = CreateBlock(block_1_1.x    , block_1_1.y - 1)
                        block_2_1      = CreateBlock(block_1_1.x + 1, block_1_1.y    )
                        block_2_2      = CreateBlock(block_1_1.x + 1, block_1_1.y + 1)

                        newBlocks = [block_1_1,block_1_0,block_2_1,block_2_2]

                        if(BlocksHasValidPosition (newBlocks)){
                            state.tetriminos[tetriminoId].blocks = newBlocks
                            state.tetriminos[tetriminoId].degrees = 90
                        }
                        break
                    case 90:
                        block_1_1 = tetrimino.blocks[0]

                        block_2_1      = CreateBlock(block_1_1.x + 1, block_1_1.y    )
                        block_0_2      = CreateBlock(block_1_1.x - 1, block_1_1.y + 1)
                        block_1_2      = CreateBlock(block_1_1.x    , block_1_1.y + 1)

                        newBlocks = [block_1_1,block_2_1,block_0_2,block_1_2]

                        if(BlocksHasValidPosition (newBlocks)){
                            state.tetriminos[tetriminoId].blocks = newBlocks
                            state.tetriminos[tetriminoId].degrees = 180
                        } 
                        break
                    case 180:
                        block_1_1 = tetrimino.blocks[0]

                        block_0_0      = CreateBlock(block_1_1.x - 1, block_1_1.y - 1)
                        block_0_1      = CreateBlock(block_1_1.x - 1, block_1_1.y    )
                        block_1_2      = CreateBlock(block_1_1.x    , block_1_1.y + 1)

                        newBlocks = [block_1_1,block_0_0,block_0_1,block_1_2]

                        if(BlocksHasValidPosition (newBlocks)){
                            state.tetriminos[tetriminoId].blocks = newBlocks
                            state.tetriminos[tetriminoId].degrees = 270
                        } 
                        break
                    case 270:
                        block_1_1 = tetrimino.blocks[0]

                        block_1_0      = CreateBlock(block_1_1.x    , block_1_1.y - 1)
                        block_2_0      = CreateBlock(block_1_1.x + 1, block_1_1.y - 1)
                        block_0_1      = CreateBlock(block_1_1.x - 1, block_1_1.y    )

                        newBlocks = [block_1_1,block_1_0,block_2_0,block_0_1]

                        if(BlocksHasValidPosition (newBlocks)){
                            state.tetriminos[tetriminoId].blocks = newBlocks
                            state.tetriminos[tetriminoId].degrees = 0
                        } 
                        break
                }
            },
            'Z' : () =>{
                let block_0_0,block_1_0,block_2_0,block_0_1,block_1_1,block_2_1,block_0_2,block_1_2,block_2_2
                let newBlocks = []
                switch(tetrimino.degrees){
                    case 0:
                        block_1_1 = tetrimino.blocks[0]

                        block_2_0      = CreateBlock(block_1_1.x + 1, block_1_1.y - 1)
                        block_2_1      = CreateBlock(block_1_1.x + 1, block_1_1.y    )
                        block_1_2      = CreateBlock(block_1_1.x    , block_1_1.y + 1)

                        newBlocks = [block_1_1,block_2_0,block_2_1,block_1_2]

                        if(BlocksHasValidPosition (newBlocks)){
                            state.tetriminos[tetriminoId].blocks = newBlocks
                            state.tetriminos[tetriminoId].degrees = 90
                        }
                        break
                    case 90:
                        block_1_1 = tetrimino.blocks[0]

                        block_0_1      = CreateBlock(block_1_1.x - 1, block_1_1.y    )
                        block_1_2      = CreateBlock(block_1_1.x    , block_1_1.y + 1)
                        block_2_2      = CreateBlock(block_1_1.x + 1, block_1_1.y + 1)

                        newBlocks = [block_1_1,block_0_1,block_1_2,block_2_2]

                        if(BlocksHasValidPosition (newBlocks)){
                            state.tetriminos[tetriminoId].blocks = newBlocks
                            state.tetriminos[tetriminoId].degrees = 180
                        }
                        break
                    case 180:
                        block_1_1 = tetrimino.blocks[0]

                        block_1_0      = CreateBlock(block_1_1.x    , block_1_1.y - 1)
                        block_0_1      = CreateBlock(block_1_1.x - 1, block_1_1.y    )
                        block_0_2      = CreateBlock(block_1_1.x - 1, block_1_1.y + 1)

                        newBlocks = [block_1_1,block_1_0,block_0_1,block_0_2]

                        if(BlocksHasValidPosition (newBlocks)){
                            state.tetriminos[tetriminoId].blocks = newBlocks
                            state.tetriminos[tetriminoId].degrees = 270
                        }
                        break
                    case 270:
                        block_1_1 = tetrimino.blocks[0]

                        block_0_0      = CreateBlock(block_1_1.x - 1, block_1_1.y - 1)
                        block_1_0      = CreateBlock(block_1_1.x    , block_1_1.y - 1)
                        block_2_1      = CreateBlock(block_1_1.x + 1, block_1_1.y    )

                        newBlocks =  [block_1_1,block_0_0,block_1_0,block_2_1]

                        if(BlocksHasValidPosition (newBlocks)){
                            state.tetriminos[tetriminoId].blocks = newBlocks
                            state.tetriminos[tetriminoId].degrees = 0
                        }
                        break
                }
            },
            'J' : () =>{
                let block_0_0,block_1_0,block_2_0,block_0_1,block_1_1,block_2_1,block_0_2,block_1_2,block_2_2
                let newBlocks = []
                switch(tetrimino.degrees){
                    case 0:
                        block_1_1 = tetrimino.blocks[0]

                        block_1_0      = CreateBlock(block_1_1.x    , block_1_1.y - 1)
                        block_2_0      = CreateBlock(block_1_1.x + 1, block_1_1.y - 1)
                        block_1_2      = CreateBlock(block_1_1.x    , block_1_1.y + 1)

                        newBlocks =  [block_1_1,block_1_0,block_2_0,block_1_2]

                        if(BlocksHasValidPosition (newBlocks)){
                            state.tetriminos[tetriminoId].blocks = newBlocks
                            state.tetriminos[tetriminoId].degrees = 90
                        }
                        break
                    case 90:
                        block_1_1 = tetrimino.blocks[0]

                        block_0_1      = CreateBlock(block_1_1.x - 1, block_1_1.y    )
                        block_2_1      = CreateBlock(block_1_1.x + 1, block_1_1.y    )
                        block_2_2      = CreateBlock(block_1_1.x + 1, block_1_1.y + 1)

                        newBlocks =  [block_1_1,block_0_1,block_2_1,block_2_2]

                        if(BlocksHasValidPosition (newBlocks)){
                            state.tetriminos[tetriminoId].blocks = newBlocks
                            state.tetriminos[tetriminoId].degrees = 180
                        }
                        break
                    case 180:
                        block_1_1 = tetrimino.blocks[0]

                        block_1_0      = CreateBlock(block_1_1.x    , block_1_1.y - 1)
                        block_0_2      = CreateBlock(block_1_1.x - 1, block_1_1.y + 1)
                        block_1_2      = CreateBlock(block_1_1.x    , block_1_1.y + 1)

                        newBlocks =  [block_1_1,block_1_0,block_0_2,block_1_2]

                        if(BlocksHasValidPosition (newBlocks)){
                            state.tetriminos[tetriminoId].blocks = newBlocks
                            state.tetriminos[tetriminoId].degrees = 270
                        }
                        break
                    case 270:
                        block_1_1 = tetrimino.blocks[0]

                        block_0_0      = CreateBlock(block_1_1.x - 1, block_1_1.y - 1)
                        block_0_1      = CreateBlock(block_1_1.x - 1, block_1_1.y    )
                        block_2_1      = CreateBlock(block_1_1.x + 1, block_1_1.y    )

                        newBlocks =  [block_1_1,block_0_0,block_0_1,block_2_1]

                        if(BlocksHasValidPosition (newBlocks)){
                            state.tetriminos[tetriminoId].blocks = newBlocks
                            state.tetriminos[tetriminoId].degrees = 0
                        }
                        break
                }
            },
            'L' : () =>{
                let block_0_0,block_1_0,block_2_0,block_0_1,block_1_1,block_2_1,block_0_2,block_1_2,block_2_2
                let newBlocks = []
                switch(tetrimino.degrees){
                    case 0:
                        block_1_1 = tetrimino.blocks[0]

                        block_1_0      = CreateBlock(block_1_1.x    , block_1_1.y - 1)
                        block_1_2      = CreateBlock(block_1_1.x    , block_1_1.y + 1)
                        block_2_2      = CreateBlock(block_1_1.x + 1, block_1_1.y + 1)

                        newBlocks =  [block_1_1,block_1_0,block_1_2,block_2_2]

                        if(BlocksHasValidPosition (newBlocks)){
                            state.tetriminos[tetriminoId].blocks = newBlocks
                            state.tetriminos[tetriminoId].degrees = 90
                        }
                        break
                    case 90:
                        block_1_1 = tetrimino.blocks[0]

                        block_0_1      = CreateBlock(block_1_1.x - 1, block_1_1.y    )
                        block_2_1      = CreateBlock(block_1_1.x + 1, block_1_1.y    )
                        block_0_2      = CreateBlock(block_1_1.x - 1, block_1_1.y + 1)

                        newBlocks =  [block_1_1,block_0_1,block_2_1,block_0_2]

                        if(BlocksHasValidPosition (newBlocks)){
                            state.tetriminos[tetriminoId].blocks = newBlocks
                            state.tetriminos[tetriminoId].degrees = 180
                        }
                        break
                    case 180:
                        block_1_1 = tetrimino.blocks[0]

                        block_0_0      = CreateBlock(block_1_1.x - 1, block_1_1.y - 1)
                        block_1_0      = CreateBlock(block_1_1.x    , block_1_1.y - 1)
                        block_1_2      = CreateBlock(block_1_1.x    , block_1_1.y + 1)

                        newBlocks =  [block_1_1,block_0_0,block_1_0,block_1_2]

                        if(BlocksHasValidPosition (newBlocks)){
                            state.tetriminos[tetriminoId].blocks = newBlocks
                            state.tetriminos[tetriminoId].degrees = 270
                        }
                        break
                    case 270:
                        block_1_1 = tetrimino.blocks[0]

                        block_0_1      = CreateBlock(block_1_1.x - 1, block_1_1.y    )
                        block_2_0      = CreateBlock(block_1_1.x + 1, block_1_1.y - 1)
                        block_2_1      = CreateBlock(block_1_1.x + 1, block_1_1.y    )

                        newBlocks =  [block_1_1,block_0_1,block_2_0,block_2_1]

                        if(BlocksHasValidPosition (newBlocks)){
                            state.tetriminos[tetriminoId].blocks = newBlocks
                            state.tetriminos[tetriminoId].degrees = 0
                        }
                        break
                }
            },
        }

        const tetrimino = state.tetriminos[tetriminoId]
        const rotateTetrimino = acceptedShapes[tetrimino.type]

        if(tetrimino && rotateTetrimino){
            return rotateTetrimino(tetriminoId)
        }

        return null
    }


    return {
        state,
        start,
        AddShape,
        MoveDown,
        MoveTetrimino
    }

}