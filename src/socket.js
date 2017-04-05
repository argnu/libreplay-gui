//jshint esversion:6
import * as io from 'socket.io-client';

export var socket = io.connect('http://localhost:3000');
