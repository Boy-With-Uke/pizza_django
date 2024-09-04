const characters = [
  "/static/images/pizza.png",
  "/static/images/pizza.png",
  "/static/images/pizza.png",
  "/static/images/pizza.png",
];


// canvas setup
var canvas = document.getElementById("canvas"),
  w = (canvas.width = window.innerWidth),
  h = (canvas.height = window.innerHeight);

var dropZone = document.getElementById("drop-zone"),
  successCallback = document.querySelector(".success-callback"),
  reloadButton = document.getElementById("try-again");

window.onload = function () {
  loadSound();
};

// register sounds
var collision = "collision",
  collision2 = "collision2",
  process = "process",
  process2 = "process2",
  win = "win",
  error = "error";

function loadSound() {
  createjs.Sound.registerSound(
    "https://s3-us-west-2.amazonaws.com/s.cdpn.io/111167/collision.wav",
    collision,
    1
  );
  createjs.Sound.registerSound(
    "https://s3-us-west-2.amazonaws.com/s.cdpn.io/111167/collision2.wav",
    collision2,
    1
  );
  createjs.Sound.registerSound(
    "https://s3-us-west-2.amazonaws.com/s.cdpn.io/111167/win.wav",
    win,
    1
  );
  createjs.Sound.registerSound(
    "https://s3-us-west-2.amazonaws.com/s.cdpn.io/111167/error.wav",
    error,
    1
  );
  createjs.Sound.registerSound(
    "https://s3-us-west-2.amazonaws.com/s.cdpn.io/111167/process2.wav",
    process2,
    1
  );
}

// stage inits
var stage = new createjs.Stage("canvas");
// enabling mouse event
stage.enableMouseOver();
// enabling touch
createjs.Touch.enable(stage);

// ripples
var ripples = [],
  shadowRipples = [],
  ripplesLength = 8;

function drawRipples(posX, posY, radius, pantek) {
  var ripple = new createjs.Shape();

  ripple.graphics.beginStroke("#eee");
  ripple.graphics.setStrokeStyle(3);
  ripple.graphics.drawCircle(0, 0, 80 * radius);

  var shadowRipple = new createjs.Shape();

  shadowRipple.graphics.beginFill("#c0392b");
  shadowRipple.graphics.drawCircle(0, 0, 80 * radius);
  shadowRipple.alpha = 0;

  shadowRipples.push(shadowRipple);

  var rippleCtr = new createjs.Container();

  rippleCtr.addChild(ripple, shadowRipple);

  rippleCtr.x = posX;
  rippleCtr.y = posY;
  rippleCtr.alpha = 1 - 0.15 * pantek;

  ripples.push(rippleCtr);
  stage.addChild(rippleCtr);
}

// loop ripples
for (i = 0; i < ripplesLength; i++) {
  var num = i + 1;
  drawRipples(w / 2, h / 2, num, i);
}

// circle init
var circle = new createjs.Shape();
circle.width = 100;
circle.graphics.beginFill("#2c3e50");
circle.graphics.drawCircle(0, 0, circle.width);

// shadow circle init
var shadowCircle = new createjs.Shape();
shadowCircle.width = 100;
shadowCircle.graphics.beginFill("#E60012");
shadowCircle.graphics.drawCircle(0, 0, shadowCircle.width);

var shadowCircleCtr = new createjs.Container().addChild(shadowCircle);
shadowCircleCtr.x = w / 2;
shadowCircleCtr.y = h / 2;
shadowCircleCtr.alpha = 0;

var circleCtr = new createjs.Container().addChild(circle);
circleCtr.x = w / 2;
circleCtr.y = h / 2;
circleCtr.status = false;

// circleCtr.cache(w/2, h/2, circle.width * 2, circle.width * 2)

// images
var imagesArray = [],
  propsArray = [],
  imagesLength = 4;

  function drawImage(posX, posY, index) {
    // image init
    var image = new Image();
    image.src = characters[index];
    var bitmap = new createjs.Bitmap(image);
  
    // Set the scale to match the desired width and height
    bitmap.scaleX = 90 / bitmap.getBounds().width;
    bitmap.scaleY = 90 / bitmap.getBounds().height;
  
    var bitmapCtr = new createjs.Container().addChild(bitmap);
  
    var bitmapProps = {
      width: 90, // New width
      height: 90, // New height
      rotation: -10,
      oriX: posX,
      oriY: posY,
    };
  
    bitmapCtr.x = posX;
    bitmapCtr.y = posY;
    bitmapCtr.oriX = posX;
    bitmapCtr.oriY = posY;
    bitmapCtr.rotation = bitmapProps.rotation;
  
    if (index == 2) {
      bitmapCtr.key = true;
    } else {
      bitmapCtr.key = false;
    }
  
    // Transform origin to center
    bitmapCtr.regX = bitmapProps.width / 2;
    bitmapCtr.regY = bitmapProps.height / 2;
  
    imagesArray.push(bitmapCtr);
    propsArray.push(bitmapProps);
  
    stage.addChild(bitmapCtr);
  }
  

