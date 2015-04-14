$(document).ready(function() {
    $('#createnew').click(function(event) {
        event.preventDefault();
        $('#upload-form').prepend('<input class="form-control" type=text name="albumName" id="album-name"></input>');
        $('#upload-form').prepend('<label for="photo">Name your album</label>');
        $('#upload-form').attr('action', '/album/')
    });
});
