import React, { Component } from "react";
import { Platform, Animated, TouchableOpacity, TouchableNativeFeedback, View } from "react-native";
import _ from "lodash";
import { connectStyle } from "native-base-shoutem-theme";
import { computeProps } from "../Utils/computeProps";
import { Button } from "./Button";
import variables from "./../theme/variables/platform";
import mapPropsToStyleNames from "../Utils/mapPropsToStyleNames";

const AnimatedFab = Animated.createAnimatedComponent(Button);

class Fab extends Component {
	props: Animated.props & {
		position: ?string,
	};

	state: {
		buttons: React.ReactElement<Button>,
		active: boolean,
	};
	constructor(props) {
		super(props);
		this.containerHeight = new Animated.Value(56);
		this.containerWidth = new Animated.Value(0);
		this.buttonScale = new Animated.Value(0);
		this.state = {
			buttons: undefined,
			active: false,
		};
	}

	fabTopValue(pos): ?{ top: ?number, bottom: ?number, left: ?number, right: ?number } {
		if (pos === "topLeft") {
			return {
				top: 20,
				bottom: undefined,
				left: 20,
				right: undefined,
			};
		} else if (pos === "bottomRight") {
			return {
				top: undefined,
				bottom: 20,
				left: undefined,
				right: 20,
			};
		} else if (pos === "bottomLeft") {
			return {
				top: undefined,
				bottom: 20,
				left: 20,
				right: undefined,
			};
		} else if (pos === "topRight") {
			return {
				top: 20,
				bottom: undefined,
				left: undefined,
				right: 20,
			};
		}
	}

	fabOtherBtns(direction, i) {
		const activeMarginLeft = 8;
		const activeMarginOther = Platform.OS === "ios" ? 50 : 8;

		if (direction === "up") {
			return {
				top: undefined,
				bottom: this.props.active === false ? activeMarginOther : (i * 50) + 65,
				left: 8,
				right: 0,
			};
		} else if (direction === "left") {
			return {
				top: 8,
				bottom: 0,
				left: this.props.active === false ? activeMarginLeft : -((i * 50) + 50),
				right: 0,
			};
		} else if (direction === "down") {
			return {
				top: this.props.active === false ? activeMarginOther : (i * 50) + 65,
				bottom: 0,
				left: 8,
				right: 0,
			};
		} else if (direction === "right") {
			return {
				top: 8,
				bottom: 0,
				left: this.props.active === false ? activeMarginOther : (i * 50) + 65,
				right: 0,
			};
		}
	}

	getInitialStyle(iconStyle) {
    const flexDirection =
      this.props.direction &&
      (this.props.direction === 'left' || this.props.direction === 'right')
        ? 'row'
        : 'column';

		return {
			fab: {
				height: 56,
				width: 56,
				borderRadius: 28,
				elevation: 4,
				shadowColor: "#000",
				shadowOffset: { width: 0, height: 2 },
				shadowOpacity: 0.4,
				justifyContent: "center",
				alignItems: "center",
				shadowRadius: 2,
				position: "absolute",
				bottom: 0,
				backgroundColor: "blue",
			},
			container: {
				position: "absolute",
				top: this.props.position ? this.fabTopValue(this.props.position).top : undefined,
				bottom: this.props.position ? this.fabTopValue(this.props.position).bottom : 20,
				right: this.props.position ? this.fabTopValue(this.props.position).right : 20,
				left: this.props.position ? this.fabTopValue(this.props.position).left : undefined,
				width: 56,
				height: this.containerHeight,
				flexDirection,
				alignItems: "center",
			},
			iconStyle: {
				color: "#fff",
				fontSize: 24,
				lineHeight: Platform.OS === "ios" ? 27 : undefined,
				...iconStyle,
			},
			buttonStyle: {
				position: "absolute",
				height: 40,
				width: 40,
				left: 7,
				borderRadius: 20,
				transform: this.state.active
					? [{ scale: new Animated.Value(1) }]
					: [{ scale: this.buttonScale }],
				marginBottom: 10,
				backgroundColor: "blue",
			},
		};
	}

	getContainerStyle() {
		return _.merge(this.getInitialStyle().container, this.props.containerStyle);
	}

	prepareFabProps() {
		const defaultProps = {
			style: this.getInitialStyle().fab,
		};
		const incomingProps = _.clone(this.props);
		delete incomingProps.onPress;

		return computeProps(incomingProps, defaultProps);
	}

	getOtherButtonStyle(child, i) {
		const type = {
			top: this.props.direction ? this.fabOtherBtns(this.props.direction, i).top : undefined,
			left: this.props.direction ? this.fabOtherBtns(this.props.direction, i).left : 8,
			right: this.props.direction ? this.fabOtherBtns(this.props.direction, i).right : 0,
			bottom: this.props.direction
				? this.fabOtherBtns(this.props.direction, i).bottom
				: this.props.active === false ? 8 : (i * 50) + 65,
		};

		return _.merge(this.getInitialStyle().buttonStyle, child.props.style, type);
	}
	prepareButtonProps(child) {
		const inp = _.clone(child.props);
		delete inp.style;

		const defaultProps = {};

		return computeProps(inp, defaultProps);
	}

