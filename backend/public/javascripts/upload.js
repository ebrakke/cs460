$(document).ready(function() {
    $('#createnew').click(function(event) {
        event.preventDefault();
        $('#upload-form').prepend('<label id="new-album-label" for="photo">Name your album</label>');
        $('#album-name').attr('value', null);
        $('#album-name').attr('type', 'text');
        $('#upload-form').attr('action', '/album');
        $('button.dropdown-toggle').html("Create new album <span class='caret'></span>");
    });

    $('a.selection').click(function(event) {
        event.preventDefault();
        $('#album-name').attr('type', 'hidden');
        $('#album-name').attr('value', this.name);
        $('button.dropdown-toggle').html(this.text + " <span class='caret'></span>");
        $('#new-album-label').remove();
        $('#upload-form').attr('action', '/album/add');
    });
});
