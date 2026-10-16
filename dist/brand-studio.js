/* Visitor-local branding preview. Product data and commerce remain in MOVA_SHOP. */
window.MOVA_BRAND = (() => {
  'use strict';
  const KEY = 'mova-brand-v1', themes = ['terracotta', 'forest', 'cobalt'];
  const defaults = () => ({name: '', theme: 'terracotta'});
  const cleanName = value => typeof value === 'string'
    ? Array.from(value.replace(/[\u0000-\u001f\u007f-\u009f\u202a-\u202e\u2066-\u2069]/g, '').replace(/\s+/g, ' ').trim()).slice(0, 32).join('') : '';
  const validate = value => ({name: cleanName(value?.name), theme: themes.includes(value?.theme) ? value.theme : 'terracotta'});
  const $ = selector => document.querySelector(selector);
  let initialized = false, t = key => key, applied = defaults(), draft = defaults(), saved = false, phone = '';
  const label = value => value.name || 'mova';
  function preview() {
    const panel = $('#brandPreview');
    panel.dataset.brandTheme = draft.theme;
    $('#brandPreviewName').textContent = label(draft);
    $('#brandPreviewName').title = label(draft);
    document.querySelectorAll('[name="brandTheme"]').forEach(input => {input.checked = input.value === draft.theme;});
    const message = [t('contactText'), t('brandBriefName') + ': ' + label(draft), t('brandBriefTheme') + ': ' + t('brandTheme_' + draft.theme)].join('\n');
    $('#contactLink').href = 'https://wa.me/' + phone + '?text=' + encodeURIComponent(message);
    const changed = draft.name !== applied.name || draft.theme !== applied.theme;
    $('#brandStatus').textContent = changed ? t('brandDraft') : saved ? t('brandApplied') : '';
    $('#brandReset').disabled = !draft.name && draft.theme === 'terracotta' && !applied.name && applied.theme === 'terracotta';
  }
  function paintStore() {
    document.documentElement.dataset.brandTheme = applied.theme;
    document.documentElement.toggleAttribute('data-brand-custom', !!applied.name);
    document.querySelectorAll('[data-store-brand]').forEach(node => {
      node.textContent = applied.name || node.dataset.storeBrand || 'mova';
      node.title = node.textContent;
    });
    document.querySelectorAll('[data-brand-link]').forEach(node => node.setAttribute('aria-label', label(applied)));
    document.querySelectorAll('[data-brand-mark]').forEach(node => {node.hidden = !!applied.name;});
  }
  function translate() {if (initialized) preview();}
  function init(options) {
    if (initialized || !$('#brandStudioForm')) return;
    initialized = true; t = options.t;
    phone = String(options.phone || '').replace(/\D/g, '');
    try {applied = validate(JSON.parse(localStorage.getItem(KEY)));} catch {applied = defaults();}
    draft = {...applied}; saved = !!applied.name || applied.theme !== 'terracotta';
    const input = $('#brandName'); input.value = draft.name;
    input.addEventListener('input', () => {draft.name = cleanName(input.value); preview();});
    input.addEventListener('blur', () => {input.value = draft.name;});
    $('#brandStudioForm').addEventListener('change', event => {
      if (event.target.name === 'brandTheme' && themes.includes(event.target.value)) {draft.theme = event.target.value; preview();}
    });
    $('#brandStudioForm').addEventListener('submit', event => {
      event.preventDefault(); applied = validate(draft); draft = {...applied}; input.value = draft.name; saved = true;
      paintStore();
      try {localStorage.setItem(KEY, JSON.stringify(applied));} catch { /* Preview still works when storage is unavailable. */ }
      preview();
      $('#brandViewStore').hidden = false;
    });
    $('#brandReset').addEventListener('click', () => {
      applied = defaults(); draft = defaults(); saved = false; input.value = '';
      try {localStorage.removeItem(KEY);} catch {}
      paintStore(); preview(); $('#brandViewStore').hidden = true;
      $('#brandStatus').textContent = t('brandResetDone');
    });
    $('#brandViewStore').hidden = !saved;
    paintStore(); preview();
  }
  return Object.freeze({init, translate, snapshot: () => ({initialized, applied: {...applied}, draft: {...draft}})});
})();
