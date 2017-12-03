import React from 'react';
import { TouchableOpacity } from 'react-native';

const Button = props => (
    <TouchableOpacity {...props}>
      {props.children}
    </TouchableOpacity>
  );

export default Button;
