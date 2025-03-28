let parallaxContainer = document.getElementById("parallax-container");
let popupBackground = document.getElementById('popup-background');
let popup = document.getElementById('popup');
let popupCloseButton = document.getElementById('popup-close-button');
let hintButton1 = document.getElementById('hint-button-screen1');
let hintButton2 = document.getElementById('hint-button-screen2');
let hintButton3 = document.getElementById('hint-button-screen3');
let hintButton4 = document.getElementById('hint-button-screen4');
let wardrobe = document.getElementById('wardrobe');
let screen2 = document.getElementById('screen2');
let screen3 = document.getElementById('screen3');
let screen4 = document.getElementById('screen4');

let bigFlask = document.getElementById('big-flask');
let plate = document.getElementById('plate');
let plateArea = document.getElementById('plate-area');
let jar = document.getElementById('jar');
let microscope = document.getElementById('microscope');
let finalBigFlask = document.getElementById('final-big-flask');
let smoke = document.getElementById('smoke');
let arrowRight = document.getElementById('arrow-right');
let arrowLeft = document.getElementById('arrow-left');

let draggables = document.querySelectorAll('[class*="draggable"]');
let spinners = document.querySelectorAll('[class*="spinner"]');

let correctlyPlacedObjects = 0;
let ingredientsAdded = 0;

popupCloseButton.addEventListener('click', () => {
    popupBackground.style.display = 'none';
})

popupBackground.addEventListener('click', () => {
    popupBackground.style.display = 'none';
})

popup.addEventListener('click', (event) => {
    event.stopPropagation();
})

let hintButtonArr = [hintButton1, hintButton2, hintButton3, hintButton4];
hintButtonArr.forEach((item,index) => {
    item.addEventListener('click', () => {
        for (let i = 1; i <= 4; i++) {
            popup.classList.remove(`popup-${i}`);
        }
        popup.classList.add(`popup-${index + 1}`);
        popupBackground.style.display = 'block';
    })
})

let scrollDownToCoord = (coordY, animationDuration) => {
    let prevTime = performance.now();
    let delta = coordY - parallaxContainer.scrollTop;
    let ShiftPerMs = delta / (animationDuration * 1000)

    requestAnimationFrame(function move(time) {
        let timeSincePrev = time - prevTime;
        let shift = timeSincePrev * ShiftPerMs;
        if (parallaxContainer.scrollTop < coordY
            && parallaxContainer.scrollHeight > parallaxContainer.scrollTop+ parallaxContainer.clientHeight) {
            parallaxContainer.scrollTop += shift;
            prevTime = time;
            requestAnimationFrame(move)
        }
    });
}

let handleIngredientsAmount = (ingredientsAmount) => {
    if (ingredientsAmount >= 4) {
        plate.classList.add('plate-with-spoon');
        plateArea.classList.add("plate-area-with-spoon");
    }
    if (ingredientsAmount >= 5) {
        plate.classList.remove('plate-with-spoon');
        plateArea.classList.remove('plate-area-with-spoon');
        setTimeout(() => {
            scrollDownToCoord(screen3.getBoundingClientRect().top
                + parallaxContainer.scrollTop, 2);
        }, 500);
    }
}

draggables.forEach((item) => {
    let destination = null;
    let calculateScrollY = () => 0;
    if (item.classList.contains('draggable-object')) {
        destination = document.getElementById('shadow-of-'+item.id);
        calculateScrollY = () => {
            return wardrobe.getBoundingClientRect().top
        }
    }
    if (item.classList.contains('draggable-ingredient')) {
        destination = document.getElementById("big-flask");
        calculateScrollY = () => {
            return screen2.getBoundingClientRect().top
        }
    }

   item.onmousedown = (event)=> {
    let originalLeft = item.style.left;
    let originalTop = item.style.top;
    let originalZIndex = item.style.zIndex;
    item.style.zIndex = '100';
    let shiftX = event.clientX - item.getBoundingClientRect().left;
    let shiftY = event.clientY - item.getBoundingClientRect().top + calculateScrollY();

    let mouseMoveHandler = (event) => {
        item.style.left = event.pageX - shiftX + 'px';
        item.style.top = event.pageY - shiftY + 'px';

        if (event.pageX < 0 || event.pageX > window.innerWidth || event.pageY < 0
            || event.pageY > window.innerHeight) {

            item.style.left = originalLeft;
            item.style.top = originalTop;
            item.style.zIndex = originalZIndex;
            document.removeEventListener ('mousemove', mouseMoveHandler);
            item.removeEventListener ('mouseup', mouseUpHandler);
        }
    }
    document.addEventListener('mousemove', mouseMoveHandler);

    let mouseUpHandler = (event) => {
        item.hidden = true;
        let elementBelow = document.elementFromPoint(event.clientX, event.clientY);
        item.hidden = false;
        if (elementBelow === destination) {

            if (item.classList.contains('draggable-object')) {
                item.style.left = '0px';
                item.style.top = 'unset';
                item.style.bottom = '0px';
                item.style.zIndex = originalZIndex;
                destination.append (item);
                item.onmousedown = null;

                correctlyPlacedObjects++;
                if (correctlyPlacedObjects >= 6) {
                    setTimeout(() => {
                        scrollDownToCoord(screen2.getBoundingClientRect().top
                            + parallaxContainer.scrollTop, 2);
                    }, 200);

                }
            }

            if (item.classList.contains('draggable-ingredient')) {
                item.style.display = 'none';
                item.onmousedown = null;

                destination.classList.remove("big-flask-style-" + ingredientsAdded);
                ingredientsAdded++;
                destination.classList.add("big-flask-style-" + ingredientsAdded);
                handleIngredientsAmount(ingredientsAdded);

            }

        }
        else {
            event.target.style.left = originalLeft;
            event.target.style.top = originalTop;
            event.target.style.zIndex = originalZIndex;
        }

        document.removeEventListener ('mousemove', mouseMoveHandler);
        item.removeEventListener ('mouseup', mouseUpHandler);
    }
       item.addEventListener ('mouseup', mouseUpHandler);
   };

    item.addEventListener ('dragstart', (event) => {
        event.preventDefault();
   })
});

