import React from 'react';
import { Plugin } from '@vizality/entities';
import { patch, unpatchAll } from '@vizality/patcher';
import { getModule } from '@vizality/webpack';
import { ContextMenu } from '@vizality/components';
import { toKebabCase } from '@vizality/util/String';

export default class AddonInstaller extends Plugin {
  start () {
    patch(
      getModule((m) => m.default?.displayName === 'MessageContextMenu'),
      'default',
      (args, res) => {
        const channelID = args[0].channel?.id;
        const isPlugin = channelID === '753291447523868753';
        const isPowercordPlugin = channelID === '755005584322854972';

        if (
          (isPlugin || channelID === '753291485100769411') ||
          (
            (
              vizality.manager.plugins.isInstalled('00pccompat') &&
              vizality.manager.plugins.isEnabled('00pccompat')
            ) &&
            (isPowercordPlugin || channelID === '755005710323941386')
          )
        ) {
          const addonURL =
            (
              args[0].message?.embeds &&
              args[0].message?.embeds[0]?.fields &&
              args[0].message?.embeds[0]?.fields[0].rawValue
            ) ||
            args[0].message?.content.match(/https?:\/\/github\.com\/[a-zA-Z0-9-]+\/[a-zA-Z0-9-]+\/?/m)[0];
          const addonID = toKebabCase(addonURL.split('/').pop());

          const pluginsOrThemes = isPlugin ? 'plugins' : 'themes';

          const addonIsInstalled = vizality.manager[
            pluginsOrThemes
          ].keys.includes(addonID);

          res.props.children.push(
            <>
              <ContextMenu.Separator />
              <ContextMenu.Group>
                <ContextMenu.Item
                  label={`${addonIsInstalled ? 'Uninstall' : 'Install'} ${
                    (isPlugin || isPowercordPlugin) ? 'Plugin' : 'Theme'
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
        }
      }
    );
  }

  stop () {
    unpatchAll('addon-installer');
  }
}
