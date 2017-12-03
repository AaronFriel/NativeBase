import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal, Platform, ActionSheetIOS, TouchableOpacity } from "react-native";
import { connectStyle } from "native-base-shoutem-theme";
import { Text } from "./Text";
import { Icon } from "./Icon";
import { Left } from "./Left";
import { Right } from "./Right";
import { Body } from "./Body";
import { List } from "./List";
import { ListItem } from "./ListItem";
import mapPropsToStyleNames from "../Utils/mapPropsToStyleNames";
import { ViewPropTypes } from '../Utils';

class ActionSheetContainer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			modalVisible: false,
			items: [],
		};
	}
	static actionsheetInstance;
	static show(config, callback) {
		this.actionsheetInstance._root.showActionSheet(config, callback);
	}
	showActionSheet(config, callback) {
		if (Platform.OS === "ios") {
			if (typeof config.options[0] === "object") {
				const options = config.options;
				const filtered = options.map(item => item.text);
				// eslint-disable-next-line no-param-reassign
				config.options = filtered;
				ActionSheetIOS.showActionSheetWithOptions(config, callback);
			} else {
				ActionSheetIOS.showActionSheetWithOptions(config, callback);
			}
		} else {
			this.setState({
				items: config.options,
				title: config.title,
				message: config.message,
				destructiveButtonIndex: config.destructiveButtonIndex,
				cancelButtonIndex: config.cancelButtonIndex,
				modalVisible: true,
				callback,
			});
		}
	}
	componentDidMount() {
		if (!this.props.autoHide && this.props.duration) {
			console.warn(`It's not recommended to set autoHide false with duration`);
		}
	}

	renderRowText(data, i, id) {
		return (
			<ListItem
				onPress={() => {
					this.state.callback(id);
					this.setState({ modalVisible: false });
				}}
				style={{ borderColor: "transparent" }}
			>
				<Text>
					{data}
				</Text>
			</ListItem>
		);
	}

	renderRowObject(data, i, id) {
		return (
			<ListItem
				onPress={() => {
					this.state.callback(id);
					this.setState({ modalVisible: false });
				}}
				style={{ borderColor: "transparent" }}
				icon
			>
				<Left>
					<Icon
						name={data.icon}
						style={{
							color: data.iconColor,
						}}
					/>
				</Left>
				<Body style={{ borderColor: "transparent" }}>
					<Text>
						{data.text}
					</Text>
				</Body>
				<Right />
			</ListItem>
		);
	}

	renderRow(data, i, id) {
		if (this.state.items[0] === "string") {
			return this.renderRowText(data, i, id);
		}
		return this.renderRowObject(data, i, id);
	}

	render() {
		return (
			<Modal
				animationType={"fade"}
				transparent
				visible={this.state.modalVisible}
				onRequestClose={() => {
					this.state.callback(-1);
					this.setState({ modalVisible: false });
				}}
			>
				<TouchableOpacity
					activeOpacity={1}
					onPress={() => {
						this.state.callback(-1);
						this.setState({ modalVisible: false });
					}}
					style={{
						backgroundColor: "rgba(0,0,0,0.4)",
						flex: 1,
						justifyContent: "flex-end",
					}}
				>
					<TouchableOpacity
						activeOpacity={1}
						style={{
							backgroundColor: "#fff",
							height: this.state.length * 80,
							padding: 15,
							elevation: 4,
						}}
					>
						<Text style={{ color: "#757575" }}>
							{this.state.title}
						</Text>
						<List
							style={{ marginHorizontal: -15, marginTop: 15 }}
							dataArray={this.state.items}
							renderRow={this.renderRow}
						/>
					</TouchableOpacity>
				</TouchableOpacity>
			</Modal>
		);
	}
}

ActionSheetContainer.propTypes = {
	...ViewPropTypes,
	style: PropTypes.oneOfType([PropTypes.object, PropTypes.number, PropTypes.array]),
};

const StyledActionSheetContainer = connectStyle("NativeBase.ActionSheetContainer", {}, mapPropsToStyleNames)(
	ActionSheetContainer
);

export { StyledActionSheetContainer as ActionSheetContainer };
