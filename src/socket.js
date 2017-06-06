//jshint esversion:6
import * as io from 'socket.io-client';
// import { EventBus } from './EventBus';

export const socket = io.connect('https://localhost:3000');
