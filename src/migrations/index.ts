import * as migration_20260923_080504_initial from './20260923_080504_initial';
import * as migration_20260923_084623_remove_footer_headline from './20260923_084623_remove_footer_headline';
import * as migration_20260923_092015_remove_home_intro from './20260923_092015_remove_home_intro';
import * as migration_20260923_094839_add_blob_object_key from './20260923_094839_add_blob_object_key';

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
    name: '20260923_094839_add_blob_object_key'
  },
];
