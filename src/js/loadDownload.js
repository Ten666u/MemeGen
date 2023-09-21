const optionsInputContainer = document.getElementById("optionsInputContainer");
const downloadImageBtn = document.getElementById("downloadImageBtn");
const loadImageBtn = document.getElementById("loadImageBtn");
const addTxtContainer = document.getElementById("addTxtContainer");
const txtCounter = document.getElementById("txtCounter");

let loadImageFlag = false;

function handleImage(e) {
    let allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)/;

    var reader = new FileReader();
    reader.onload = function (event) {
        var img = new Image();
        img.onload = function () {
            let ctx = memeGenerator.getContext("2d");

            memeGenerator.width = 500;
            memeGenerator.height = 500;
            var scaleWidth = memeGenerator.width / img.width;
            var scaleHeight = memeGenerator.height / img.height;
            var newWidth = img.width * scaleWidth;
            var newHeight = img.height * scaleHeight;

            ctx.clearRect(0, 0, memeGenerator.width, memeGenerator.height);
            ctx.drawImage(img, 0, 0, newWidth, newHeight);
        };
        img.src = event.target.result;
    };

    if (!allowedExtensions.test(e.target.files[0].name)) {
        alert("Загрузите изображение");
        loadImageBtn.value = "";
        return false;
    }

    reader.readAsDataURL(e.target.files[0]);
    downloadImageBtn.disabled = false;
    loadImageFlag = true;
    addTxtContainer.classList.remove("hidden");
}

function downloadImage(e) {
    draw();
    // Convert our canvas to a data URL
    let canvasUrl = memeGenerator.toDataURL();
    // Create an anchor, and set the href value to our data URL
    const createEl = document.createElement("a");
    createEl.href = canvasUrl;

    // This is the name of our downloaded file
    createEl.download = "funy-meme";

    // Click the download button, causing a download, and then remove it
    createEl.click();
    createEl.remove();

    let ctx = memeGenerator.getContext("2d");
    ctx.clearRect(0, 0, memeGenerator.width, memeGenerator.height);

    loadImageBtn.value = "";
    downloadImageBtn.disabled = false;

    let inputArr = document.querySelectorAll(".input_generator-txt");

    for (let input of inputArr) {
        input.parentNode.removeChild(input);
    }

    optionsInputContainer.innerHTML = "";
    addTxtContainer.classList.add("hidden");
    txtCounter.textContent = 0;
}

function draw() {
    let inputArr = document.querySelectorAll(".input_generator-txt");

    for (let input of inputArr) {
        let ctx = memeGenerator.getContext("2d");
        let style = getComputedStyle(input);

        //Шрифт и текст
        ctx.font = `${style.fontSize} Impact`;
        ctx.fillStyle = style.color;

        if (style.transform !== "none") {
            ctx.save();
            let rad = (getRotation(style.transform) * Math.PI) / 180;
            ctx.translate(
                getNumberPos(style, "left") + input.clientWidth / 2,
                getNumberPos(style, "top") + input.clientHeight / 2
            );
            ctx.rotate(rad);
            ctx.fillText(
                input.textContent,
                -1 * (input.clientWidth / 2),
                +input.clientHeight / 2
            );

            if (style.textShadow !== "none") {
                let strokeTxt = style.textShadow;
                ctx.strokeStyle = strokeTxt.slice(
                    0,
                    strokeTxt.indexOf(")", 0) + 1
                );
                ctx.strokeText(
                    input.textContent,
                    -1 * (input.clientWidth / 2),
                    +input.clientHeight / 2
                );
            }

            ctx.restore();
            continue;
        }

        ctx.strokeStyle = "black";

        ctx.fillText(
            input.textContent,
            getNumberPos(style, "left"),
            getNumberPos(style, "top") + input.clientHeight
        );
        if (style.textShadow !== "none") {
            let strokeTxt = style.textShadow;

            ctx.strokeStyle = strokeTxt.slice(0, strokeTxt.indexOf(")", 0) + 1);
            ctx.strokeText(
                input.textContent,
                getNumberPos(style, "left"),
                getNumberPos(style, "top") + input.clientHeight
            );
        }
    }
}
const getRotation = (transform) => {
    var tm = transform;
    if (tm !== "none") {
        let values = tm.split("(")[1].split(")")[0].split(",");
        let angle = Math.round(
            Math.atan2(values[1], values[0]) * (180 / Math.PI)
        );

        return angle < 0 ? angle + 360 : angle; //adding 360 degrees here when angle < 0 is equivalent to adding (2 * Math.PI) radians before
    }
    return 0;
};

const getNumberPos = (style, prop) => {
    return Number(style[prop].slice(0, -2));
};

export { loadImageFlag, handleImage, downloadImage };
