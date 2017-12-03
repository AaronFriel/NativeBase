import React, { Component } from "react";
import PropTypes from "prop-types";
import { TouchableHighlight, Platform, TouchableNativeFeedback, View } from "react-native";

import { connectStyle } from "native-base-shoutem-theme";
import mapPropsToStyleNames from "../Utils/mapPropsToStyleNames";
import variable from "../theme/variables/platform";

class ListItem extends Component {
	static contextTypes = {
		theme: PropTypes.object,
	};
	render() {
		const variables = this.context.theme ? this.context.theme["@@shoutem.theme/themeStyle"].variables : variable;

		const {
			androidRippleColor: _androidRippleColor,
			avatar: _avatar,
			button: _button,
			first: _first,
			header: _header,
			icon: _icon,
			iconLeft: _iconLeft,
			iconRight: _iconRight,
			itemDivider: _itemDivider,
			itemHeader: _itemHeader,
			last: _last,
			noBorder: _noBorder,
			note: _note,
			selected: _selected,
			...passThruProps,
		} = this.props;

		if (
			Platform.OS === "ios" ||
			variables.androidRipple === false ||
			(!this.props.onPress && !this.props.onLongPress) ||
			Platform.Version <= 21
		) {
			return (
				<TouchableHighlight
					onPress={this.props.onPress}
					onLongPress={this.props.onLongPress}
					ref={c => (this._root = c)}
					underlayColor={variables.listBtnUnderlayColor}
				>
					<View {...passThruProps}>
						{this.props.children}
					</View>
				</TouchableHighlight>
			);
		} else {
			return (
				<TouchableNativeFeedback
					ref={c => (this._root = c)}
					onPress={this.props.onPress}
					onLongPress={this.props.onLongPress}
					background={
						this.props.androidRippleColor
							? TouchableNativeFeedback.Ripple(this.props.androidRippleColor)
							: TouchableNativeFeedback.Ripple(variables.androidRippleColorDark)
					}
				>
					<View style={{ marginLeft: -17, paddingLeft: 17 }}>
						<View {...passThruProps}>
							{this.props.children}
						</View>
					</View>
				</TouchableNativeFeedback>
			);
		}
	}
}

ListItem.propTypes = {
	...TouchableHighlight.propTypes,
	style: PropTypes.oneOfType([PropTypes.object, PropTypes.number, PropTypes.array]),
	itemDivider: PropTypes.bool,
	button: PropTypes.bool,
};

const StyledListItem = connectStyle("NativeBase.ListItem", {}, mapPropsToStyleNames)(ListItem);

export { StyledListItem as ListItem };
