/** @jsx jsx */
import { jsx } from '@emotion/core';
import React from 'react';
import { borderRadius, colors, gridSize } from '@arch-ui/theme';
const PREVIEW_COUNT = 5;
export default (({
  data
}) => {
  var _data$images;

  const images = (_data$images = data.images) !== null && _data$images !== void 0 ? _data$images : [];
  const previews = images.slice(0, PREVIEW_COUNT);
  const remainder = images.length - PREVIEW_COUNT;
  return jsx("div", {
    css: {
      display: 'flex',
      marginLeft: gridSize / 2 * -1
    }
  }, previews.map(({
    caption,
    image
  }) => jsx("div", {
    key: image.id,
    css: {
      paddingLeft: gridSize / 2
    }
  }, jsx("img", {
    src: image.publicUrlTransformed,
    alt: caption,
    css: {
      width: 24,
      height: 24,
      borderRadius: borderRadius / 2,
      display: 'block'
    }
  }))), remainder > 0 && jsx("div", {
    css: {
      paddingLeft: gridSize / 2
    }
  }, jsx("div", {
    css: {
      width: 24,
      height: 24,
      borderRadius: borderRadius / 2,
      background: colors.N15,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: '10px',
      fontWeight: 'bold',
      color: colors.N50
    }
  }, "+", remainder)));
});