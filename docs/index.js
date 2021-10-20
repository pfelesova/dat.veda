
let net;

function preprocessImage(image) {
	let tensor = tf.browser.fromPixels(image)
		.resizeNearestNeighbor([160, 160])
		.toFloat();
	return tensor.div(255)
			.expandDims();
}

async function app() {
  console.log('Loading mobilenet..');

  // Load the model.
  net = await tf.loadLayersModel('https://github.com/pfelesova/dat.veda/main/docs/export_model/model.json');
  // net = await tf.loadLayersModel('https://github.com/pfelesova/dat.veda/blob/main/docs/export_model/model.json');
  // net = await tf.loadLayersModel('https://raw.githubusercontent.com/pfelesova/datveda/master/docs/model/model.json');
  console.log('Successfully loaded model');

  // Make a prediction through the model on our image.
  const imgEl = document.getElementById('img');
  const result = await net.predict(preprocessImage(imgEl));
  const p_cup = result.dataSync()[0];
  console.log('Prediction done');

  // For the assignment, change this
  // YOUR CODE STARTS HERE
 var pred = document.getElementById('pred');
  if (p_cup < 0.25) {
      prob = ((1-p_cup)*100).toFixed(2);
      pred.innerHTML = "<b>Not Cup cake</b> (probability=".concat(prob, "%)");
  } else {
    prob = (p_cup*100).toFixed(2);
    pred.innerHTML = "<b>Cup cake</b> (probability=".concat(prob, "%)");
  }
  /// YOUR CODE ENDS HERE

  return(p_cup);
}

app();

// HTML5 image file reader 
if (window.FileReader) {
  function handleFileSelect(evt) {
    var files = evt.target.files;
    var f = files[0];
    var reader = new FileReader();

      reader.onload = (function(theFile) {
        return function(e) {
          document.getElementById('image').innerHTML = ['<img id="img" crossorigin src="', e.target.result,'" title="', theFile.name, '" width="227"/>'].join('');
        };
      })(f);

      reader.readAsDataURL(f);
   
      app();
  }
} else {
  alert('This browser does not support FileReader');
}

// listener for a new image
document.getElementById('files').addEventListener('change', handleFileSelect, false);
