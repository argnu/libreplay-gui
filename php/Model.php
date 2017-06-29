<?php

namespace Liberascio;

class Model {

  public static function getArtists() {
    $db = new Db();
    $artists = [];

    $ret = $db->query('SELECT * FROM artist');
    while($row = $ret->fetchArray()) {
        $artist = array("name" => $row['name'], "id" => $row['id'], "albums" => []);
        $ret_al = $db->query("SELECT * FROM album WHERE artistId={$row['id']}");
        while($row_al = $ret_al->fetchArray()) {
          $album = array("name" => $row_al['name'], "id" => $row_al['id'], "artistId" => $row['id']);
          $artist['albums'][] = $album;
        }
        $artists[] = $artist;
    }

    return $artists;
  }

  public static function getSongs($query) {
    $db = new Db();
    $songs = [];
    $where = "";
    if (isset($query['albumId'])) $where = "WHERE albumId={$query['albumId']}";
    else if (isset($query['artistId'])) $where = "WHERE artistId={$query['artistId']}";
    $limit = isset($query['limit']) ? " LIMIT {$query['limit']} " : '';
    $offset = (isset($query['limit']) && isset($query['offset'])) ? " OFFSET {$query['offset']} " : '';

    $ret = $db->query("SELECT * FROM song $where $limit $offset");
    while($row = $ret->fetchArray()) {
        $song = array("uri" => $row['uri'], "duration" => $row['duration'], "name" => $row['name'], "id" => $row['id'],
                "track" => $row['track'], "artistId" => $row['artistId'], "albumId" => $row['albumId']);

        $ret_art = $db->query("SELECT name FROM artist WHERE id={$row['artistId']}");
        $art = $ret_art->fetchArray();
        $song['artist'] = array("name" => $art['name']);

        $ret_alb = $db->query("SELECT name FROM artist WHERE id={$row['artistId']}");
        $alb = $ret_alb->fetchArray();
        $song['album'] = array("name" => $alb['name']);

        $songs[] = $song;
    }

    return $songs;
  }

}

?>
