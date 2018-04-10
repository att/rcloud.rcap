define([], function() {

    'use strict';

    /* jshint ignore:start */
    var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
    
    var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };
    
    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
    
    function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
    
    function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
    
    var regQuillLinkType = function() {
    
      var Link = Quill.import('formats/link');
    
      var rcapLink = function (_Link) {
        _inherits(rcapLink, _Link);
    
        function rcapLink() {
          _classCallCheck(this, rcapLink);
    
          return _possibleConstructorReturn(this, (rcapLink.__proto__ || Object.getPrototypeOf(rcapLink)).apply(this, arguments));
        }
    
        _createClass(rcapLink, null, [{
          key: 'create',
          value: function create(value) {
            var node = _get(rcapLink.__proto__ || Object.getPrototypeOf(rcapLink), 'create', this).call(this, value);
            value = this.sanitize(value);
    
            if (value.startsWith('#')) {
              node.removeAttribute('target');
            }
            return node;
          }
        }]);
    
        return rcapLink;
      }(Link);
    
      Quill.register(rcapLink);
    };
    /* jshint ignore:end */

    return regQuillLinkType;  /* jshint ignore:line */
});
