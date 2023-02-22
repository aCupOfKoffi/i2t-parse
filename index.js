let canvas = document.getElementById('canvas'),
    color = document.querySelector('.color'),
    regMin = document.querySelector('.saturation'),
    sample = document.querySelector('.sample'),
    resCanvas = document.getElementById('res-canvas'),
    reverse = document.querySelector('.reverse'),
    theme = document.querySelector('.isDark'),
    resHandler = document.querySelector('.resolution'),
    copy = document.querySelector('.copy'),
    copyLines = document.getElementsByClassName('line');

const context = canvas.getContext('2d'),
    resContext = resCanvas.getContext('2d');
let resolution = 70,
    saturation = 140,
    isReversed = true,
    isDark = true;
const colorbet = '$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft|()1{}[]?<>i!lI;:,"^`\'. ';
    

const img = new Image();
img.crossOrigin = 'anonymous';
img.src = './images/girl.png';                         //  <----  name of your file HERE
let width = resCanvas.width = canvas.width = img.width;
let height = resCanvas.height = canvas.height = img.height;

img.addEventListener('load', () => {
    context.drawImage(img, 0, 0);
    img.style.display = 'none';
    parse();

});

regMin.addEventListener('input', (e) => {
    saturation = e.target.value;
    parse();
})

theme.addEventListener('input', (e) => {
    isDark = e.target.checked;
    updateTheme();
})

reverse.addEventListener('input', (e) => {
    isReversed = e.target.checked;
    parse();
});

resHandler.addEventListener('input', (e) => {
    resolution = e.target.value;
    parse();
})

copy.addEventListener('click', (e) => {
    let content = '';
    for (item of copyLines) {
        content += `${item.textContent}\n`;
    }    
    navigator.clipboard.writeText(content)
})

const updateTheme = () => {
    color.style.backgroundColor = isDark ? 'black' : 'white';
    color.style.color = isDark ? 'white' : 'black';
}

updateTheme();

const parse = () => {
    color.textContent = '';
    for (let y = 0; y < height; y += 2*height/resolution) {
        let line = document.createElement('p');
        line.classList.add('line');
        for (let x = 0; x < width; x += width/resolution) {
            const pixel = context.getImageData(x, y, width/100, height/50);
            let data = pixel.data;
            let brightness = Math.floor((data[0] + data[1] + data[2])/3) - saturation;
            brightness = brightness < 0 ? 0 : brightness > 252 ? 252 : brightness - brightness % 4;
            let char = '';
            if (isReversed) {
                char = colorbet[Math.floor(252 - brightness)/4];
            } else {
                char = colorbet[brightness/4];
            }
            char = char === ' ' ? '\u00A0' : char; 
            line.textContent += char;
            resContext.fillStyle = `rgb(${brightness}, ${brightness}, ${brightness})`;
            resContext.fillRect(x, y, width/100, height/50);
        }
        color.append(line);
    }
}