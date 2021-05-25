import React from "react";
import { Plugin } from "@vizality/entities";

import { patch, unpatchAll } from "@vizality/patcher";
import { getModule } from "@vizality/webpack";
import { ContextMenu } from "@vizality/components";

export default class AddonInstaller extends Plugin {
	start() {
		patch(
			"addon-installer",
			getModule((m) => m.default?.displayName === "MessageContextMenu"),
			"default",
			(args, res) => {
				let channelID = args[0].channel?.id;
				if (channelID == "755005584322854972") {
					if (vizality.manager.plugins.isInstalled('00pccompat') && vizality.manager.plugins.isEnabled('00pccompat')) {
						const URL = message.content[0].find(e => e);
						const addonURL = URL.rawValue.startsWith('<') ? URL.rawValue.replace(/<|>/g, '') : URL.rawValue;
						const addonID = addonURL.split('/').pop().toLowerCase();
						const isPlugin = channelID == "755005584322854972" && true;
						const addonIsInstalled = vizality.manager[
							isPlugin == "plugins"
						].keys.includes(addonID);

						if (isPlugin)
							res.props.children.push(
								<>
									<ContextMenu.Separator />
									<ContextMenu.Group>
										<ContextMenu.Item
											label={`${addonIsInstalled ? "Uninstall" : "Install"} ${isPlugin == "Plugin"
												}`}
											id="addon-installer"
											action={async () => {
												if (addonIsInstalled) {
													await vizality.manager["Plugin"].uninstall(
														addonID
													);
												} else {
													await vizality.manager["Plugin"].install(addonURL);
												}
											}}
										/>
									</ContextMenu.Group>
								</>
							)
					};
				} else {
					const addonURL = args[0].message.embeds[0].fields[0].rawValue;
					const addonID = addonURL.split("/").pop().toLowerCase();

					const isPlugin = channelID == "753291447523868753" && true;
					const pluginsOrThemes = isPlugin ? "plugins" : "themes";

					const addonIsInstalled = vizality.manager[
						pluginsOrThemes
					].keys.includes(addonID);

					if (isPlugin || channelID == "753291485100769411")
						res.props.children.push(
							<>
								<ContextMenu.Separator />
								<ContextMenu.Group>
									<ContextMenu.Item
										label={`${addonIsInstalled ? "Uninstall" : "Install"} ${isPlugin ? "Plugin" : "Theme"
											}`}
										id="addon-installer"
										action={async () => {
											if (addonIsInstalled) {
												await vizality.manager[pluginsOrThemes].uninstall(
													addonID
												);
											} else {
												await vizality.manager[pluginsOrThemes].install(addonURL);
											}
										}}
									/>
								</ContextMenu.Group>
							</>
						);

					return res;
				};
			});
	}

	stop() {
		unpatchAll("addon-installer");
	}
}
