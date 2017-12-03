import React from 'react';
import { TouchableOpacity } from 'react-native';

const Button = props => (
    <TouchableOpacity activeOpacity={0.6} {...props}>
      {props.children}
    </TouchableOpacity>
  );

export default Button;