var sines = [w / 2 - 300, w / 2 - 300, w / 2 + 300, w / 2 + 300],
  coses = [h - h / 1.5, h - h / 3.5, h - h / 3.5, h - h / 1.5];

for (var i = 0; i < imagesLength; i++) {
  drawImage(sines[i], coses[i], i);
}

// put elements to stage
stage.addChild(circleCtr, shadowCircleCtr);

// animation listener
TweenMax.ticker.addEventListener("tick", stage.update, stage);

function scaleIt(el, x, y, duration, ease) {
  TweenMax.to(el, duration, {
    scaleX: x,
    scaleY: y,
    ease: ease,
  });
}

function scaleRipples(arr, x, y, duration, staggerDelay, delay, ease) {
  var tl = new TimelineMax({});

  tl.staggerTo(
    arr,
    0.6,
    {
      delay: delay,
      scaleX: x,
      scaleY: y,
      ease: ease,
      onComplete: function () {
        tl.stop();
      },
    },
    staggerDelay
  );
}

function scaleAlpha(el, x, y, alpha, duration) {
  TweenMax.to(el, duration, {
    scaleX: x,
    scaleY: y,
    alpha: alpha,
    ease: Elastic.easeOut.config(1, 0.75),
  });
}

function back(el, posX, posY, delay) {
  var tlTemp = new TimelineMax({});

  tlTemp.to(el, 0.6, {
    delay: delay,
    x: posX,
    y: posY,
    ease: Elastic.easeOut.config(1, 0.75),
  });
}

var hit = false;
var bolehjalan = false;

// start image array loop
[].forEach.call(imagesArray, function (imageCtr, index) {
  var tlImage = new TimelineMax({
    repeat: -1,
    yoyo: true,
  });

  tlImage.to(imageCtr, 0.9, {
    delay: index * 0.2,
    rotation: propsArray[index].rotation * -1,
    ease: Power4.easeInOut,
  });

  var tlRipple = new TimelineMax({});

  imageCtr.on("pressmove", function (e) {
    tlImage.stop();

    var el = e.currentTarget;

    // z index top
    stage.setChildIndex(el, stage.getNumChildren() - 1);

    if (!hit) {
      scaleIt(el, 0.2, 0.2, 0.6, Power4.easeOut);

      TweenMax.to(el, 0.15, {
        x: e.stageX,
        y: e.stageY,
      });

      var intersection = ndgmr.checkRectCollision(el, circleCtr);

      doHit(intersection, e);
    }
  });
  imageCtr.on("mouseover", function (e) {
    if (!bolehjalan) {
      var el = e.currentTarget;
      el.cursor = "pointer";
      scaleIt(el, 0.2, 0.2, 0.6, Power4.easeOut); // Ajustez ici
    }
  });

  imageCtr.on("mouseout", function (e) {
    if (!bolehjalan) {
      var el = e.currentTarget;
      TweenMax.to(el, 0.3, {scaleX: 0.1, scaleY: 0.1, ease: Power4.easeOut});
    }
  });

  imageCtr.on("pressup", function (e) {
    var el = e.currentTarget;

    if (bolehjalan) {
      scaleIt(el, 0.25, 0.25, 0.3);

      var playProcess = createjs.Sound.play(process2);
      playProcess.volume = 0.25;

      TweenMax.to(el, 0.3, {
        x: w / 2,
        y: h / 2,
        alpha: 0,
        ease: Power4.easeOut,
        onComplete: function () {
          scaleIt(circleCtr, 0.8, 0.8, 0.6, Power4.easeOut);
          scaleAlpha(shadowCircleCtr, 0.8, 0.8, 0, 0.6, Power4.easeOut);
          scaleRipples(ripples, 0.8, 0.8, 0.6, 0.015, 0.05, Power4.easeOut);

          inOrOut(el);
        },
      });
    } else {
      tlImage.resume();
      var playCollision = createjs.Sound.play(collision);
      playCollision.volume = 0.25;
      scaleIt(el, 0.3, 0.3, 0.3);
      back(el, propsArray[index].oriX, propsArray[index].oriY);
    }
  });
});
// end image array loop

