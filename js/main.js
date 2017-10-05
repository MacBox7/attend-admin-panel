(function ($) {

    $.URL = {
        FORMREGISTER: "something",
        REFRESHDATABASE: "something"
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
                success: function (data) {}
            }).done(function (data) {
                swal(
                    'Success!',
                    'All images have been processed',
                    'success'
                )
            }).error(function (data) {
                swal("Oops", "We couldn't connect to the server!", "error");
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

        localStorage.setItem("formDetails", $("#form-register").serialize());
        $("#modal-facecapture").modal("open");
        event.preventDefault();

    });

    $("#startbutton").click(function () {
        window.takepicture(function () {
            $.ajax({
                type: "POST",
                url: $.URL.FORMREGISTER,
                data: localStorage.getItem('formDetails'),
                success: function (data) {
                    localStorage.removeItem("formDetails");
                    $("#modal-facecapture").modal("close");
                    $("#modal-registration-form").modal("close");
                    alert(data);
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

})(jQuery);