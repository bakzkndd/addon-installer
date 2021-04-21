import React, { Component } from "react";

import { Text, Icon, Flex } from "@vizality/components";

export default class ToastHeader extends Component {
	render() {
		return (
			<>
				<Text
					size="h3"
					color={
						this.props.isSuccess
							? Text.Colors.STATUS_GREEN
							: Text.Colors.STATUS_RED
					}
				>
					<Flex align={Flex.Align.CENTER}>
						<Icon
							name={this.props.isSuccess ? "CheckmarkCircle" : "Clear"}
							size={50}
							style={{ marginRight: "16px" }}
						/>
						{this.props.isSuccess
							? `The ${
									this.props.isPlugin ? "plugin" : "theme"
							  } was successfully
						installed!`
							: `Installation of the ${
									this.props.isPlugin ? "plugin" : "theme"
							  } was unsuccessful! See console for details.`}
					</Flex>
				</Text>
			</>
		);
	}
}
