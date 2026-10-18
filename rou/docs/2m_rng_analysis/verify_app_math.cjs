// Run only the supplied app's math declarations; compare with saved SciPy cases.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');

const [appPath, outputDir] = process.argv.slice(2);
if (!appPath || !outputDir) throw new Error('Usage: node verify_app_math.cjs APP OUTPUT');
const source = fs.readFileSync(appPath, 'utf8');
const start = source.indexOf('function logGamma(');
const end = source.indexOf('/* ---------------- state ---------------- */', start);
if (start < 0 || end < 0) throw new Error('Expected math boundaries not found');
const mathSource = source.slice(start, end);
const context = vm.createContext({});
vm.runInContext(mathSource, context, {timeout: 3000});
const cases = JSON.parse(fs.readFileSync(path.join(outputDir,
  'app_validation_cases.json'), 'utf8'));
const results = [];
for (const c of cases) {
  Object.assign(context, {K: c.k, N: c.n, P0: c.p0});
  const result = vm.runInContext(`({
    p: twoSidedP(K,N,P0), above: 1-incBeta(K+1,N-K+1,P0),
    low: betaQuantile(.025,K+1,N-K+1),
    high: betaQuantile(.975,K+1,N-K+1)
  })`, context, {timeout: 3000});
  results.push({category:c.category, ...result,
    p_error:Math.abs(result.p-c.scipy_p),
    above_error:Math.abs(result.above-c.scipy_above),
    ci_error:Math.max(Math.abs(result.low-c.scipy_ci_low),
                     Math.abs(result.high-c.scipy_ci_high))});
}
const pError = Math.max(...results.map(r=>r.p_error));
const aboveError = Math.max(...results.map(r=>r.above_error));
const ciError = Math.max(...results.map(r=>r.ci_error));
const powerExamples = cases.filter(c=>c.category.startsWith('number_'))
  .sort((a,b)=>Math.abs(b.k/b.n-b.p0)-Math.abs(a.k/a.n-a.p0)).slice(0,3)
  .map(c=>{
    Object.assign(context,{N:c.n,P0:c.p0,P1:c.k/c.n});
    return {category:c.category,p1:c.k/c.n,p0:c.p0,
      app_power_current:vm.runInContext('exactPower(N,P1,P0,.05)',context,
                                        {timeout:5000}),
      app_required_n:vm.runInContext('requiredN(P1,P0,.05,.8)',context,
                                     {timeout:10000})};
  });
const summary = {cases:cases.length,max_abs_p_error:pError,
  max_abs_above_error:aboveError,max_abs_ci_error:ciError,
  passed:pError<1e-6 && aboveError<1e-6 && ciError<1e-7,
  app_sha256:crypto.createHash('sha256').update(fs.readFileSync(appPath)).digest('hex'),
  math_functions:[...mathSource.matchAll(/function\s+(\w+)\(/g)].map(m=>m[1]),
  original_math:mathSource,
  sample_size_examples:powerExamples,
  comparisons:results};
fs.writeFileSync(path.join(outputDir,'app_math_validation.json'),
  JSON.stringify(summary,null,2)+'\n');
console.log(`Original-app parity: ${summary.passed}; cases=${summary.cases}; `+
            `max p error=${pError}; max CI error=${ciError}`);
if (!summary.passed) process.exitCode=1;
