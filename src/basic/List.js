import React, { Component } from 'react';
import { ListView, View } from 'react-native';
import { connectStyle } from 'native-base-shoutem-theme';

import { SwipeRow } from './SwipeRow';
import mapPropsToStyleNames from '../Utils/mapPropsToStyleNames';

class List extends Component {
	static defaultProps = {
		leftOpenValue: 0,
		rightOpenValue: 0,
		closeOnRowBeginSwipe: false,
		closeOnScroll: true,
		closeOnRowPress: true,
		disableLeftSwipe: false,
		disableRightSwipe: false,
		recalculateHiddenLayout: false,
		previewFirstRow: false,
		directionalDistanceChangeThreshold: 2,
		swipeToOpenPercent: 50,
	};
	constructor(props) {
		super(props);
		this._rows = {};
		this.openCellId = null;
		if (props.dataArray && props.renderRow) {
			const rowHasChanged = props.rowHasChanged || ((r1, r2) => r1 !== r2);
			const ds = new ListView.DataSource({ rowHasChanged });
			this.state = {
				dataSource: ds.cloneWithRows(props.dataArray),
			};
		} else {
			this.state = {};
		}
	}
	componentWillReceiveProps(nextProps) {
		if (this.state.dataSource) {
			this.setState({
				dataSource: this.state.dataSource.cloneWithRows(nextProps.dataArray),
			});
		}
	}
	renderChildren() {
		const childrenArray = React.Children.map(this.props.children, child => child);

		return childrenArray;
	}
	setScrollEnabled(enable) {
		this._listView.setNativeProps({ scrollEnabled: enable });
	}

	safeCloseOpenRow() {
		// if the openCellId is stale due to deleting a row this could be undefined
		if (this._rows[this.openCellId]._root) {
			this._rows[this.openCellId]._root.closeRow();
		}
	}

	rowSwipeGestureBegan(id) {
		if (this.props.closeOnRowBeginSwipe && this.openCellId && this.openCellId !== id) {
			this.safeCloseOpenRow();
		}
	}

	onRowOpen(secId, rowId, rowMap) {
		const cellIdentifier = `${secId}${rowId}`;
		if (this.openCellId && this.openCellId !== cellIdentifier) {
			this.safeCloseOpenRow();
		}
		this.openCellId = cellIdentifier;
		if (this.props.onRowOpen) {
			this.props.onRowOpen(secId, rowId, rowMap);
		}
	}

	onRowPress(_id) {
		if (this.openCellId) {
			if (this.props.closeOnRowPress) {
				this.safeCloseOpenRow();
				this.openCellId = null;
			}
		}
	}
	closeRow(_id) {
		if (this.openCellId) {
			if (this.props.closeOnRowPress) {
				this.safeCloseOpenRow();
				this.openCellId = null;
			}
		}
	}

	onScroll(e) {
		if (this.openCellId) {
			if (this.props.closeOnScroll) {
				this.safeCloseOpenRow();
				this.openCellId = null;
			}
		}
		if (this.props.onScroll) {
			this.props.onScroll(e);
		}
	}

	setRefs(ref) {
		this._listView = ref;
		if (this.props.listViewRef) {
			this.props.listViewRef(ref);
		}
	}

