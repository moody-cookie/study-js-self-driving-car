export default class Controls {
  constructor(type) {
    this.forward = false
    this.backward = false
    this.left = false
    this.right = false

    switch (type) {
      case 'KEYS':
        this.#addKeyboardListeners()
        break
      case 'DUMMY':
        this.forward = true
    }
  }

  #addKeyboardListeners() {
    window.addEventListener('keydown', (e) => {
      switch (e.code) {
        case 'ArrowLeft':
          this.left = true
          break
        case 'ArrowRight':
          this.right = true
          break
        case 'ArrowUp':
          this.forward = true
          break
        case 'ArrowDown':
          this.backward = true
          break
      }
    })
    window.addEventListener('keyup', (e) => {
      switch (e.code) {
        case 'ArrowLeft':
          this.left = false
          break
        case 'ArrowRight':
          this.right = false
          break
        case 'ArrowUp':
          this.forward = false
          break
        case 'ArrowDown':
          this.backward = false
          break
      }
    })
  }
}
