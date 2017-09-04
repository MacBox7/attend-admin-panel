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
         swal(
             'Success!',
             'All images have been processed',
             'success'
         )
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

 function materializeInit() {
     $(".button-collapse").sideNav();
     $('select').material_select();
     $('.modal').modal();
 }