//jshint esversion:6
import * as io from 'socket.io-client';
// import { EventBus } from './EventBus';

export const socket = io.connect('http://localhost:3000');
