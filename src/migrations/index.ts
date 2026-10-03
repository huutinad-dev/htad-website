import * as migration_20260923_080504_initial from './20260923_080504_initial';
import * as migration_20260923_084623_remove_footer_headline from './20260923_084623_remove_footer_headline';
import * as migration_20260923_092015_remove_home_intro from './20260923_092015_remove_home_intro';
import * as migration_20260923_094839_add_blob_object_key from './20260923_094839_add_blob_object_key';
import * as migration_20260924_103500_add_order_keys from './20260924_103500_add_order_keys';
import * as migration_20260924_103630_drop_legacy_order from './20260924_103630_drop_legacy_order';
import * as migration_20261003_142520_add_project_partner_role_contact_page from './20261003_142520_add_project_partner_role_contact_page';

export const migrations = [
  {
    up: migration_20260923_080504_initial.up,
    down: migration_20260923_080504_initial.down,
    name: '20260923_080504_initial',
  },
  {
    up: migration_20260923_084623_remove_footer_headline.up,
    down: migration_20260923_084623_remove_footer_headline.down,
    name: '20260923_084623_remove_footer_headline',
  },
  {
    up: migration_20260923_092015_remove_home_intro.up,
    down: migration_20260923_092015_remove_home_intro.down,
    name: '20260923_092015_remove_home_intro',
  },
  {
    up: migration_20260923_094839_add_blob_object_key.up,
    down: migration_20260923_094839_add_blob_object_key.down,
    name: '20260923_094839_add_blob_object_key',
  },
  {
    up: migration_20260924_103500_add_order_keys.up,
    down: migration_20260924_103500_add_order_keys.down,
    name: '20260924_103500_add_order_keys',
  },
  {
    up: migration_20260924_103630_drop_legacy_order.up,
    down: migration_20260924_103630_drop_legacy_order.down,
    name: '20260924_103630_drop_legacy_order',
  },
  {
    up: migration_20261003_142520_add_project_partner_role_contact_page.up,
    down: migration_20261003_142520_add_project_partner_role_contact_page.down,
    name: '20261003_142520_add_project_partner_role_contact_page'
  },
];