// if hit do this and that
function doHit(intersection) {
  if (intersection) {
    var playCollision2 = createjs.Sound.play(collision2);
    playCollision2.volume = 0.25;

    scaleIt(circleCtr, 1.1, 1.1, 0.6, Power4.easeOut);

    scaleAlpha(shadowCircleCtr, 1.1, 1.1, 1, 0.6, Power4.easeOut);

    scaleRipples(ripples, 1.1, 1.1, 0.6, 0.015, 0.05, Power4.easeOut);

    TweenMax.to(dropZone, 0.3, {
      opacity: 0,
      scale: 0.5,
    });

    bolehjalan = true;
  }

  if (!intersection) {
    scaleIt(circleCtr, 1, 1, 0.6, Power4.easeOut);
    scaleAlpha(shadowCircleCtr, 1, 1, 0, 0.6, Power4.easeOut);
    scaleRipples(ripples, 1, 1, 0.6, 0.015, 0.05, Power4.easeOut);
    TweenMax.to(dropZone, 0.3, {
      opacity: 1,
      scale: 1,
    });

    bolehjalan = false;
  }
}

// define wheter choice is right or no
function inOrOut(el) {
  // error
  if (el.key == false) {
    var tl1 = new TimelineMax({});

    tl1

      .to(el, 0.45, {
        delay: 0.6,
        scaleX: 0.3,
        scaleY: 0.3,
        alpha: 1,
        ease: Power4.easeOut,
        onUpdate: function () {
          var playError = createjs.Sound.play(error);
          playError.volume = 0.25;
        },
      })

      .to(
        el,
        0.45,
        {
          x: el.oriX,
          y: el.oriY,
          ease: Power4.easeOut,
          onUpdate: function () {
            // change dropzone text
            dropZone.innerHTML = "Try Again";
          },
        },
        0.6
      )

      .to(
        dropZone,
        0.3,
        {
          opacity: 1,
          scale: 1,
        },
        "-=.15"
      );

    // ripple error
    var tl2 = new TimelineMax({});

    tl2
      .to([circleCtr, shadowCircleCtr], 1, {
        delay: 0.6,
        scaleX: 0.3,
        scaleY: 0.3,
        ease: Elastic.easeOut.config(2.5, 0.4),
      })
      .staggerTo(
        ripples,
        1,
        {
          scaleX: 1,
          scaleY: 1,
          ease: Elastic.easeOut.config(2.5, 0.4),
        },
        0.05,
        0.45
      );

    var tlshadowRipples = new TimelineMax({});

    tlshadowRipples
      .staggerTo(
        shadowRipples,
        0.5,
        {
          alpha: 0.5,
          ease: Power4.easeOut,
        },
        0.05,
        0.45
      )

      .staggerTo(
        shadowRipples,
        0.5,
        {
          alpha: 0,
          ease: Power4.easeOut,
        },
        0.05,
        0.55
      );
  } else {
    var tl = new TimelineMax({});

    // succeed ripple
    tl.to([circleCtr, shadowCircleCtr], 0.3, {
      delay: 0.6,
      scaleX: 1.1,
      scaleY: 1.1,
      ease: Elastic.easeOut.config(1, 0.75),
    })
      .staggerTo(
        ripples,
        0.3,
        {
          scaleX: 1.1,
          scaleY: 1.1,
          ease: Power4.easeOut,
        },
        0.05,
        0.5
      )
      .to(
        imagesArray[2],
        0.6,
        {
          scaleX: 1.1,
          scaleY: 1.1,
          alpha: 1,
          ease: Elastic.easeOut.config(1, 0.75),
        },
        0.6
      )
      .to(
        [imagesArray[0], imagesArray[1], imagesArray[3]],
        0.6,
        {
          alpha: 0,
          ease: Elastic.easeOut.config(1, 0.95),
        },
        0.6
      );

    setTimeout(function () {
      var playWin = createjs.Sound.play(win);
      playWin.volume = 0.25;
    }, 600);

    setTimeout(function () {
      successCallback.classList.add("show");
    }, 750);
  }
}

// reload
reloadButton.addEventListener("click", function () {
  history.go(0);
});
