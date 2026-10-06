import * as migration_20260923_080504_initial from './20260923_080504_initial';
import * as migration_20260923_084623_remove_footer_headline from './20260923_084623_remove_footer_headline';
import * as migration_20260923_092015_remove_home_intro from './20260923_092015_remove_home_intro';
import * as migration_20260923_094839_add_blob_object_key from './20260923_094839_add_blob_object_key';
import * as migration_20260924_103500_add_order_keys from './20260924_103500_add_order_keys';
import * as migration_20260924_103630_drop_legacy_order from './20260924_103630_drop_legacy_order';
import * as migration_20261003_142520_add_project_partner_role_contact_page from './20261003_142520_add_project_partner_role_contact_page';
import * as migration_20261005_161302_add_posts from './20261005_161302_add_posts';
import * as migration_20261005_163508_add_messages from './20261005_163508_add_messages';
import * as migration_20261005_170009_localize_founder_name from './20261005_170009_localize_founder_name';
import * as migration_20261006_075551_add_media_link from './20261006_075551_add_media_link';

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
    name: '20261003_142520_add_project_partner_role_contact_page',
  },
  {
    up: migration_20261005_161302_add_posts.up,
    down: migration_20261005_161302_add_posts.down,
    name: '20261005_161302_add_posts',
  },
  {
    up: migration_20261005_163508_add_messages.up,
    down: migration_20261005_163508_add_messages.down,
    name: '20261005_163508_add_messages',
  },
  {
    up: migration_20261005_170009_localize_founder_name.up,
    down: migration_20261005_170009_localize_founder_name.down,
    name: '20261005_170009_localize_founder_name',
  },
  {
    up: migration_20261006_075551_add_media_link.up,
    down: migration_20261006_075551_add_media_link.down,
    name: '20261006_075551_add_media_link'
  },
];
