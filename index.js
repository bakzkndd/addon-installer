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
				const channelId = args[0].channel?.id;
				const isPlugin = channelId == "753291447523868753" && true;

				if (isPlugin || channelId == "753291485100769411")
					res.props.children.push(
						<>
							<ContextMenu.Separator />
							<ContextMenu.Group>
								<ContextMenu.Item
									label={`Install ${isPlugin ? "Plugin" : "Theme"}`}
									id="addon-installer"
									action={async () => {
										await vizality.manager[
											isPlugin ? "plugins" : "themes"
										].install(args[0].message.embeds[0].fields[0].rawValue);
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
		unpatchAll("addon-installer");
	}
}
