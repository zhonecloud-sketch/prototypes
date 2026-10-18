import { analyse } from './insights-model.js';
self.onmessage = ({ data }) => {
  try { self.postMessage({ id: data.id, result: analyse(data.records, data.options) }); }
  catch (error) { self.postMessage({ id: data.id, error: error.message }); }
};
