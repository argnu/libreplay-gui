<?php

namespace Liberascio;

 class Db extends \SQLite3 {
    function __construct() {
       $this->open('music.db');
       $ret = $this->query("SELECT name FROM sqlite_master WHERE type='table' AND name='artist'");
       if (!$ret->fetchArray()) {
         $this->exec('CREATE TABLE artist (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(255))');
         $this->exec('CREATE TABLE album (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(255), artistId INTEGER REFERENCES artist (id) ON DELETE CASCADE ON UPDATE CASCADE)');
         $this->exec('CREATE TABLE song (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(255), track INTEGER(2), uri VARCHAR(255), duration FLOAT, albumId INTEGER REFERENCES album (id) ON DELETE CASCADE ON UPDATE CASCADE, artistId INTEGER REFERENCES artist (id) ON DELETE SET NULL ON UPDATE CASCADE)');
       }
    }

 }

?>
