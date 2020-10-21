export default function createGame(height,width){
    const state = {
        tetriminos:{},
        currentTetriminoId: null,
        height: height,
        width : width,
        time_round  : 250,
        list_shapes :['I','O','T','S','Z','J','L']
        // list_shapes :['I']
    }
    
    const observers = []

    function start(){
        AddShape(state.list_shapes[Math.floor(Math.random() * state.list_shapes.length )])
        setInterval(PassRound, state.time_round);
    }

    function restart(){
        state.tetriminos = {}
        state.currentTetriminoId = null
    }

    function PassRound(){
        if(state.currentTetriminoId){
            const moved = MoveDown(state.currentTetriminoId)

            if( !moved ){

                CheckLines()

                AddShape(state.list_shapes[Math.floor(Math.random() * state.list_shapes.length )])
            }
        }
    }

    function CheckLines(){
        let allBlocks  = []
        //Create Array with all Blocks
        for(const tetrimino in state.tetriminos){
            state.tetriminos[tetrimino].blocks.forEach( (block) =>{
                allBlocks.push(block)
            })
        }

        //Check if is Game Over
        let AllBlocksOnArray = allBlocks.map( (block) => block.x + '-' + block.y )
        let isDuplicate = AllBlocksOnArray.some(function(item, index){ 
            return AllBlocksOnArray.indexOf(item) != index 
        });
        if(isDuplicate){
            alert("GAME OVER")
            restart()
        }

        //Check if there is Lines to Clean
        for(const row of Array(state.height).keys()){
            let blockInRow = allBlocks.filter( (block) => {
                if(block.y === row){
                    return true
                }
                return null
            })
            let colInRow = blockInRow.map( (block) => block.x)
            
            let clearLine = true
            for(const col of Array(state.width).keys()){
                // console.log(colInRow.indexOf(col))
                if(colInRow.indexOf(col) === -1){
                    clearLine = false
                }
            }
            if(clearLine){
                console.log("Limpar a Linha : "+row)
                clearRow(row)
            }
        }

        function clearRow(row){

            //Clear Row
            for(const tetrimino in state.tetriminos){
                let newBlocks = state.tetriminos[tetrimino].blocks.filter( (block) => {
                    if(block.y === row){
                        return false
                    }
                    return true
                })
                if( newBlocks.length === 0){
                    delete state.tetriminos[tetrimino]
                }else{
                    state.tetriminos[tetrimino].blocks = newBlocks
                }
            }
            
            //Move Down Tetriminos blocks that are above the line
            for(const tetrimino in state.tetriminos){
                state.tetriminos[tetrimino].blocks.forEach( (block) => {
                    if(block.y < row){
                        block.y += 1
                    }
                })
            }
        }

    }

    function CreateBlock(positionX,positionY){
        return {'x':positionX,'y':positionY}
    }
    
    function AddShape(type){
        const shape = {
            color : '#0000ff',
            type  : type,
            degrees : 0,
            blocks: []
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
                shape.color  = '#f5841b'
            },
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
        const tetrimino = state.tetriminos[tetriminoId]

        function blocksCanMoveDown(){
            let blocks = state.tetriminos[tetriminoId].blocks
            let newBlocks = []   
            let auxBlock  = {}
            blocks.forEach( (blockTetriminoMoving,index) => { 
                auxBlock  = {}
                Object.assign(auxBlock, blockTetriminoMoving)
                auxBlock.y += 1
                newBlocks.push(auxBlock)
            })
    
            let canMove = BlocksHasValidPosition(newBlocks,tetriminoId)
    
            return canMove
        }
        if ( tetrimino && blocksCanMoveDown() ){
            state.tetriminos[tetriminoId].blocks.forEach( (block,index) => {
                state.tetriminos[tetriminoId].blocks[index].y = block.y + 1;
            })
            return true
        }
        return false
    }
    function MoveLeft(tetriminoId){
        const tetrimino = state.tetriminos[tetriminoId]

        function blocksCanMoveLeft(){     
            let blocks = state.tetriminos[tetriminoId].blocks 
            let newBlocks = []   
            let auxBlock  = {}
            blocks.forEach( (blockTetriminoMoving,index) => { 
                auxBlock  = {}
                Object.assign(auxBlock, blockTetriminoMoving)
                auxBlock.x -= 1
                newBlocks.push(auxBlock)
            })
    
            let canMove = BlocksHasValidPosition(newBlocks,tetriminoId)
    
            return canMove
        }

        if ( tetrimino && blocksCanMoveLeft()){
            state.tetriminos[tetriminoId].blocks.forEach( (block,index) => {
                state.tetriminos[tetriminoId].blocks[index].x = block.x - 1;
            })
            return true
        }
        return false
    }
    function MoveRight(tetriminoId){
        const tetrimino = state.tetriminos[tetriminoId] 

        function blocksCanMoveRight(){
            let blocks = state.tetriminos[tetriminoId].blocks
            let newBlocks = []   
            let auxBlock  = {}
            blocks.forEach( (blockTetriminoMoving,index) => {
                auxBlock  = {}
                Object.assign(auxBlock, blockTetriminoMoving)
                auxBlock.x += 1
                newBlocks.push(auxBlock)
            })
    
            let canMove = BlocksHasValidPosition(newBlocks,tetriminoId)
    
            return canMove
        }

        if ( tetrimino && blocksCanMoveRight() ){
            state.tetriminos[tetriminoId].blocks.forEach( (block,index) => {
                state.tetriminos[tetriminoId].blocks[index].x = block.x + 1;
            })
            return true
        }
        return false
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
                MoveRight(tetriminoId)
            },
            ArrowDown(tetriminoId) {
                MoveDown(tetriminoId)
            },
            ArrowLeft(tetriminoId) {
                MoveLeft(tetriminoId)
            }
        }

        const keyPressed   = command.keyPressed
        const tetriminoId  = state.currentTetriminoId
        const tetrimino    = state.tetriminos[tetriminoId]
        const moveFunction = acceptedMoves[keyPressed]

        if (tetrimino && moveFunction) {
            moveFunction(tetriminoId)
        }
    }

    function BlocksHasValidPosition(blocksNewPosition,tetriminoId){

        let hasValidPosition = true
        
        blocksNewPosition.forEach( (blockNewPosition,index) => {
            if(blockNewPosition.x >= state.width || blockNewPosition.x < 0 || blockNewPosition.y >= state.height){
                hasValidPosition = false
                // break
            } 
        })

        for(const tetriminoKey in state.tetriminos){
            if(tetriminoKey !== tetriminoId){
                const tetrimino = state.tetriminos[tetriminoKey]
                tetrimino.blocks.forEach( (blockTetrimino) => {
                    blocksNewPosition.forEach( (blockNewPosition,index) => {
                        if(blockTetrimino.y === blockNewPosition.y && blockTetrimino.x === blockNewPosition.x ){
                            hasValidPosition = false
                            // break
                        } 
                    })
                })
            }
        }
        return hasValidPosition
    }
    
    function RotateTetrimino(tetriminoId){

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

                        if(BlocksHasValidPosition (newBlocks, tetriminoId)){
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

                        if(BlocksHasValidPosition (newBlocks, tetriminoId)){
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

                        if(BlocksHasValidPosition (newBlocks, tetriminoId)){
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

                        if(BlocksHasValidPosition (newBlocks, tetriminoId)){
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

                        if(BlocksHasValidPosition (newBlocks, tetriminoId)){
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

                        if(BlocksHasValidPosition (newBlocks, tetriminoId)){
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

                        if(BlocksHasValidPosition (newBlocks, tetriminoId)){
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

                        if(BlocksHasValidPosition (newBlocks, tetriminoId)){
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

                        if(BlocksHasValidPosition (newBlocks, tetriminoId)){
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

                        if(BlocksHasValidPosition (newBlocks, tetriminoId)){
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

                        if(BlocksHasValidPosition (newBlocks, tetriminoId)){
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

                        if(BlocksHasValidPosition (newBlocks, tetriminoId)){
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

                        if(BlocksHasValidPosition (newBlocks, tetriminoId)){
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

                        if(BlocksHasValidPosition (newBlocks, tetriminoId)){
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

                        if(BlocksHasValidPosition (newBlocks, tetriminoId)){
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

                        if(BlocksHasValidPosition (newBlocks, tetriminoId)){
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

                        if(BlocksHasValidPosition (newBlocks, tetriminoId)){
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

                        if(BlocksHasValidPosition (newBlocks, tetriminoId)){
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

                        if(BlocksHasValidPosition (newBlocks, tetriminoId)){
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

                        if(BlocksHasValidPosition (newBlocks, tetriminoId)){
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

                        if(BlocksHasValidPosition (newBlocks, tetriminoId)){
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

                        if(BlocksHasValidPosition (newBlocks, tetriminoId)){
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

                        if(BlocksHasValidPosition (newBlocks, tetriminoId)){
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

                        if(BlocksHasValidPosition (newBlocks, tetriminoId)){
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
            rotateTetrimino(tetriminoId)
        }
    }


    return {
        state,
        start,
        AddShape,
        MoveDown,
        MoveTetrimino
    }

}