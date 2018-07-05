// @flow

import window from '../window';
import curvemapgl from '../../';

import type {WorkerInterface} from '../web_worker';

export default function (): WorkerInterface {
    return (new window.Worker(curvemapgl.workerUrl): any);
}
