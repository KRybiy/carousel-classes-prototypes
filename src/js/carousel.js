class Carousel {
  constructor(params) {
    const config = this._initConfig(params);
    this.container = document.querySelector(config.containerId);
    this.slideItems = this.container.querySelectorAll(config.slideId);
    this.INTERVAL = config.interval;
    this.isPlaying = config.isPlaying;
  }

  _initConfig(o) {
    return {...{containerId: '#carousel', slideId: '.slide', interval: 1000, isPlaying: true}, ...o};
  }

  _initProps() {
    this.slidesContainer = this.container.querySelector("#slides-container");
    this.SLIDES_COUNT = this.slideItems.length;
    this.CODE_SPACE = "Space";
    this.CODE_ARROW_LEFT = "ArrowLeft";
    this.CODE_ARROW_RIGHT = "ArrowRight";
    this.FA_PAUSE = '<i class="fa-solid fa-circle-pause"></i>';
    this.FA_PLAY = '<i class="fa-solid fa-circle-play"></i>';
    this.FA_PREV = '<i class="fa-solid fa-circle-left"></i>';
    this.FA_NEXT = '<i class="fa-solid fa-circle-right"></i>';
    this.currentSlide = 0;
    this.isPlaying = true;
  }

  _initIndicators() {
    const indicators = document.createElement('div');
    indicators.setAttribute('class', 'indicators');
    indicators.setAttribute('id', 'indicators-container');

    for (let i = 0; i < this.SLIDES_COUNT; i++) {
      const indicator = document.createElement('div');
      indicator.setAttribute('class', i ? 'indicator' : 'indicator active');
      indicator.dataset.slideTo = `${i}`;

      indicators.append(indicator);
    }

    this.container.append(indicators);
    this.indicatorsContainer = this.container.querySelector("#indicators-container");
    this.indicatorItems = this.container.querySelectorAll(".indicator");
  }

  _initControls() {
    let controls = document.createElement('div');
    const PAUSE = `<span class="control control-pause" id="pause-btn"> ${this.isPlaying ? this.FA_PAUSE : this.FA_PLAY} </span>`;
    const PREV = `<span class="control control-prev" id="prev-btn"> ${this.FA_PREV} </span>`;
    const NEXT = `<span class="control control-next" id="next-btn"> ${this.FA_NEXT} </span>`;

    controls.setAttribute('class', 'controls');
    controls.setAttribute('id', 'controls-container');
    controls.innerHTML = PREV + PAUSE + NEXT;

    this.container.append(controls);
    this.pauseBtn = this.container.querySelector("#pause-btn");
    this.nextBtn = this.container.querySelector("#next-btn");
    this.prevBtn = this.container.querySelector("#prev-btn");
  }

  _initListeners() {
    document.addEventListener('keydown', this.pressKey.bind(this));
    this.pauseBtn.addEventListener('click', this.pausePlayHandler.bind(this));
    this.nextBtn.addEventListener('click', this.nextHandler.bind(this));
    this.prevBtn.addEventListener('click', this.prevHandler.bind(this));
    this.indicatorsContainer.addEventListener('click', this.indicateHandler.bind(this));
    //this.container.addEventListener('mouseenter', this.pauseHandler.bind(this));
    //this.container.addEventListener('mouseleave', this.playHandler.bind(this));
  }

  _goToNth(n) {
    this.slideItems[this.currentSlide].classList.toggle("active");
    this.indicatorItems[this.currentSlide].classList.toggle("active");
    this.currentSlide = (n + this.SLIDES_COUNT) % this.SLIDES_COUNT;
    this.slideItems[this.currentSlide].classList.toggle("active");
    this.indicatorItems[this.currentSlide].classList.toggle("active");
  }

  _gotoNext() {
    this._goToNth(this.currentSlide + 1);
  }

  _gotoPrev() {
    this._goToNth(this.currentSlide - 1);
  }

  _tick() {
    if (!this.isPlaying) return;
    this.timerId = setInterval(() => this._gotoNext(), this.INTERVAL);
  }

  pauseHandler() {
    if (!this.isPlaying) return;
    this.isPlaying = false;
    this.pauseBtn.innerHTML = this.FA_PLAY;
    clearInterval(this.timerId);
    this.timerId = null; 
  }

  playHandler() {
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.pauseBtn.innerHTML = this.FA_PAUSE;
    if (!this.timerId) { 
      this._tick();
    }
  }

  pausePlayHandler() {
    if (this.pauseBtnClicked) return;

    this.pauseBtnClicked = true;
    setTimeout(() => this.pauseBtnClicked = false, 100);

    this.isPlaying ? this.pauseHandler() : this.playHandler();
  }

  nextHandler() {
    this.pauseHandler();
    this._gotoNext();
  }

  prevHandler() {
    this.pauseHandler();
    this._gotoPrev();
  }

  indicateHandler(e) {
    const { target } = e;
    if (target.classList.contains('indicator')) {
      this.pauseHandler();
      this._goToNth(+target.dataset.slideTo);
    }
  }

  pressKey(e) {
    const { code } = e;

    if (this.keyPressed) return;
    this.keyPressed = true;
    setTimeout(() => this.keyPressed = false, 100);

    console.log("Pressed key:", code); 
    if (code === this.CODE_SPACE) this.pausePlayHandler();
    if (code === this.CODE_ARROW_LEFT) this.prevHandler();
    if (code === this.CODE_ARROW_RIGHT) this.nextHandler();
  }

  init() {
    this._initProps();
    this._initIndicators();
    this._initControls();
    this._initListeners();
    this._tick();
  }
}

export default Carousel;
