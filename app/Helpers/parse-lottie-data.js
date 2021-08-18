'use strict';

module.exports = (data, rundownItem) => {
  let idxEnableDropShadow;
  let idxScale;
  let colorProperty = [
    'FillColor1', 'FillColor2',
    'FillColor3', 'FillColor4',
    'StrokeColor1', 'StrokeColor2',
    'StrokeColor3', 'StrokeColor4'
  ];
  const lottiedatasample = { // default data variable
    pauseTimelineDuration: 4000,
    h1text: 'Bøaty McBøatfåce',
    h2text: 'Bright Yellow Submarine',
    h1color: '#ebe834',
    h2color: '#c40093',
    element1fill: '',
    element2fill: '',
    element3fill: '',
    element4fill: '',
    element1isgradient: false,
    element2isgradient: false,
    element3isgradient: true,
    element4isgradient: false,
    element1stroke: '#deb602',
    element2stroke: '#53de02',
    element3stroke: '#027af2',
    element4stroke: '#cc62fc',
  };
  let isHasImage = false;
  const content = rundownItem.content && rundownItem.content !== '' ? JSON.parse(rundownItem.content) : {};
  if (data.layers[0].nm == 'OPT') {
    const opts = data.layers[0].ef;
    // eslint-disable-next-line no-undef
    opts.forEach((efs, j) => {
      // eslint-disable-next-line eqeqeq
      if (inArray(efs.nm, colorProperty) != -1) { // non Binary property
        colorProperty[efs.nm] = efs.ef[0].v.k;
        colorProperty[`idx${efs.nm}`] = j;
      } else {
        // eslint-disable-next-line eqeqeq
        colorProperty[efs.nm] = (efs.ef[0].v.k != 0);
        // eslint-disable-next-line eqeqeq
        if (efs.nm == 'EnableDropShadow') idxEnableDropShadow = j;
        // eslint-disable-next-line eqeqeq
        if (efs.nm == 'Scale') idxScale = j;
      }
    });
    if (data && data.layers[0] && data.layers[0].ef[idxScale] && data.layers[0].ef[idxScale].ef[0] 
      && data.layers[0].ef[idxScale].ef[0].v  && data.layers[0].ef[idxScale].ef[0].v.k) {
      if (content.lottieScale && content.lottieScale === 'default') {
        data.layers[0].ef[idxScale].ef[0].v.k = 100;
      } else if (content.lottieScale && content.lottieScale === 'small') {
        data.layers[0].ef[idxScale].ef[0].v.k = 55;
      } else if (content.lottieScale && content.lottieScale === 'large') {
        data.layers[0].ef[idxScale].ef[0].v.k = 175;
      }
    }
    
  }
  data.layers.forEach((obj, k) => {
    // eslint-disable-next-line eqeqeq
    if (obj.nm == 'H1TEXT' && content.h1) {
      if (content.h1) obj.t.d.k[0].s.t = content.h1 ? content.h1 : lottiedatasample.h1text;
      if (content.h1_color) obj.t.d.k[0].s.fc = hexrgbobj(content.h1_color);
      if (content.h1_color) obj.ks.o.k = hexalpha(content.h1_color);
    }

    // eslint-disable-next-line eqeqeq
    if (obj.nm == 'H2TEXT' && content.h2) {
      if (content.h2) obj.t.d.k[0].s.t = content.h2 ? content.h2 : lottiedatasample.h2text;
      if (content.h2_color) obj.t.d.k[0].s.fc = hexrgbobj(content.h2_color);
      if (content.h2_color) obj.ks.o.k = hexalpha(content.h2_color);
    }

    // eslint-disable-next-line eqeqeq
    if (obj.nm == 'H3TEXT' && content.h3) {
      if (content.h3) obj.t.d.k[0].s.t = content.h3 ? content.h3 : lottiedatasample.h3text;
      if (content.h3_color) obj.t.d.k[0].s.fc = hexrgbobj(content.h3_color);
      if (content.h3_color) obj.ks.o.k = hexalpha(content.h3_color);
    }

    // eslint-disable-next-line eqeqeq
    if (obj.nm == 'H4TEXT' && content.h4) {
      if (content.h4) obj.t.d.k[0].s.t = content.h4 ? content.h4 : lottiedatasample.h4text;
      if (content.h4_color) obj.t.d.k[0].s.fc = hexrgbobj(content.h4_color);
      if (content.h4_color) obj.ks.o.k = hexalpha(content.h4_color);
    }

    // eslint-disable-next-line eqeqeq
    if (obj.nm == 'ELEMENT1' && content.color_1) {
      obj.shapes[0].it.forEach((objel1, j) => {
        // eslint-disable-next-line eqeqeq
        if (content.color_1) elgradfill(objel1, content.gradient ? content.gradient : false, content.color_1, 1);
        // eslint-disable-next-line eqeqeq
        if (content.color_1 && objel1.ty == 'st') objel1.c.k = hexrgbarr(content.color_1);
      });
    }

    // eslint-disable-next-line eqeqeq
    if (obj.nm == 'ELEMENT2' && content.color_2) {
      obj.shapes[0].it.forEach((objel2, j) => {
        // eslint-disable-next-line eqeqeq
        if (content.color_2) elgradfill(objel2, content.gradient ? content.gradient : false, content.color_2, 1);
        // eslint-disable-next-line eqeqeq
        if (content.color_2 && objel2.ty == 'st') objel2.c.k = hexrgbarr(content.color_2);
      });
    }

    // eslint-disable-next-line eqeqeq
    if (obj.nm == 'ELEMENT3' && content.color_3) {
      obj.shapes[0].it.forEach((objel3, j) => {
        // eslint-disable-next-line eqeqeq
        if (content.color_3) elgradfill(objel3, content.gradient ? content.gradient : false, content.color_3, 1);
        // eslint-disable-next-line eqeqeq
        if (content.color_3 && objel3.ty == 'st') objel3.c.k = hexrgbarr(content.color_3);
      });
    }
    // eslint-disable-next-line eqeqeq
    if (obj.nm == 'ELEMENT4' && content.color_4) {
      obj.shapes[0].it.forEach((objel4, j) => {
        // eslint-disable-next-line eqeqeq
        if (content.color_4) elgradfill(objel4, content.gradient ? content.gradient : false, content.color_4, 1);
        // eslint-disable-next-line eqeqeq
        if (content.color_4 && objel4.ty == 'st') objel4.c.k = hexrgbarr(content.color_4);
      });
    }
    // eslint-disable-next-line eqeqeq
    if (obj && obj.ef && obj.ef[0] && obj.ef[0].nm == 'isHasImage') {
      // eslint-disable-next-line eqeqeq
      isHasImage = obj.ef[0].ef[0].v.k;
      // array does not exist, is not an array, or is empty
      // ⇒ do not attempt to process array
    }
  });

  lottiedatasample.element1fill = content.color_1;
  lottiedatasample.element2fill = content.color_2;
  lottiedatasample.element3fill = content.color_3;
  lottiedatasample.element4fill = content.color_4;
  const idxFillColor = [
    22, 23, 24, 25
  ]
  // ensure the color folow the global option color for all element
  for (let idx = 1; idx < 5; idx++) {
    if (data.layers[0].ef) {
      if (lottiedatasample[`element${idx}fill`]) data.layers[0].ef[idxFillColor[idx - 1]].ef[0].v.k = hexrgbarr(lottiedatasample[`element${idx}fill`]); // global color method, works on all layer, except gradient fill
    }
  }

  if (Array.isArray(data.assets) && data.assets.length && isHasImage) {
    if (content.mediaUrl) data.assets[0].u = content.mediaUrl;
    if (content.mediaUrl) data.assets[0].p = '';
  }
  if (idxEnableDropShadow) {
    data.layers[0].ef[idxEnableDropShadow].ef[0].v.k = content.textDropShadow ? 1 : 0; // dropshadow toggle
  }
  return data;
}

