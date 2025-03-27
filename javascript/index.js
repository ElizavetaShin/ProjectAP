let popupBackground = document.getElementById('popup-background');
let popup = document.getElementById('popup');
let popupCloseButton = document.getElementById('popup-close-button');
let hintButton1 = document.getElementById('hint-button-screen1');
let hintButton2 = document.getElementById('hint-button-screen2');
let hintButton3 = document.getElementById('hint-button-screen3');
let hintButton4 = document.getElementById('hint-button-screen4');

popupCloseButton.addEventListener('click', ()=>{
    popupBackground.style.display = 'none';
})

let hintButtonArr = [hintButton1, hintButton2, hintButton3, hintButton4];
hintButtonArr.forEach((item,index)=>{
    item.addEventListener('click', ()=>{
        popup.style.backgroundImage = `url('../img/popup${index+1}.png')`;
        popupBackground.style.display = 'block';
    })
})

let draggables = document.querySelectorAll('.draggable-object');
draggables.forEach((item) => {
   let destination = document.getElementById('shadow-of-'+item.id);
   item.onmousedown = (event)=> {
    let originalLeft = item.style.left;
    let originalTop = item.style.top;
    item.style.zIndex = '100';
    let shiftX = event.clientX-item.getBoundingClientRect().left;
    let shiftY = event.clientY-item.getBoundingClientRect().top;
    let mouseMoveHandler = (event)=>{
        item.style.left = event.pageX-shiftX+'px';
        item.style.top = event.pageY-shiftY+'px';
    }
    document.addEventListener('mousemove', mouseMoveHandler);
    let mouseUpHandler = (event) => {
        item.hidden = true;
        let elementBelow = document.elementFromPoint(event.clientX, event.clientY);
        item.hidden = false;
        if (elementBelow === destination) {
            item.style.left = '0px';
            item.style.top = 'unset';
            item.style.bottom = '0px';
            destination.append (item);
            item.onmousedown = null;
        }
        else {
            event.target.style.left = originalLeft;
            event.target.style.top = originalTop;
        }
        document.removeEventListener ('mousemove', mouseMoveHandler);
        item.removeEventListener ('mouseup', mouseUpHandler);
    }
    item.addEventListener ('mouseup', mouseUpHandler);
   };
   item.addEventListener ('dragstart', (event)=>{
    event.preventDefault();
   })
});
