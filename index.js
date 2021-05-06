import React from "react";
import { Plugin } from "@vizality/entities";

import { patch } from "@vizality/patcher";
import { getModule } from "@vizality/webpack";
import { ContextMenu } from "@vizality/components";

import ToastHeader from "./components/ToastHeader";

let unpatch = () => {
	console.log("addon-installer not patched.");
};

export default class AddonInstaller extends Plugin {
	start() {
		const MessageContextMenu = getModule(
			(m) => m.default?.displayName === "MessageContextMenu"
		);

		unpatch = patch(
			"addon-installer",
			MessageContextMenu,
			"default",
			(args, res) => {
				let isPlugin;

				const channelId = args[0].channel?.id;
				if (channelId == "753291447523868753") isPlugin = true;

				if (isPlugin || channelId == "753291485100769411")
					res.props.children.push(
						<>
							<ContextMenu.Separator />
							<ContextMenu.Group>
								<ContextMenu.Item
									label={`Install ${isPlugin ? "Plugin" : "Theme"}`}
									id="addon-installer"
									action={() => {
										try {
											require("child_process").execSync(
												`git clone ${args[0].message.embeds[0].fields[0].rawValue}`,
												{
													stdio: [0, 1, 2], // TBH I have absolutely no idea what this is for
													cwd: require("path").resolve(
														__dirname,
														isPlugin ? "../" : "../../themes"
													),
												}
											);

											vizality.api.notifications.sendToast({
												header: (
													<ToastHeader isSuccess={true} isPlugin={isPlugin} />
												),
												timeout: 2000,
											});
										} catch (error) {
											this.log("Addon installation failed!\n", error);
											vizality.api.notifications.sendToast({
												header: (
													<ToastHeader isSuccess={false} isPlugin={isPlugin} />
												),
												timeout: 3000,
											});
										}
									}}
								/>
							</ContextMenu.Group>
						</>
					);

				return res;
			}
		);
	}

	stop() {
		unpatch();
	}
}
