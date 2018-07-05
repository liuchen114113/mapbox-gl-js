// @flow
declare module "curvemap-gl-js-test" {
    declare type CreateTest = (name: string, body: (test: CreateTest) => void) => void;
    declare module.exports: { test: CreateTest };
}
