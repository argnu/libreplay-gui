<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header("Access-Control-Allow-Headers: X-Requested-With, Content-Type, Accept, Origin");


// setup the autoloading
require_once 'vendor/autoload.php';

use Liberascio\Mpd;
use Liberascio\Model;
use Liberascio\Db;


Flight::map('notFound', function(){
    Flight::json(array('msg'=> 'No existe un recurso con dicha URI'), 404);
});

// Flight::map('error', function(Exception $e){
//   $restapi_logger = \Flight::get('restapi_logger');
//   $restapi_logger->error($e->getMessage(), array('trace' => $e->getTraceAsString()));
//   Flight::json(array('msg'=> 'Error en el servidor'), 500);
// });

Flight::route('OPTIONS *', function() {
  return;
});

Flight::route('GET /rest/artists', function() {
  $artists = Model::getArtists();
  Flight::json($artists);
});

Flight::route('GET /rest/songs', function() {
  $query = Flight::request()->query;
  $songs = Model::getSongs($query);
  Flight::json($songs);
});

Flight::route('GET /player/query', function() {
  $query = Flight::request()->query;
  $mpd = new Mpd('10.1.38.88', 6600);
  Flight::json($mpd->doQuery($query['q']));
});

Flight::route('GET /player/status', function() {
  $mpd = new Mpd('10.1.38.88', 6600);
  Flight::json($mpd->doQuery('status'));
});

Flight::route('POST /player/add', function() {
  $file = Flight::request()->data->file;
  $mpd = new Mpd('10.1.38.88', 6600);
  Flight::json($mpd->doQuery("add \"$file\""));
});

Flight::route('POST /player/playback', function() {
  $command = Flight::request()->data->command;
  $params = Flight::request()->data->params;
  $query = "$command ";
  if ($params) $query .= "$params ";
  $mpd = new Mpd('10.1.38.88', 6600);
  Flight::json($mpd->doQuery($query));
});

Flight::route('POST /player/playlist', function() {
  $command = Flight::request()->data->command;
  $params = Flight::request()->data->params;
  $query = "$command ";
  if ($params) $query .= "$params ";
  $mpd = new Mpd('10.1.38.88', 6600);
  Flight::json($mpd->doQuery($query));
});


Flight::route('GET /rest/update', function() {
  $db = new Db();
  if(!$db) {
     Flight::json(array("error" => $db->lastErrorMsg()));
  } else {
    $mpd = new Mpd();
    $mpd->connect('10.1.38.88', 6600);
    $res = $mpd -> query("list artist");
    $elems = preg_split("/\n/", $res['data']);

    //ADD ARTIST TO DATABASE
    foreach ($elems as $elem) {
      if (preg_match('/^Artist:\s*(.*)$/', trim($elem), $matches)) {
        $artist_name = $matches[1];
        $ret = $db->query("SELECT id FROM artist WHERE name = \"$artist_name\"");
        $row = $ret->fetchArray();
        if (!$row) {
          $db->exec("INSERT INTO artist (name) VALUES (\"$artist_name\")");
          $artist_id = $db->lastInsertRowID();
        }
        else {
          $artist_id = $row['id'];
        }

        $res = $mpd -> query("find artist \"$artist_name\"");
        $songs = [];
        $songs_elems = preg_split("/\n/", $res['data']);
        for ($i=0; $i < count($songs_elems); $i++) {
          $elem = $songs_elems[$i];
          if (preg_match('/^file:\s*(.*)$/', trim($elem), $matches)) {
            $song = array();
            $song['file'] = $matches[1];
          }
          else if (preg_match('/^Artist:\s*(.*)$/', trim($elem), $matches)) {
            $song['artist'] = $matches[1];
          }
          else if (preg_match('/^Title:\s*(.*)$/', trim($elem), $matches)) {
            $song['title'] = $matches[1];
          }
          else if (preg_match('/^Album:\s*(.*)$/', trim($elem), $matches)) {
            $song['album'] = $matches[1];
          }
          else if (preg_match('/^duration:\s*(.*)$/', trim($elem), $matches)) {
            $song['duration'] = $matches[1];
          }
          else if (preg_match('/^Track:\s*(.*)$/', trim($elem), $matches)) {
            $song['track'] = $matches[1];
            $songs[] = $song;
          }
        }

        foreach ($songs as $song) {
          $album_name = isset($song['album']) ? $song['album'] : 'Album Desconocido';
          $ret = $db->query("SELECT id FROM album WHERE name = \"$album_name\"");
          $row = $ret->fetchArray();
          if (!$row) {
            $db->exec("INSERT INTO album (name, artistId) VALUES (\"$album_name\", $artist_id)");
            $album_id = $db->lastInsertRowID();
          }
          else {
            $album_id = $row['id'];
          }

          $ret = $db->query("SELECT uri FROM song WHERE uri = \"{$song['file']}\"");
          if (!$ret->fetchArray()) {
            $duration = floatval($song['duration']);
            $title = isset($song['title']) ? str_replace("\"", "'", $song['title']): '';
            $db->exec("INSERT INTO song (name, track, uri, duration, artistId, albumId) VALUES (\"$title\", {$song['track']}, \"{$song['file']}\", $duration, $artist_id, $album_id)");
          }
        }

      }
    }
  }
});



Flight::start();

?>
