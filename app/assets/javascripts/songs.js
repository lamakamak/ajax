function toggleDone() {
  var checkbox = this;
  var tableRow = $(this).parent().parent();

  var songId = tableRow.data('id');
  var isCompleted = !tableRow.hasClass("success");


  $.ajax({
    type: "PUT",
    url: "/songs/" + songId + ".json",
    data: JSON.stringify({
      song: { completed: isCompleted }
    }),
    contentType: "application/json",
    dataType: "json"})

    .done(function(data) {
      console.log(data);

      tableRow.toggleClass("success", data.completed);

      updateCounters();
    });
}

function updateCounters() {
  $("#total-count").html($(".song").size());
  $("#completed-count").html($(".success").size());
  $("#song-count").html($(".song").size() - $(".success").size());
}

function createSong(title) {
  var newSong = { title: title, completed: false };

  $.ajax({
    type: "POST",
    url: "/songs.json",
    data: JSON.stringify({
      song: newSong
    }),
    contentType: "application/json",
    dataType: "json"
  })
  .done(function(data) {
    console.log(data);

    var checkboxId = data.id;

    var label = $('<label></label>')
      .attr('for', checkboxId)
      .html(title);

    var checkbox = $('<input type="checkbox" value="1" />')
      .attr('id', checkboxId)
      .bind('change', toggleDone);

    var tableRow = $('<tr class="song"></td>')
      .attr('data-id', checkboxId)
      .append($('<td>').append(checkbox))
      .append($('<td>').append(label));

    $("#songList").append(tableRow);

    updateCounters();
  })

  .fail(function(error) {
    console.log(error)
    error_message = error.responseJSON.title[0];
    showError(error_message);
  })

  function showError(message) {
    var errorHelpBlock = $('<span class="help-block"></span>')
      .attr('id', 'error_message')
      .text(message);

    $("#formgroup-title")
      .addClass("has-error")
      .append(errorHelpBlock);
  }
}


function resetErrors() {
  $("#error_message").remove();
  $("#formgroup-title").removeClass("has-error");
}

function submitSong(event) {
  event.preventDefault();
  resetErrors();

  createSong($("#song_title").val());
  $("#song_title").val(null);
  updateCounters();
}

function cleanUpDoneSongs(event) {
  event.preventDefault();

  $.each($(".success"), function(index, tableRow) {
    songId = $(tableRow).data('id');
    deleteSong(songId);
  });
}

$(document).ready(function() {
  $("input[type=checkbox]").bind('change', toggleDone);
  $("form").bind('submit', submitSong);
  $("#clean-up").bind('click', cleanUpDoneSongs);
  updateCounters();
});


function deleteSong(songId) {
  $.ajax({
    type: "DELETE",
    url: "/songs/" + songId + ".json",
    contentType: "application/json",
    dataType: "json"
  })
  .done(function(data) {
    $('tr[data-id="'+songId+'"]').remove();
    updateCounters();
  });
}
