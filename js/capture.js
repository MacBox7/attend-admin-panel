(function ($) {
  // The width and height of the captured photo. We will set the
  // width to the value defined here, but the height will be
  // calculated based on the aspect ratio of the input stream.

  var width = 420; // We will scale the photo width to this
  var height = 0; // This will be computed based on the input stream

  var photoHeight = 960;
  var photoWidth = 960;

  // |streaming| indicates whether or not we're currently streaming
  // video from the camera. Obviously, we start at false.

  var streaming = false;

  // The various HTML elements we need to configure or control. These
  // will be set by the startup() function.

  var video = null;
  var canvas = null;
  var photo = null;
  var mobilePhoto = null;
  var startbutton = null;

  function startup() {
    video = document.getElementById('video');
    canvas = document.getElementById('canvas');
    photo = document.getElementById('profile-image');
    mobilePhoto = document.getElementById('mobile-profile-image');
    startbutton = document.getElementById('startbutton');

    navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
      })
      .then(function (stream) {
        video.srcObject = stream;
        video.play();
      })
      .catch(function (err) {
        console.log("An error occured! " + err);
      });

    video.addEventListener('canplay', function (ev) {
      if (!streaming) {
        height = video.videoHeight / (video.videoWidth / width);

        video.setAttribute('width', width);
        video.setAttribute('height', height);
        canvas.setAttribute('width', width);
        canvas.setAttribute('height', height);
        streaming = true;
      }
    }, false);

    // startbutton.addEventListener('click', function (ev) {
    //   takepicture();
    //   ev.preventDefault();
    // }, false);

  }

  // Capture a photo by fetching the current contents of the video
  // and drawing it into a canvas, then converting that to a PNG
  // format data URL. By drawing it on an offscreen canvas and then
  // drawing that to the screen, we can change its size and/or apply
  // other changes before drawing it.

  window.takepicture = function (callback) {
    var context = canvas.getContext('2d');
    if (width && height) {
      canvas.width = photoWidth;
      canvas.height = photoHeight;
      context.drawImage(video, 0, 0, photoWidth, photoHeight);

      var data = canvas.toDataURL('image/png');
      photo.setAttribute('src', data);
      mobilePhoto.setAttribute('src', data);
      callback();
    } else {
      clearphoto();
    }
  }

  // Set up our event listener to run the startup process
  // once loading is complete.
  window.addEventListener('load', startup, false);

})(jQuery);