plate.onmousedown = () => {
    if (ingredientsAdded < 4) return;

    plate.classList.remove("plate-with-spoon");
    plateArea.classList.remove("plate-area-with-spoon");
    screen2.classList.add("screen2-spoon-full");

    screen2.onmouseup = (e) => {
        let elementBelow = document.elementFromPoint(e.clientX, e.clientY);
        if (elementBelow === bigFlask) {
            bigFlask.classList.remove('big-flask-style-' + ingredientsAdded);
            ingredientsAdded++;
            bigFlask.classList.add('big-flask-style-' + ingredientsAdded);
            plate.onmousedown = null;
            handleIngredientsAmount(ingredientsAdded);
        } else {
            plate.classList.add("plate-with-spoon");
            plateArea.classList.add("plate-area-with-spoon");
        }

        screen2.onmouseup = null;
        screen2.classList.remove("screen2-spoon-full");
    }
}

let finalBigFlaskOnClickHandler = () => {
    finalBigFlask.classList.remove("big-flask-with-pipette");
    screen3.classList.add("screen3-pink-drop");
    arrowRight.style.display = 'block';
    finalBigFlask.onclick = null;
    setTimeout(() => {
        screen3.onclick = (event) => {
            let elementBelow = document.elementFromPoint(event.clientX, event.clientY);
            if (elementBelow === microscope) {
                finalBigFlask.onclick = null;
                setTimeout(() => {
                    scrollDownToCoord(screen4.getBoundingClientRect().top
                        + parallaxContainer.scrollTop, 2);
                }, 300);
            } else {
                finalBigFlask.classList.add("big-flask-with-pipette");
                finalBigFlask.onclick = finalBigFlaskOnClickHandler;
            }
            arrowRight.style.display = 'none';
            screen3.onclick = null;
            screen3.classList.remove("screen3-pink-drop");
        }
    }, 0);
}

jar.onclick = function jarOnClickHandler() {
    let jarOriginalCursor = jar.style.cursor;
    jar.style.cursor = 'unset';
    screen3.classList.add("screen3-green-drop");
    arrowLeft.style.display = 'block';
    jar.onclick = null;
    setTimeout(() => {
        screen3.onclick = (event) => {
            let elementBelow = document.elementFromPoint(event.clientX, event.clientY);
            if (elementBelow === finalBigFlask) {
                jar.onclick = null;
                finalBigFlask.classList.add("big-flask-with-pipette");
                finalBigFlask.onclick = finalBigFlaskOnClickHandler;
                smoke.style.display = 'block';
            } else {
                jar.style.cursor = jarOriginalCursor;
                jar.onclick = jarOnClickHandler;
            }

            arrowLeft.style.display = 'none';
            screen3.onclick = null;
            screen3.classList.remove("screen3-green-drop");
        }
    }, 0);
}

spinners.forEach((item) => {
    let forward = true;
    let prevTime = performance.now();
    let animationDuration = 3;
    let DegPerMs = 360 / (animationDuration * 1000)
    item.style.rotate = '0deg';

    requestAnimationFrame(function rotate(time) {
        let timeSincePrev = time - prevTime;
        let deg = timeSincePrev * DegPerMs;

        let rotationValue = +item.style.rotate.split('deg')[0];
        if (rotationValue > 360 || rotationValue < -360) {
            rotationValue = 0;
        }

        item.style.rotate = `${forward ? rotationValue + deg : rotationValue - deg}deg`
        prevTime = time;
        requestAnimationFrame(rotate);
    });

    item.onclick = () => {
        forward = !forward;
    }
});

