$(function () {
  var $loader = $('#loader');
  var $message = $('#message');
  var $items_list = $('#item_list');
  var $query = $('#f_search_q');
  var $size = $('#f_search_size');
  var $images = $('#f_search_img');

  $loader.hide();

  $('#searchbtn').on('click', function() {
    $loader.show();

    var search = {
      query: $query.val(),
      size: $size.val(),
      images: $images.val()
    };

    $.ajax({
      type: 'POST',
      url: '/search',
      data: JSON.stringify(search),
      contentType: 'application/json',
      dataType: 'json',
      success: function(newSearch){
        $items_list.html(newSearch.my_html);
        $loader.hide();
        //$message.html('<li>' + JSON.stringify(newSearch.message) + '</li>');
      },
      error: function(newSearch) {
        alert(JSON.stringify(newSearch));
        $loader.hide();
      }
    });
  });

  var offset = 250;
  var duration = 300;

  $(window).scroll(function() {
    if ($(this).scrollTop() > offset) {
      $('.back-to-top').fadeIn(duration);
    } else {
      $('.back-to-top').fadeOut(duration);
    }
  });

  $('.back-to-top').on('click', function(event) {
        event.preventDefault();
        $('html, body').animate({scrollTop: 0}, duration);
        return false;
    });

// For entering new note in modal
  function appendNote(newNote) {
    return "<p>" + newNote.id + ": " + newNote.note + "</p>";
  }
  var $f_note_new = $('#f_note_new');
  var $f_itemid = $('#f_itemid');
  var $note_list_modal = $('#noteListModal');

  $('#newNoteBtn').on('click', function(){
    var note = {
      note: $f_note_new.val(),
      itemid: $f_itemid.val()
    };

    $.ajax({
      type: 'POST',
      url: '/note/create',
      data: JSON.stringify(note),
      contentType: 'application/json',
      dataType: 'json',
      success: function(newNote){
        //console.log(JSON.stringify(newNote));
        $note_list_modal.append(appendNote(newNote));
      },
      error: function(newNote) {
        alert(JSON.stringify(newNote));
      }
    });
  });

});
