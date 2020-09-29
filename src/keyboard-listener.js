export default function createKeyBoardListener(document){
    const state = {
        observers : []
    }

    function subscribe(observerFunction){
        state.observers.push(observerFunction)
    }

    function notifyAll(command){
        state.observers.forEach( (observerFunction) => {
            observerFunction(command)
        }) 
        // for(const observerFunction in state.observers){
        //     console.log(state.observers[observerFunction])
        //     console.log(observerFunction)
        //     observerFunction(command)
        // }
    }

    document.addEventListener('keydown', handleKeydown)

    function handleKeydown(event){
        const keyPressed = event.key
        
        const command = {
            type : 'move-tetrimino',
            keyPressed
        }

        notifyAll(command)
    }
    return {
        subscribe
    }

}