import Carousel from "./carousel.js";

function SwipeCarousel(params) {
  Carousel.call(this, params)
  }

  SwipeCarousel.prototype = Object.create(Carousel.prototype);
  SwipeCarousel.prototype.constructor = SwipeCarousel;

  SwipeCarousel.prototype._initProps = Carousel.prototype._initProps;
  
  SwipeCarousel.prototype._initListeners = function () {
    Carousel.prototype._initListeners.call(this);
    
    document.addEventListener('touchstart', this._swipeStartHandler.bind(this));
    document.addEventListener('touchend', this._swipeEndHandler.bind(this));
    document.addEventListener('mousedown', this._swipeStartHandler.bind(this));
    document.addEventListener('mouseup', this._swipeEndHandler.bind(this));
    document.addEventListener('mousemove', this._swipeMoveHandler.bind(this));
  }

  SwipeCarousel.prototype._isTouchEvent = function (e) {
    return e.type.startsWith('touch');
  }

  SwipeCarousel.prototype._getEventX = function (e) {
    return this._isTouchEvent(e) ? e.changedTouches[0].pageX : e.pageX;
  }

  SwipeCarousel.prototype._swipeStartHandler = function (e) {
    if (!this._isTouchEvent(e) && e.button !== 0) return;
    if (this.isSwiping) return;

    this.startPosX = this._getEventX(e);
    this.isSwiping = true;
  }

  SwipeCarousel.prototype._swipeEndHandler = function (e) {
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

  SwipeCarousel.prototype._swipeMoveHandler = function (e) {
    if (!this.isSwiping) return;
    e.preventDefault(); 
  }

  SwipeCarousel.prototype.init = function () {
    Carousel.prototype.init.call(this);
    this._initListeners(); 
  }

export default SwipeCarousel;
