import React, { Component } from "react";
import PropTypes from "prop-types";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { connectStyle } from "native-base-shoutem-theme";
import mapPropsToStyleNames from "../Utils/mapPropsToStyleNames";

class Content extends Component {
	render() {
		return (
			<KeyboardAwareScrollView
				automaticallyAdjustContentInsets={false}
				resetScrollToCoords={this.props.disableKBDismissScroll ? null : { x: 0, y: 0 }}
				ref={(c) => {
					this._scrollview = c;
					this._root = c;
				}}
				{...this.props}
			>
				{this.props.children}
			</KeyboardAwareScrollView>
		);
	}
}

Content.propTypes = {
	// eslint-disable-next-line react/no-unused-prop-types
	style: PropTypes.oneOfType([PropTypes.object, PropTypes.number, PropTypes.array]),
	// eslint-disable-next-line react/no-unused-prop-types
	padder: PropTypes.bool,
	disableKBDismissScroll: PropTypes.bool,
	// eslint-disable-next-line react/no-unused-prop-types
	enableResetScrollToCoords: PropTypes.bool,
};

const StyledContent = connectStyle("NativeBase.Content", {}, mapPropsToStyleNames)(Content);

export { StyledContent as Content };
