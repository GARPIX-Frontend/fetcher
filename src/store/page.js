export default store => {
  store.on('@init', () => ({ page: undefined }));
  store.on('page/set', ({ }, { page }) => ({ page }));
  store.on('page/set/status', ({ page }, { status }) => {
    return {
      page: {
        ...page, status
      }
    }
  });
}