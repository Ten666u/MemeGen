import inputCanvasTxt from './inputCanvasTxt.js'
import {handleImage, downloadImage} from './loadDownload.js'
import '../assets/styles/bootstrap-reboot.min.css'
import '../assets/styles/style.css'

const memeGenerator = document.getElementById("memeGenerator");
const loadImageBtn = document.getElementById("loadImageBtn");
const downloadImageBtn = document.getElementById("downloadImageBtn");
const addTxtButton = document.getElementById("addTxtButton")

addTxtButton.addEventListener("click", inputCanvasTxt);
loadImageBtn.addEventListener("change", handleImage);
downloadImageBtn.addEventListener("click", downloadImage);