import React from 'react';
import { TouchableOpacity } from 'react-native';

const Button = props => (
    <TouchableOpacity activeOpacity={0.6} {...props}>
      {props.children}
    </TouchableOpacity>
  );

module.exports = Button;
// export default Button;
