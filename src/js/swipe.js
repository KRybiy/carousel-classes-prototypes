import Carousel from "./carousel.js";

class SwipeCarousel extends Carousel {
  constructor(...args) {
    super(...args);
  }

  _initListeners() {
    super._initListeners(); 
    
    document.addEventListener('touchstart', this._swipeStartHandler.bind(this));
    document.addEventListener('touchend', this._swipeEndHandler.bind(this));
    document.addEventListener('mousedown', this._swipeStartHandler.bind(this));
    document.addEventListener('mouseup', this._swipeEndHandler.bind(this));
    document.addEventListener('mousemove', this._swipeMoveHandler.bind(this));
  }

  _isTouchEvent(e) {
    return e.type.startsWith('touch');
  }

  _getEventX(e) {
    return this._isTouchEvent(e) ? e.changedTouches[0].pageX : e.pageX;
  }

  _swipeStartHandler(e) {
    if (!this._isTouchEvent(e) && e.button !== 0) return;
    if (this.isSwiping) return;

    this.startPosX = this._getEventX(e);
    this.isSwiping = true;
  }

  _swipeEndHandler(e) {
    if (!this.isSwiping) return;

    const target = e.target || e.srcElement;
    const withinContainer = this.slidesContainer.contains(target);

    if (withinContainer) {
      this.endPosX = this._getEventX(e);
      this.isSwiping = false;

      const diffX = this.endPosX - this.startPosX;

      if (Math.abs(diffX) > 100) {
        if (diffX > 0) {
          this.prevHandler();
        } else {
          this.nextHandler();
        }
      }
    }
  }

  _swipeMoveHandler(e) {
    if (!this.isSwiping) return;
    e.preventDefault(); 
  }

  init() {
    super.init(); 
    this._initListeners(); 
  }
}

export default SwipeCarousel;
