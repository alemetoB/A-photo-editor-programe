const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const imageInput = document.getElementById('imageFileInput');
const resetBtn = document.getElementById('resetBtn');
const downloadBtn = document.getElementById('downloadBtn');

const controls = {
  brightness: document.getElementById('brightness'),
  saturation: document.getElementById('saturation'),
  blur: document.getElementById('blur'),
  inversion: document.getElementById('inversion')
};

const defaultValues = {
  brightness: 100,
  saturation: 100,
  blur: 0,
  inversion: 0
};

let uploadedImage = null;

function drawCanvas() {
  const width = canvas.width;
  const height = canvas.height;

  ctx.clearRect(0, 0, width, height);

  if (!uploadedImage) {
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = '#666';
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Upload a photo to start editing', width / 2, height / 2);
    return;
  }

  const image = uploadedImage;
  const imageRatio = image.width / image.height;
  const canvasRatio = width / height;

  let drawWidth = width;
  let drawHeight = height;
  let offsetX = 0;
  let offsetY = 0;

  if (imageRatio > canvasRatio) {
    drawHeight = height;
    drawWidth = height * imageRatio;
    offsetX = (width - drawWidth) / 2;
  } else {
    drawWidth = width;
    drawHeight = width / imageRatio;
    offsetY = (height - drawHeight) / 2;
  }

  ctx.filter = `brightness(${controls.brightness.value}%) saturate(${controls.saturation.value}%) blur(${controls.blur.value}px) invert(${controls.inversion.value}%)`;
  ctx.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);
  ctx.filter = 'none';
}

function updateControls() {
  Object.entries(defaultValues).forEach(([key, value]) => {
    if (!controls[key]) return;
    controls[key].value = value;
  });
}

function updateValueLabels() {
  const valueLabels = document.querySelectorAll('.value-label');

  valueLabels.forEach((label) => {
    const inputId = label.dataset.for;
    const control = document.getElementById(inputId);

    if (!control) return;

    if (inputId === 'blur') {
      label.textContent = `${control.value}px`;
    } else {
      label.textContent = `${control.value}%`;
    }
  });
}

function resetFilters() {
  updateControls();
  updateValueLabels();
  drawCanvas();
}

function downloadImage() {
  if (!uploadedImage) {
    return;
  }

  const link = document.createElement('a');
  link.download = 'edited-photo.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
}

imageInput.addEventListener('change', (event) => {
  const file = event.target.files[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      uploadedImage = img;
      drawCanvas();
    };
    img.src = e.target.result;
  };

  reader.readAsDataURL(file);
});

Object.values(controls).forEach((control) => {
  control.addEventListener('input', () => {
    updateValueLabels();
    drawCanvas();
  });
});

if (resetBtn) {
  resetBtn.addEventListener('click', resetFilters);
}

if (downloadBtn) {
  downloadBtn.addEventListener('click', downloadImage);
}

updateControls();
updateValueLabels();
drawCanvas();
