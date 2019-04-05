$(function(){

    $(".save").on("click", function(event) {

        let id=$(this).data('id');
        
        $.ajax(`/api/${id}/save`, {
            type: 'PUT',
            success: function() {
                location.reload();
            }
        })
    })

    $(".clear").on("click", function(event) {

        $.ajax('/deleteall', {
            type: 'POST'
        }).then(
            function() {
                location.reload();
            }
        )
    })

    $(".delete-saved").on("click", function(event) {

        let id=$(this).data('id');
        
        $.ajax(`delete/article/${id}`, {
            type: 'POST'
        }).then(
            function() {
                location.reload();
            }
        )
    })

    $(".save-note").on("click", function(event) {

        let id=$(this).data('id');

        $.ajax(`/api/notes/${id}`, {
            type: 'POST',
            data: {
                body: $(".note-body").val().trim(),
            },
            success: function() {
                $(".close").trigger("click")
            }
        }).then(function() {
            location.reload();
        })
    })

    $("#notesmodal").on("show.bs.modal", function(event) {

        let id=$(this).data('id');
        $.ajax(`/api/notes/${id}`, {
            type: 'GET'
        }).then(function(notes) {
            // console.log(notes.note.body)
            // console.log(notes.note.id)
            $(`#${notes.note._id}`).append(notes.note.body)
        })
    })

    $(".delete-note").on("click", function(event) {

        let id=$(this).data('id');
        $.ajax(`/api/notes/${id}`, {
            type: 'POST'
        }).then(function() {
            $(`#${id}`).empty();
        })
    })
})