	renderRow(rowData, secId, rowId, _rowMap) {
		const previewRowId =
			this.props.dataSource
			&& this.props.dataSource.getRowIDForFlatIndex(this.props.previewRowIndex || 0);
		return (
			<SwipeRow
				list
				ref={row => (this._rows[`${secId}${rowId}`] = row)}
				swipeGestureBegan={_ => this.rowSwipeGestureBegan(`${secId}${rowId}`)}
				onRowOpen={_ => this.onRowOpen(secId, rowId, this._rows)}
        onRowDidOpen={_ =>
          this.props.onRowDidOpen &&
          this.props.onRowDidOpen(secId, rowId, this._rows)
        }
        onRowClose={_ =>
          this.props.onRowClose &&
          this.props.onRowClose(secId, rowId, this._rows)
        }
        onRowDidClose={_ =>
          this.props.onRowDidClose &&
          this.props.onRowDidClose(secId, rowId, this._rows)
        }
				onRowPress={_ => this.onRowPress(`${secId}${rowId}`)}
				closeRow={_ => this.closeRow(`${secId}${rowId}`)}
				setScrollEnabled={enable => this.setScrollEnabled(enable)}
				leftOpenValue={this.props.leftOpenValue}
				rightOpenValue={this.props.rightOpenValue}
				closeOnRowPress={this.props.closeOnRowPress}
				disableLeftSwipe={this.props.disableLeftSwipe}
				disableRightSwipe={this.props.disableRightSwipe}
				stopLeftSwipe={this.props.stopLeftSwipe}
				stopRightSwipe={this.props.stopRightSwipe}
				recalculateHiddenLayout={this.props.recalculateHiddenLayout}
				style={this.props.swipeRowStyle}
				preview={
					(this.props.previewFirstRow || this.props.previewRowIndex) &&
					rowId === previewRowId
				}
				previewDuration={this.props.previewDuration}
				previewOpenValue={this.props.previewOpenValue}
				tension={this.props.tension}
				friction={this.props.friction}
				directionalDistanceChangeThreshold={this.props.directionalDistanceChangeThreshold}
				swipeToOpenPercent={this.props.swipeToOpenPercent}
				left={this.props.renderLeftHiddenRow(rowData, secId, rowId, this._rows)}
				right={this.props.renderRightHiddenRow(rowData, secId, rowId, this._rows)}
				body={this.props.renderRow(rowData, secId, rowId, this._rows)}
			/>
		);
	}
	render() {
		const {
			children: _children,
			closeOnRowBeginSwipe: _closeOnRowBeginSwipe,
			closeOnRowPress: _closeOnRowPress,
			closeOnScroll: _closeOnScroll,
			dataSource: _dataSource,
			directionalDistanceChangeThreshold: _directionalDistanceChangeThreshold,
			disableLeftSwipe: _disableLeftSwipe,
			disableRightSwipe: _disableRightSwipe,
			friction: _friction,
			leftOpenValue: _leftOpenValue,
			listViewRef: _listViewRef,
			onRowClose: _onRowClose,
			onRowDidClose: _onRowDidClose,
			onRowDidOpen: _onRowDidOpen,
			onRowOpen: _onRowOpen,
			onScroll: _onScroll,
			previewDuration: _previewDuration,
			previewFirstRow: _previewFirstRow,
			previewOpenValue: _previewOpenValue,
			previewRowIndex: _previewRowIndex,
			recalculateHiddenLayout: _recalculateHiddenLayout,
			renderLeftHiddenRow: _renderLeftHiddenRow,
			renderRightHiddenRow: _renderRightHiddenRow,
			renderRow: _renderRow,
			rightOpenValue: _rightOpenValue,
			stopLeftSwipe: _stopLeftSwipe,
			stopRightSwipe: _stopRightSwipe,
			swipeRowStyle: _swipeRowStyle,
			swipeToOpenPercent: _swipeToOpenPercent,
			tension: _tension,
			...passThruProps
		} = this.props;

		if (this.props.renderLeftHiddenRow || this.props.renderRightHiddenRow) {
			return (
				<ListView
					{...passThruProps}
					ref={(ref) => {
						this.setRefs(ref);
						this._root = ref;
					}}
					onScroll={e => this.onScroll(e)}
					renderRow={(rowData, secId, rowId) => this.renderRow(rowData, secId, rowId, this._rows)}
				/>
			);
		} else if (this.state.dataSource) {
			return (
				<ListView
					{...passThruProps}
					ref={ref => (this._root = ref)}
					enableEmptySections
					dataSource={this.state.dataSource}
					renderRow={this.props.renderRow}
				/>
			);
		}
		return (
			<View ref={c => (this._root = c)} {...this.props}>
				{this.renderChildren()}
			</View>
		);
	}
}
const StyledList = connectStyle('NativeBase.List', {}, mapPropsToStyleNames)(List);

export { StyledList as List };
