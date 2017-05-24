import * as APlayer from 'aplayer';

let player;

function getSongUrl(song) {
  return 'http://localhost:3000/files/songs/' + song.id;
}

function getAlbumArt(song) {
  console.log('http://localhost:3000/files/album-art/' + song.albumId);
  return 'http://localhost:3000/files/album-art/' + song.albumId;
}

export class Player {
  constructor(ref, song) {
    if (!player && song) {
      this.player = new APlayer({
          element: ref,
          narrow: false,                                                     // Optional, narrow style
          autoplay: true,                                                    // Optional, autoplay song(s), not supported by mobile browsers
          // showlrc: 0,                                                        // Optional, show lrc, can be 0, 1, 2, see: ###With lrc
          // mutex: true,                                                       // Optional, pause other players when this player playing
          // theme: '#e6d0b2',                                                  // Optional, theme color, default: #b7daff
          // mode: 'random',                                                    // Optional, play mode, can be `random` `single` `circulation`(loop) `order`(no loop), default: `circulation`
          // preload: 'none',                                               // Optional, the way to load music, can be 'none' 'metadata' 'auto', default: 'auto'
          // listmaxheight: '513px' ,                                             // Optional, max height of play list
          music: {
            title: song.name,
            author: song.artist.name,
            url: getSongUrl(song),
            pic: getAlbumArt(song)
          }
      });
      player = this.player;
    }
    else if (player && song) {
      this.player = player;
      this.addSong(song);
    }
    else if (player && !song) {
      this.player = player;
    }
  }

  addSong(song) {
    this.player.addMusic([{
      title: song.name,
      author: song.artist.name,
      url: getSongUrl(song),
      pic: getAlbumArt(song)
    }]);
  }

  playNext() {
    this.player.setMusic(this.player.playIndex + 1);
  }

  playLast() {
    this.player.setMusic(this.player.option.music.length - 1);
  }
}