function inArray(elem, array) {
  if (array.indexOf) {
    return array.indexOf(elem);
  }

  for (var i = 0, length = array.length; i < length; i++) {
    if (array[i] === elem) {
      return i;
    }
  }

  return -1;
}

function hexrgbobjgrad(hex) {
  const xhex = (hex.length === 7) ? hex : hex.slice(0, -2);
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(xhex);
  const baser = floatnum(result[1]); // red
  const baseg = floatnum(result[2]); // green
  const baseb = floatnum(result[3]); // blue
  const grdratio = [1.3, 1.8]; // less
  return result ? {
    0: 0,
    1: baser, // red
    2: baseg, // green
    3: baseb, // blue
    4: 0.5,
    5: baser / grdratio[0], // red gradient
    6: baseg / grdratio[0], // green gredien
    7: baseb / grdratio[0], // blue gradien
    8: 1,
    9: baser / grdratio[1],
    10: baseg / grdratio[1],
    11: baseb / grdratio[1],
  } : null;
}

function floatnum(num) {
  return Math.round(parseInt(num, 16) / 255 * 1000000000000) / 1000000000000;
}

function hexrgbobj(hex) {
  const xhex = (hex.length === 7) ? hex : hex.slice(0, -2);
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(xhex);
  return result ? {
    0: floatnum(result[1]),
    1: floatnum(result[2]),
    2: floatnum(result[3]),
    3: 1,
  } : null;
}

function hexrgbarr(hex) {
  const xhex = (hex.length === 7) ? hex : hex.slice(0, -2);
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(xhex);
  return result ? [
    floatnum(result[1]),
    floatnum(result[2]),
    floatnum(result[3]),
    1,
  ] : null;
}

function hexalpha(hex) {
  return (hex.length !== 9) ? 100 : floatnum(hex.slice(-2)).toFixed(2) * 100;
}

function elgradfill(obj, flag, hex) {
  if (obj.ty === 'gf') {
    if (flag) {
      obj.g.k.k = hexrgbobjgrad(hex); // get gradient from hex rgb
      obj.o.k = hexalpha(hex);
    } else {
      obj.o.k = 0;
    }
  }

  if (obj.ty === 'fl') {
    if (!flag) {
      obj.c.k = hexrgbarr(hex); // get array rgb from hex
      obj.o.k = hexalpha(hex);
    } else {
      obj.o.k = 0;
    }
  }
}