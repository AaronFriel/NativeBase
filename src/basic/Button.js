import React, { Component } from "react";
import PropTypes from "prop-types";
import { TouchableOpacity, Platform, View, TouchableNativeFeedback } from "react-native";
import { connectStyle } from "native-base-shoutem-theme";
import _ from 'lodash';
import variable from "./../theme/variables/platform";
import { Text } from "./Text";
import { computeProps } from "../Utils/computeProps";

import mapPropsToStyleNames from "../Utils/mapPropsToStyleNames";

class Button extends Component {

	static contextTypes = {
		theme: PropTypes.object,
	};

	getInitialStyle() {
		return {
			borderedBtn: {
				borderWidth: this.props.bordered ? 1 : undefined,
				borderRadius: this.props.rounded && this.props.bordered ? variable.borderRadiusLarge : 2,
			},
		};
	}

	_root: React.ReactElement<TouchableOpacity | TouchableNativeFeedback>;

	prepareRootProps() {
		const defaultProps = {
			style: this.getInitialStyle().borderedBtn,
		};

		const {
			active: _active,
			androidRippleColor: _androidRippleColor,
			badge: _badge,
			block: _block,
			bordered: _bordered,
			danger: _danger,
			dark: _dark,
			disabled: _disabled,
			full: _full,
			iconLeft: _iconLeft,
			iconRight: _iconRight,
			info: _info,
			inputButton: _inputButton,
			large: _large,
			light: _light,
			primary: _primary,
			rounded: _rounded,
			small: _small,
			success: _success,
			transparent: _transparent,
			vertical: _vertical,
			warning: _warning,
      ...passThruProps
		} = computeProps(this.props, defaultProps);

		return passThruProps;
	}
	render() {
		const variables = this.context.theme
			? this.context.theme["@@shoutem.theme/themeStyle"].variables
			: variable;
		const children =
			Platform.OS === "ios"
				? this.props.children
				: React.Children.map(
						this.props.children,
						child =>
							(child && child.type === Text
								? React.cloneElement(child, { uppercase: true, ...child.props })
								: child)
					);
		if (Platform.OS !== "android" || variables.androidRipple === false || Platform.Version <= 21) {
			return (
				<TouchableOpacity
					{...this.prepareRootProps()}
					ref={c => (this._root = c)}
					activeOpacity={this.props.activeOpacity > 0 ? this.props.activeOpacity : 0.5}
				>
					{children}
				</TouchableOpacity>
			);
		} else {
			return (
				<TouchableNativeFeedback
					ref={c => (this._root = c)}
					onPress={this.props.onPress}
					background={
						this.props.androidRippleColor
							? TouchableNativeFeedback.Ripple(this.props.androidRippleColor)
							: TouchableNativeFeedback.Ripple(variables.androidRippleColor)
					}
					{...this.prepareRootProps()}
				>
					<View {...this.prepareRootProps()}>
						{children}
					</View>
				</TouchableNativeFeedback>
			);
		}
	}
}

Button.propTypes = {
	...TouchableOpacity.propTypes,
	style: PropTypes.oneOfType([PropTypes.object, PropTypes.number, PropTypes.array]),
	block: PropTypes.bool,
	primary: PropTypes.bool,
	transparent: PropTypes.bool,
	success: PropTypes.bool,
	danger: PropTypes.bool,
	warning: PropTypes.bool,
	info: PropTypes.bool,
	bordered: PropTypes.bool,
	disabled: PropTypes.bool,
	rounded: PropTypes.bool,
	large: PropTypes.bool,
	small: PropTypes.bool,
	active: PropTypes.bool,
};

const StyledButton = connectStyle("NativeBase.Button", {}, mapPropsToStyleNames)(Button);
export { StyledButton as Button };
