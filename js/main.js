(function ($) {

    $.URL = {
        FORMREGISTER: "http://localhost:5000/api/admin/store",
        REFRESHDATABASE: "http://127.0.0.1:5000/api/openface/train"
    };

    $(document).ready(function () {
        materializeInit();

    });

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
                url: URL.REFRESHDATABASE,
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
        window.takepicture(function () {
            var data = JSON.parse(localStorage.getItem('formDetails'));

            data.push({
                name: 'base64Image',
                value: 'url-to-image'
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
                },
                error: function (error) {
                    console.log(error);
                }
            });
        });
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
        var dataURL = canvas.toDataURL("image/png");
        var base64Image = dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
        return base64Image;
    }

    function convertToJSON(unindexed_array){
        var indexed_array = {};
    
        $.map(unindexed_array, function(n, i){
            indexed_array[n['name']] = n['value'];
        });
    
        return JSON.stringify(indexed_array);
    }

})(jQuery);