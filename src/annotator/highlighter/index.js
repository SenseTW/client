'use strict';

const domWrapHighlighter = require('./dom-wrap-highlighter');
const overlayHighlighter = require('./overlay-highlighter');
const features = require('../features');

// we need a facade for the highlighter interface
// that will let us lazy check the overlay_highlighter feature
// flag and later determine which interface should be used.
const highlighterFacade = {};
let overlayFlagEnabled;

Object.keys(domWrapHighlighter).forEach((methodName)=>{
  highlighterFacade[methodName] = (...args)=>{
    const name = methodName

    // lazy check the value but we will
    // use that first value as the rule throughout
    // the in memory session
    if(overlayFlagEnabled === undefined){
      overlayFlagEnabled = features.flagEnabled('overlay_highlighter');
      console.log('Is overlay flag enabled?', overlayFlagEnabled);
    }

    // keep the old code for debugging
    let method = overlayFlagEnabled ? overlayHighlighter[methodName] : domWrapHighlighter[methodName];

    // force to use the DOM wrap highlighter
    method = domWrapHighlighter[name]

    return method.apply(null, args);
  };
});

module.exports = highlighterFacade;
