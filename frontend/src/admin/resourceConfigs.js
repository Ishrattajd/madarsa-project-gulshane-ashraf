/**
 * resourceConfigs.js — single source of truth for all admin CRUD resources.
 *
 * Each config object drives CrudPage.jsx — no separate admin page per resource.
 * Add a new resource by adding one entry here; CrudPage handles the rest.
 */

export const RESOURCE_CONFIGS = {
  programs: {
    apiPath:  '/admin/programs/',
    label:    'Programs',
    labelKey: 'admin.programs',
    columns: [
      { key: 'title_en', label: 'Title (EN)', main: true },
      { key: 'age_group', label: 'Age Group' },
      { key: 'duration',  label: 'Duration' },
      { key: 'is_active', label: 'Active', type: 'bool' },
    ],
    fields: [
      { key: 'title_en',        label: 'Title (English)',  type: 'text', required: true },
      { key: 'title_ur',        label: 'Title (Urdu)',     type: 'text' },
      { key: 'title_kn',        label: 'Title (Kannada)',  type: 'text' },
      { key: 'description_en',  label: 'Description (EN)', type: 'textarea' },
      { key: 'description_ur',  label: 'Description (UR)', type: 'textarea' },
      { key: 'description_kn',  label: 'Description (KN)', type: 'textarea' },
      { key: 'age_group',       label: 'Age Group',        type: 'text' },
      { key: 'duration',        label: 'Duration',         type: 'text' },
      { key: 'fee',             label: 'Fee (₹, blank=free)', type: 'number' },
      { key: 'is_active',       label: 'Active',           type: 'bool' },
    ],
    defaults: { title_en: '', title_ur: '', title_kn: '', description_en: '', description_ur: '', description_kn: '', age_group: '', duration: '', fee: '', is_active: true },
  },

  instructors: {
    apiPath:  '/admin/instructors/',
    label:    'Instructors',
    labelKey: 'admin.instructors',
    columns: [
      { key: 'name',       label: 'Name', main: true },
      { key: 'is_active',  label: 'Active', type: 'bool' },
      { key: 'show_photo', label: 'Show Photo', type: 'bool' },
    ],
    fields: [
      { key: 'name',       label: 'Name',        type: 'text', required: true },
      { key: 'bio_en',     label: 'Bio (EN)',     type: 'textarea' },
      { key: 'bio_ur',     label: 'Bio (UR)',     type: 'textarea' },
      { key: 'bio_kn',     label: 'Bio (KN)',     type: 'textarea' },
      { key: 'photo',      label: 'Photo',        type: 'image' },
      { key: 'show_photo', label: 'Show Photo',   type: 'bool' },
      { key: 'is_active',  label: 'Active',       type: 'bool' },
    ],
    defaults: { name: '', bio_en: '', bio_ur: '', bio_kn: '', show_photo: true, is_active: true },
  },

  events: {
    apiPath:  '/admin/events/',
    label:    'Events',
    labelKey: 'admin.events',
    columns: [
      { key: 'title_en',     label: 'Title (EN)', main: true },
      { key: 'event_date',   label: 'Date' },
      { key: 'is_published', label: 'Published', type: 'bool' },
    ],
    fields: [
      { key: 'title_en',    label: 'Title (EN)',    type: 'text', required: true },
      { key: 'title_ur',    label: 'Title (UR)',    type: 'text' },
      { key: 'title_kn',    label: 'Title (KN)',    type: 'text' },
      { key: 'body_en',     label: 'Body (EN)',     type: 'textarea' },
      { key: 'body_ur',     label: 'Body (UR)',     type: 'textarea' },
      { key: 'body_kn',     label: 'Body (KN)',     type: 'textarea' },
      { key: 'cover_image', label: 'Cover Image',   type: 'image' },
      { key: 'event_date',  label: 'Event Date',    type: 'date' },
      { key: 'is_published', label: 'Published',    type: 'bool' },
    ],
    defaults: { title_en: '', title_ur: '', title_kn: '', body_en: '', body_ur: '', body_kn: '', event_date: '', is_published: false },
  },

  'event-images': {
    apiPath:  '/admin/event-images/',
    label:    'Event Images',
    labelKey: 'admin.event_images',
    columns: [
      { key: 'caption',    label: 'Caption', main: true },
      { key: 'event',      label: 'Event ID' },
      { key: 'order',      label: 'Order' },
    ],
    fields: [
      { key: 'event',      label: 'Event ID',      type: 'number', required: true },
      { key: 'image',      label: 'Image',         type: 'image', required: true },
      { key: 'caption',    label: 'Caption',       type: 'text' },
      { key: 'order',      label: 'Order (0=first)', type: 'number' },
    ],
    defaults: { event: '', caption: '', order: 0 },
  },

  testimonials: {
    apiPath:  '/admin/testimonials/',
    label:    'Testimonials',
    labelKey: 'admin.testimonials',
    columns: [
      { key: 'author_name',  label: 'Author', main: true },
      { key: 'role',         label: 'Role' },
      { key: 'is_approved',  label: 'Approved', type: 'bool' },
    ],
    fields: [
      { key: 'author_name', label: 'Author Name',    type: 'text', required: true },
      { key: 'role',        label: 'Role',            type: 'select', options: ['parent','donor','student'] },
      { key: 'quote_en',    label: 'Quote (EN)',      type: 'textarea' },
      { key: 'quote_ur',    label: 'Quote (UR)',      type: 'textarea' },
      { key: 'quote_kn',    label: 'Quote (KN)',      type: 'textarea' },
      { key: 'photo',       label: 'Author Photo',    type: 'image' },
      { key: 'is_approved', label: 'Approved',        type: 'bool' },
    ],
    defaults: { author_name: '', role: 'parent', quote_en: '', quote_ur: '', quote_kn: '', is_approved: false },
  },

  'donation-funds': {
    apiPath:  '/admin/donation-funds/',
    label:    'Donation Funds',
    labelKey: 'admin.donation_funds',
    columns: [
      { key: 'name_en',   label: 'Name (EN)', main: true },
      { key: 'is_active', label: 'Active', type: 'bool' },
    ],
    fields: [
      { key: 'name_en',    label: 'Name (English)',  type: 'text', required: true },
      { key: 'name_ur',    label: 'Name (Urdu)',     type: 'text' },
      { key: 'name_kn',    label: 'Name (Kannada)',  type: 'text' },
      { key: 'description', label: 'Description',   type: 'textarea' },
      { key: 'is_active',  label: 'Active',          type: 'bool' },
    ],
    defaults: { name_en: '', name_ur: '', name_kn: '', description: '', is_active: true },
  },

  banners: {
    apiPath:  '/admin/banner-images/',
    label:    'Banner Images',
    labelKey: 'admin.banners',
    columns: [
      { key: 'title',     label: 'Title', main: true },
      { key: 'order',     label: 'Order' },
      { key: 'is_active', label: 'Active', type: 'bool' },
    ],
    fields: [
      { key: 'title',     label: 'Title',    type: 'text' },
      { key: 'subtitle',  label: 'Subtitle', type: 'text' },
      { key: 'image',     label: 'Image',    type: 'image', required: true },
      { key: 'order',     label: 'Order (0=first)', type: 'number' },
      { key: 'is_active', label: 'Active',   type: 'bool' },
    ],
    defaults: { title: '', subtitle: '', order: 0, is_active: true },
  },
};
