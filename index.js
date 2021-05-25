import React from 'react';
import { Plugin } from '@vizality/entities';

import { patch, unpatchAll } from '@vizality/patcher';
import { getModule } from '@vizality/webpack';
import { ContextMenu } from '@vizality/components';

export default class AddonInstaller extends Plugin {
  start () {
    patch(
      'addon-installer',
      getModule((m) => m.default?.displayName === 'MessageContextMenu'),
      'default',
      (args, res) => {
        const channelID = args[0].channel?.id;
        const isPlugin = channelID === '753291447523868753' && true;

        if (isPlugin || channelID === '753291485100769411') {
          const addonURL = args[0].message?.embeds[0]?.fields[0].rawValue;
          const addonID = addonURL.split('/').pop().toLowerCase();

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
                    isPlugin ? 'Plugin' : 'Theme'
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

        return res;
      }
    );
  }

  stop () {
    unpatchAll('addon-installer');
  }
}
