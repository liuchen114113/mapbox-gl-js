// @flow
'use strict';
declare module "@hymap/hymap-gl-supported" {
    declare type isSupported = (options?: {failIfMajorPerformanceCaveat: boolean}) => boolean;
    declare module.exports: isSupported;
}
