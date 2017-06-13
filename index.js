#!/usr/bin/env node

var getPixels = require("get-pixels")

var args = process.argv.slice(2)

var file = args[0]

if(!file) {
  console.log('Plx tell me what file to convert.')
  return
}

getPixels(args[0], function(err, pixels) {
  if(err) {
    console.log("Bad image path")
    return
  }
  var offset = 0

  // TODO write out all frames from an animation instead, for instance
  // seperated with a line with '======'?
  if(pixels.shape.length === 4) {
    offset = 1
  }
  var img = []
  for(var j = 0; j < pixels.shape[1 + offset]; j++) {
    var row = []
    for(var i = 0; i < pixels.shape[0 + offset]; i++) {
      var pixel = []
      for(var k = 0; k < pixels.shape[2 + offset]; k++) {
        if(offset === 1) {
          // Animation (sometimes with only one frame!)
          pixel.push(pixels.get(0, i,j,k))
        } else {
          // Non animation
          pixel.push(pixels.get(i,j,k))
        }
      }
      //row.push(pixel.reduce((a,b) => a+b > 0 ? 1:0))
      row.push(reducePixel(pixel))
    }
    console.log(row.join(' '))
    img.push(row)
  }
})

// TODO: not taking alpha channel into account. Pretend that background are some
// given color (white by default) and compute the "real" RGB based on that
function reducePixel(pixel) {
  var alpha = pixel[3] / 255
  var r, g, b

  // TODO make background color an option
  var assumedBackground = 255

  // Convert RGB to alpha
  function fromAlpha(color, alpha) {
    return (color * alpha) + ((1 - alpha) * assumedBackground)
  }

  function toHex(color) {
    return ('0' + color.toString(16)).slice(-2)
  }

  r = fromAlpha(pixel[0], alpha)
  g = fromAlpha(pixel[1], alpha)
  b = fromAlpha(pixel[2], alpha)

  return toHex(r) + toHex(g) + toHex(b)
}
