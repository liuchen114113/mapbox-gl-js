/*---
title: Fit to the bounds of a LineString
description: >-
  Get the bounds of a LineString by passing its first coordinates to
  [`LngLatBounds`](https://www.curvemap.com/curvemap-gl-js/api/#lnglatbounds)
  and chaining [`extend`](https://www.curvemap.com/curvemap-gl-js/api/#lnglatbounds#extend)
  to include the last coordinates.
tags:
  - user-interaction
pathname: /curvemap-gl-js/example/zoomto-linestring/
---*/
import Example from '../../components/example';
import html from './zoomto-linestring.html';
export default Example(html);
