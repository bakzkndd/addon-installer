import React from "react";
import { Plugin } from "@vizality/entities";
import { patch, unpatchAll } from "@vizality/patcher";
import { getModule } from "@vizality/webpack";
import { ContextMenu } from "@vizality/components";
import { toKebabCase } from "@vizality/util/String";

export default class AddonInstaller extends Plugin {
  start() {
    this.ContextMenu;

    this.patchContextMenu();
  }

  stop() {
    if (this.ContextMenu) unpatchAll("addon-installer");
  }

  patchContextMenu() {
    this.ContextMenu = getModule(
      (m) => m.default?.displayName === "MessageContextMenu"
    );
    if (!this.ContextMenu)
      return setTimeout(() => this.patchContextMenu(), 1000);

    patch(this.ContextMenu, "default", (args, res) => {
      const channelID = args[0].channel?.id;
      const isPlugin = channelID === "753291447523868753";
      const isPowercordPlugin = channelID === "755005584322854972";
      const isPowercordTheme = channelID === "755005710323941386";
      const isBDTheme =
        channelID === "813903993524715522" ||
        channelID === "781600198002081803";

      if (
        isPlugin ||
        channelID === "912198952248545320" ||
        isPowercordTheme ||
        isBDTheme ||
        (vizality.manager.plugins.isInstalled("00pccompat") &&
          vizality.manager.plugins.isEnabled("00pccompat") &&
          (isPowercordPlugin || channelID === "755005710323941386"))
      ) {
        const addonURL =
          args[0].message?.embeds[0]?.fields[0]?.rawValue ||
          args[0].message?.embeds[0]?.rawDescription?.match(
            /https?:\/\/github\.com\/[a-zA-Z0-9-]+\/[a-zA-Z0-9-]+\/?/m
          )?.[0] ||
          args[0].message?.content.match(
            /https?:\/\/github\.com\/[a-zA-Z0-9-]+\/[a-zA-Z0-9-]+\/?/m
          )[0];
        const addonID = toKebabCase(addonURL.split("/").pop());

        const pluginsOrThemes =
          isPlugin || isPowercordPlugin ? "plugins" : "themes";

        const addonIsInstalled =
          vizality.manager[pluginsOrThemes].keys.includes(addonID);

        res.props.children.push(
          <>
            <ContextMenu.Separator />
            <ContextMenu.Group>
              <ContextMenu.Item
                label={`${addonIsInstalled ? "Uninstall" : "Install"} ${
                  isPlugin || isPowercordPlugin ? "Plugin" : "Theme"
                }`}
                id="addon-installer"
                action={async () => {
                  if (addonIsInstalled) {
                    await vizality.manager[pluginsOrThemes].uninstall(addonID);
                  } else {
                    await vizality.manager[pluginsOrThemes].install(addonURL);
                  }
                }}
              />
            </ContextMenu.Group>
          </>
        );
      }
    });
  }
}
