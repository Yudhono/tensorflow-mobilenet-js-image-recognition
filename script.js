let model;

async function loadModel() {
  model = await mobilenet.load();
  console.log("Model loaded.");
}

loadModel();

const imageUpload = document.getElementById("image-upload");
const resultDiv = document.getElementById("result");

imageUpload.addEventListener("change", async () => {
  const image = await loadImage(imageUpload.files[0]);
  const predictions = await model.classify(image);
  showPredictions(predictions);
});

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => resolve(tf.browser.fromPixels(image));
      image.src = reader.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function showPredictions(predictions) {
  resultDiv.innerHTML = "";
  predictions.forEach(({ className, probability }) => {
    const p = document.createElement("p");
    p.innerText = `${className}: ${(probability * 100).toFixed(2)}%`;
    resultDiv.appendChild(p);
  });
}