	componentDidMount() {
		this.activeTimer = setTimeout(() => {
			this.setState({
				active: this.props.active,
			});
		}, 0);
	}

	componentWillUnmount() {
		if (this.activeTimer) {
			clearTimeout(this.activeTimer);
		}
	}

	renderFab() {
		const childrenArray = React.Children.toArray(this.props.children);
		return React.cloneElement(childrenArray[0], {
			style: this.getInitialStyle(childrenArray[0].props.style).iconStyle,
		});
	}

	renderButtons() {
		const childrenArray = React.Children.toArray(this.props.children);

		const newChildren = [];

		childrenArray.slice(1).forEach((child, i) => {
			newChildren.push(
				<AnimatedFab
					style={this.getOtherButtonStyle(child, i)}
					{...this.prepareButtonProps(child, i)}
					fabButton
					key={i}
				>
					{child.props.children}
				</AnimatedFab>
			);
		});
		return newChildren;
	}
	upAnimate() {
		if (!this.props.active) {
			Animated.spring(this.containerHeight, {
				toValue: (this.state.buttons * 51.3) + 56,
			}).start();
			Animated.spring(this.buttonScale, {
				toValue: 1,
			}).start();
		} else {
			this.setState({
				active: false,
			});
			Animated.spring(this.containerHeight, {
				toValue: 56,
			}).start();
			Animated.spring(this.buttonScale, {
				toValue: 0,
			}).start();
		}
	}

	componentWillReceiveProps(nextProps) {
		const childrenArray = React.Children.toArray(nextProps.children);
		const icon = _.remove(childrenArray, (item) => {
			if (item.type.displayName === "Styled(Button)") {
				return true;
			}
		});
		this.setState({
			buttons: icon.length,
		});
	}

	leftAnimate() {
		if (!this.props.active) {
			Animated.spring(this.containerWidth, {
				toValue: (this.state.buttons * 51.3) + 56,
			}).start();
			Animated.spring(this.buttonScale, {
				toValue: 1,
			}).start();
		} else {
			this.setState({
				active: false,
			});
			Animated.spring(this.containerHeight, {
				toValue: 56,
			}).start();
			Animated.spring(this.buttonScale, {
				toValue: 0,
			}).start();
		}
	}

	rightAnimate() {
		if (!this.props.active) {
			Animated.spring(this.containerWidth, {
				toValue: (this.state.buttons * 51.3) + 56,
			}).start();
			Animated.spring(this.buttonScale, {
				toValue: 1,
			}).start();
		} else {
			this.setState({
				active: false,
			});
			Animated.spring(this.containerHeight, {
				toValue: 56,
			}).start();
			Animated.spring(this.buttonScale, {
				toValue: 0,
			}).start();
		}
	}

	downAnimate() {
		if (!this.props.active) {
			Animated.spring(this.containerHeight, {
				toValue: 56,
			}).start();
			Animated.spring(this.buttonScale, {
				toValue: 1,
			}).start();
		} else {
			this.setState({
				active: false,
			});
			Animated.spring(this.containerHeight, {
				toValue: 56,
			}).start();
			Animated.spring(this.buttonScale, {
				toValue: 0,
			}).start();
		}
	}
	_animate() {
		const { props: { direction } } = this;
		if (direction) {
			if (direction === "up") {
				this.upAnimate();
			} else if (direction === "left") {
				this.leftAnimate();
			} else if (direction === "right") {
				this.rightAnimate();
			} else if (direction === "down") {
				this.downAnimate();
			}
		} else {
			this.upAnimate();
		}
	}

	fabOnPress() {
		if (this.props.onPress) {
			this.props.onPress();
			this._animate();
			this.activeTimer = setTimeout(() => {
				this.setState({
					active: this.props.active,
				});
			}, 100);
		}
	}

	render() {
		return (
			<Animated.View style={this.getContainerStyle()}>
				{this.renderButtons()}
				{Platform.OS !== "android" || variables.androidRipple === false || Platform.Version <= 21 ? (
					<TouchableOpacity
						onPress={() => this.fabOnPress()}
						{...this.prepareFabProps()}
						activeOpacity={1}
					>
						{this.renderFab()}
					</TouchableOpacity>
				) : (
					<TouchableNativeFeedback
						onPress={() => this.fabOnPress()}
						background={
							this.props.androidRippleColor
								? TouchableNativeFeedback.Ripple(this.props.androidRippleColor)
								: TouchableNativeFeedback.Ripple(variables.androidRippleColor)
						}
						{...this.prepareFabProps()}
					>
						<View style={[this.getInitialStyle().fab, this.props.style]}>{this.renderFab()}</View>
					</TouchableNativeFeedback>
				)}
			</Animated.View>
		);
	}
}

const StyledFab = connectStyle("NativeBase.Fab", {}, mapPropsToStyleNames)(Fab);
export { StyledFab as Fab };
