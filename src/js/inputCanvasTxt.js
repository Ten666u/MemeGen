import { loadImageFlag } from "./loadDownload.js";

const generatorContainer = document.getElementById("generatorContainer");
const generatorZone = document.getElementById("generatorZone");
const optionsInputContainer = document.getElementById("optionsInputContainer");
const deleteTxtButton = document.getElementById("deleteTxtButton")

let txtCounter = document.getElementById("txtCounter");

export default function inputCanvasTxt(e) {
    txtCounter.textContent = Number(txtCounter.textContent) + 1;

    if (!loadImageFlag) {
        return;
    }

    txtCounter.textContent === "0" ? deleteTxtButton.disabled = true :  deleteTxtButton.disabled = false

    let x = e.clientX - generatorZone.getBoundingClientRect().left;
    let y = e.clientY - generatorZone.getBoundingClientRect().top;

    let input = document.createElement("div");

    input.classList.add("input_generator-txt");

    input.style.fontSize = "40px";

    input.style.left = 230 + "px";
    input.style.top = 230 + "px";
    input.textContent = "Text";
    input.spellcheck = false;

    input.onmousedown = function (e) {
        let shiftX = e.clientX - input.getBoundingClientRect().left;
        let shiftY = e.clientY - input.getBoundingClientRect().top;

        const onMouseMove = (e) => {
            let newLeft =
                e.clientX - shiftX - memeGenerator.getBoundingClientRect().left;
            let newTop =
                e.clientY - shiftY - memeGenerator.getBoundingClientRect().top;

            if (newLeft < -30) {
                newLeft = -30;
            }

            let rightEdge = memeGenerator.offsetWidth - input.offsetWidth;

            if (newLeft > rightEdge + 30) {
                newLeft = rightEdge + 30;
            }

            if (newTop < -30) {
                newTop = -30;
            }

            let downEdge = memeGenerator.offsetHeight - input.offsetHeight;

            if (newTop > downEdge + 30) {
                newTop = downEdge + 30;
            }

            input.style.left = newLeft + "px";
            input.style.top = newTop + "px";
        };

        const onMouseUp = (e) => {
            generatorContainer.removeEventListener("mousemove", onMouseMove);
            generatorZone.removeEventListener("mouseup", onMouseUp);
        };

        generatorContainer.addEventListener("mousemove", onMouseMove);
        generatorContainer.addEventListener("mouseup", onMouseUp);
    };

    input.ondragstart = function () {
        return false;
    };

    const focusInput = (e) => {
        optionsInputContainer.innerHTML = "";

        let inputs = document.querySelectorAll(".input_generator-txt")

        for(let elem of inputs){
            console.log(elem);
            elem.classList.remove('active')
        }

        input.classList.add('active')

        let style = getComputedStyle(e.target);

        function rgbToHex(r, g, b) {
            function componentToHex(c) {
                var hex = c.toString(16);
                return hex.length == 1 ? "0" + hex : hex;
            }

            return (
                "#" + componentToHex(r) + componentToHex(g) + componentToHex(b)
            );
        }

        let rgbNumber = style.color.match(/\d+/g);

        let hexColor = rgbNumber.map((elem) => Number(elem));

        let strokeOptions = `
            <div class="options_input-stroke">
                <input type="checkbox" id="onOffStroke">
                <label for="onOffStroke" id="onOffStrokeTxt">Сделать обводку</label>
                <input type="color" id="inputStrokeColor" class="hidden" value = #aaa>
            </div>`;

        if(style.textShadow !== "none"){
            let strokeTxt = style.textShadow
            let rgbStr = strokeTxt.slice(0, strokeTxt.indexOf(')', 0) + 1)

            let rgbNumber = rgbStr.match(/\d+/g)

            let hexColor = rgbNumber.map((elem) => Number(elem))

            strokeOptions = `
            <div class="options_input-stroke">
                <input type="checkbox" id="onOffStroke" checked>
                <label for="onOffStroke" id="onOffStrokeTxt">Цвет обводки: </label>
                <input type="color" id="inputStrokeColor" value = ${rgbToHex(
                    ...hexColor
                )}>
            </div>`;
        }
        
        optionsInputContainer.insertAdjacentHTML(
            "beforeend",
            `

        <div class="options_input-txt">
            <label for="inputTxt">Введите текст: </label>
            <input type="text" id="inputTxt" value="${input.textContent}">
        </div>
        <div class="options_input-color">
                    <label for="inputTxtColor">Выберите цвет текста: </label>
                    <input type="color" id="inputTxtColor" value = ${rgbToHex(
                        ...hexColor
                    )}>
        </div>
        ${strokeOptions}
        <div class="options_input-range">
            <label for="inputTxtFontSize">Размер текста: </label>
            <input type="range" id="inputTxtFontSize" name="cowbell" min="16" max="70" value="${getNumberPos(
                style,
                "fontSize"
            )}" step="2" />
        </div>
        <div class="options_input-range">
            <label for="inputTxtRotate">Поверните: </label>
            <input type="range" id="inputTxtRotate" name="cowbell" min="-180" max="180" value="${getRotation(
                style.transform
            )}" step="10" />
        </div>
        `
        );

        let inputTxt = optionsInputContainer.querySelector("#inputTxt");
        let inputTxtColor = optionsInputContainer.querySelector("#inputTxtColor");
        let inputTxtFontSize = optionsInputContainer.querySelector("#inputTxtFontSize");
        let inputTxtRotate = optionsInputContainer.querySelector("#inputTxtRotate");
        let inputStrokeColor = optionsInputContainer.querySelector("#inputStrokeColor")
        let onOffStroke = optionsInputContainer.querySelector("#onOffStroke")
        let onOffStrokeTxt = optionsInputContainer.querySelector("#onOffStrokeTxt")


        const changeTxt = (e) => {
            input.innerText = e.target.value;
        };

        const changeColor = (e) => {
            input.style.color = e.target.value;
        };

        const changeFontSize = (e) => {
            input.style.fontSize = e.target.value + "px";
        };

        const changeRotate = (e) => {
            input.style.transform = `rotate(${e.target.value}deg)`;
        };

        const changeOnOffStroke = (e)=>{

            if(!e.target.checked){
                input.style.textShadow = 'none'
                onOffStrokeTxt.textContent = "Сделать обводку"
                inputStrokeColor.classList.add("hidden")
                return
            }

            onOffStrokeTxt.textContent = "Цвет обводки: "
            inputStrokeColor.classList.remove("hidden")
            input.style.textShadow = `${inputStrokeColor.value} -1px -1px 0, ${inputStrokeColor.value} 1px -1px 0, ${inputStrokeColor.value} -1px 1px 0, ${inputStrokeColor.value} 1px 1px 0`
        }

        const changeStroke = (e) =>{
            let value = e.target.value
            input.style.textShadow = `${value} -1px -1px 0, ${value} 1px -1px 0, ${value} -1px 1px 0, ${value} 1px 1px 0`;
        }

        inputTxt.addEventListener("input", throttle(changeTxt, 50));
        inputTxtColor.addEventListener("input", throttle(changeColor, 50));
        inputTxtFontSize.addEventListener("input", changeFontSize);
        inputTxtRotate.addEventListener("input", changeRotate);
        inputStrokeColor.addEventListener("input", changeStroke)
        onOffStroke.addEventListener("input", throttle(changeOnOffStroke, 50))
    };

    input.addEventListener("mousedown", focusInput);

    generatorZone.append(input);

    focusInput(e);
}

function throttle(callee, timeout) {
    let timer = null;

    return function perform(...args) {
        if (timer) return;

        timer = setTimeout(() => {
            callee(...args);

            clearTimeout(timer);
            timer = null;
        }, timeout);
    };
}

function getRotation(transform) {
    var tm = transform;
    if (tm !== "none") {
        let values = tm.split("(")[1].split(")")[0].split(",");
        let angle = Math.round(
            Math.atan2(values[1], values[0]) * (180 / Math.PI)
        );

        return angle < 0 ? angle + 360 : angle; //adding 360 degrees here when angle < 0 is equivalent to adding (2 * Math.PI) radians before
    }
    return 0;
}

const getNumberPos = (style, prop) => {
    return Number(style[prop].slice(0, -2));
};


const deleteTxt = (e) =>{
    let elem = generatorZone.querySelector(".active")
    elem.parentNode.removeChild(elem)

    let count = Number(txtCounter.textContent)

    txtCounter.textContent = count - 1
    count--

    if(count == 0){
        e.target.disabled = true
    }

    optionsInputContainer.innerHTML = ""
}

deleteTxtButton.addEventListener("click", deleteTxt)
