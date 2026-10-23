import { analyse } from './insights-model.js?v=20261023-insights-gaps';
import { serverRecords } from './server-records.js?v=20261023-insights-gaps';
self.onmessage = ({ data }) => {
  try { self.postMessage({ id: data.id, result: analyse(data.server ? serverRecords(data.records,data.owner,data.epoch) : data.records, data.options) }); }
  catch (error) { self.postMessage({ id: data.id, error: error.message }); }
};
