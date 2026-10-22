import { analyse } from './insights-model.js';
import { serverRecords } from './server-records.js';
self.onmessage = ({ data }) => {
  try { self.postMessage({ id: data.id, result: analyse(data.server ? serverRecords(data.records,data.owner,data.epoch) : data.records, data.options) }); }
  catch (error) { self.postMessage({ id: data.id, error: error.message }); }
};
