(function ($) {

    $.URL = {
        STREAMING: "http://192.168.43.1:8080/shot.jpg",
        FORMREGISTER: "http://localhost:5000/api/admin/store",
        REFRESHDATABASE: "http://localhost:5000/api/openface/train",
        GETROLLNO: "http://localhost:5000/api/admin/student"
    };

    $(function () {
        var dataURL;
        materializeInit();
        motionjpeg("#video");

        $("#anchor-preprocess-images, #mobile-anchor-preprocess-images").click(function () {
            swal({
                title: "Are you sure?",
                text: "This will process the complete database!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, process it!",
                cancelButtonText: "No, cancel plx!",
                closeOnConfirm: false,
                closeOnCancel: false
            }).then(function () {
                $.ajax({
                    type: "get",
                    url: $.URL.REFRESHDATABASE,
                    success: function (data) {
                        swal(
                            'Success!',
                            'All images have been processed',
                            'success'
                        )
                    },
                    error: function (error) {
                        swal("Oops", "We couldn't connect to the server!", "error");
                    }
                });
            }, function (dismiss) {
                if (dismiss === 'cancel') {
                    swal(
                        'Cancelled',
                        'No processing took place :)',
                        'error'
                    )
                }
            });
        });
    
        $("#mobile-anchor-preprocess-images, #mobile-anchor-register").click(function () {
            $(".button-collapse").sideNav('hide');
        });
    
        $("#form-register").submit(function (event) {
    
            localStorage.setItem("formDetails", JSON.stringify($("#form-register").serializeArray()));
            $("#modal-facecapture").modal("open");
            event.preventDefault();
    
        });
    
        $("#startbutton").click(function () {
            //window.takepicture to use webcam
            displayImageOnCanvas(function () {
                var data = JSON.parse(localStorage.getItem('formDetails'));
    
                data.push({
                    name: 'base64Image',
                    value: getBase64Image()
                });
    
                $.ajax({
                    type: "POST",
                    url: $.URL.FORMREGISTER,
                    contentType: 'application/json',
                    dataType: "json",
                    data: convertToJSON(data),
                    success: function (data) {
                        localStorage.removeItem("formDetails");
                        $("#modal-facecapture").modal("close");
                        $("#modal-registration-form").modal("close");
                        //location.reload();
                    },
                    error: function (error) {
                        console.log(error);
                    }
                });
            });
        });

        $.ajax({
            url: $.URL.GETROLLNO,
            success: function (data) {
                console.log('Autocomplete initialized');
                initAutoComplete(data);
            },
            error: function (error) {
                console.log(error);
                initAutoComplete(null);
            }
        });
    
        function materializeInit() {
            $(".button-collapse").sideNav();
            $("select").material_select();
            $("select[required]").css({
                position: "absolute",
                display: "inline",
                height: 0,
                padding: 0,
                width: 0
            });
            $(".modal").modal();
        }
    
        function getBase64Image() {
            var canvas = $("#canvas")[0];
            var base64Image = dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
            return base64Image;
        }
    
        function convertToJSON(unindexed_array) {
            var indexed_array = {};
    
            $.map(unindexed_array, function (n, i) {
                indexed_array[n['name']] = n['value'];
            });
    
            return JSON.stringify(indexed_array);
        }
    
        function initAutoComplete(data) {
            var indexed_array = {}
    
            if (data !== undefined && data !== null) {
                data.data.forEach(function (entry) {
                    indexed_array[entry] = null;
                });
            }
    
            $('#input-search').autocomplete({
                data: indexed_array,
                limit: 6,
                onAutocomplete: function (val) {
                    $("#panel-attendIntro").css('display', 'none');
                    $("#mobile-panel-studentDetails").css('display', 'block');
                    $("#panel-studentDetails").css('display', 'block');
                    
                    $.ajax({
                        url: $.URL.GETROLLNO + '/' + val,
                        success: function (data) {
                            $("#profile-page-about-details li").each(function(i)
                            {
                               $(this).children('div').children('div:nth-child(2)').text(data.data[i]);
                            });
    
                            $("#mobile-profile-page-about-details li").each(function(i)
                            {
                               $(this).children('div').children('div:nth-child(2)').text(data.data[i]);
                            });
    
                            $("#profile-image, #mobile-profile-image").attr("src",data.image_path);
    
                            $("#input-search").val("");
                            
                        },
                        error: function (error) {
                            console.log(error);
                        }
                    });
                },
                minLength: 1,
            });
        }

        function displayImageOnCanvas(callback) {
            var image = new Image();
            image.src = $.URL.STREAMING;
            image.crossOrigin = "Anonymous";
            if (image.complete) {
                imageLoaded(callback);
            } else {
                image.addEventListener('load', function() {
                    var canvas = $('#canvas')[0];
                    var photoHeight = 960;
                    var photoWidth = 960;
                    var canvas = $('#canvas')[0];
                    var photo = $('#profile-image')[0];
                    var mobilePhoto = $('#mobile-profile-image')[0];
                    var video = $('#video');
                    var context = canvas.getContext('2d');
                    canvas.width = photoWidth;
                    canvas.height = photoHeight;
                    photo.setAttribute('src', image.src);
                    mobilePhoto.setAttribute('src', image.src);
                    context.drawImage(image, 0, 0, photoWidth, photoHeight);
                    dataURL = canvas.toDataURL("image/jpg");
                    callback()
                });
                image.addEventListener('error', function() {
                    alert('error')
                });
            }
        }

        function imageLoaded(callback) {
            var canvas = $('#canvas')[0];
            var photoHeight = 960;
            var photoWidth = 960;
            var canvas = $('#canvas')[0];
            var photo = $('#profile-image')[0];
            var mobilePhoto = $('#mobile-profile-image')[0];
            var video = $('#video');
            var context = canvas.getContext('2d');
            canvas.width = photoWidth;
            canvas.height = photoHeight;
            photo.setAttribute('src', image.src);
            mobilePhoto.setAttribute('src', image.src);
            context.drawImage(image, 0, 0, photoWidth, photoHeight);
            canvas.addEventListener('load', function() {
                callback()
            });
        }

    });

})(jQuery);