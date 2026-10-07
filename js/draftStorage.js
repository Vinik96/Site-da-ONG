(function (app) {
  const storageKey = 'meuRascunho';

  function readDraft(storage) {
    try {
      return JSON.parse(storage.getItem(storageKey) || '{}');
    } catch {
      return {};
    }
  }

  app.draftStorage = {
    restore(fields, masks, storage) {
      const draft = readDraft(storage);

      fields.forEach(field => {
        const value = draft[field.storageKey] || '';
        const mask = masks[field.id];

        if (mask) {
          mask.value = value;
        } else {
          field.input.value = value;
        }
      });
    },
    bindAutosave(fields, storage) {
      fields.forEach(field => {
        field.input.addEventListener('input', () => {
          const draft = {};
          fields.forEach(item => {
            draft[item.storageKey] = item.input.value;
          });
          storage.setItem(storageKey, JSON.stringify(draft));
        });
      });
    }
  };
})(window.OngCadastro = window.OngCadastro || {});