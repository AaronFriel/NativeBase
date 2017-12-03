Object.defineProperty(exports,"__esModule",{value:true});var _extends=Object.assign||function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source){if(Object.prototype.hasOwnProperty.call(source,key)){target[key]=source[key];}}}return target;};var _jsxFileName='src/basic/Tabs/SceneComponent.js';var _react=require('react');var _react2=_interopRequireDefault(_react);
var _reactNative=require('react-native');

var _StaticContainer=require('./StaticContainer');var _StaticContainer2=_interopRequireDefault(_StaticContainer);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _objectWithoutProperties(obj,keys){var target={};for(var i in obj){if(keys.indexOf(i)>=0)continue;if(!Object.prototype.hasOwnProperty.call(obj,i))continue;target[i]=obj[i];}return target;}

var SceneComponent=function SceneComponent(Props){var
shouldUpdated=Props.shouldUpdated,props=_objectWithoutProperties(Props,['shouldUpdated']);
return(
_react2.default.createElement(_reactNative.View,_extends({},props,{__source:{fileName:_jsxFileName,lineNumber:9}}),
_react2.default.createElement(_StaticContainer2.default,{shouldUpdate:shouldUpdated,__source:{fileName:_jsxFileName,lineNumber:10}},
props.children)));



};exports.default=

SceneComponent;
//# sourceMappingURL=SceneComponent.js.map