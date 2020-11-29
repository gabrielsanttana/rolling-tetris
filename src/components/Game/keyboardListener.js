export default function createKeyBoardListener(document) {
  const state = {
    observers: [],
  };

  function subscribe(observerFunction) {
    state.observers.push(observerFunction);
  }

  function notifyAll(command) {
    state.observers.forEach(observerFunction => {
      observerFunction(command);
    });
  }

  document.addEventListener('keydown', handleKeydown);

  function handleKeydown(event) {
    if ([32, 37, 38, 39, 40].indexOf(event.keyCode) > -1) {
      event.preventDefault();
    }

    const keyPressed = event.key;

    const command = {
      type: 'move-tetrimino',
      keyPressed,
    };

    notifyAll(command);
  }

  return {
    subscribe,
  };
}
