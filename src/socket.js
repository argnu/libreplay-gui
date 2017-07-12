import * as io from 'socket.io-client';
import { Config } from './configs/Config';

export const socket = io.connect(Config.host);
