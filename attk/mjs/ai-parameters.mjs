// Policy knobs, separate from original combat/economy rules. Runtime overrides: config/ai-config.json.
export const DEFAULT_AI={
  "battle": {
    "smartIntelligence": 50,
    "expertIntelligence": 75,
    "safeDuelWarMargin": 20,
    "outnumberedPowerRatio": 0.85,
    "fireMinimumIntelligence": 60,
    "reinforceMenRatio": 0.7,
    "chargeMenRatio": 1.5,
    "reinforceFood": 5000,
    "ambushAdvanceEveryDays": 3,
    "terrainSearchRadius": 4,
    "jungleWeight": 7,
    "routeAmbushWeight": 12,
    "riverBankWeight": 6
  },
  "governance": {
    "smartIntelligence": 50,
    "maxInvaders": 5,
    "courtMarriageChance": 0.02,
    "diplomacyChance": 0.07,
    "attackStrengthRatio": 1.25,
    "basicAttackStrengthRatio": 0.65,
    "minimumWarFood": 5000,
    "minimumCarriedFood": 6000,
    "warProvisionDays": 75,
    "loyaltyTarget": 65,
    "reliefAmount": 3000,
    "recruitTargetMen": 4000,
    "hireHundreds": 10,
    "weaponsCoverageTarget": 0.8,
    "trainingTarget": 70,
    "developmentGold": 100,
    "politicsChance": 0.12,
    "politicsMinimumIntelligence": 40,
    "battleAllyChance": 0.05
  }
};
export function validateAIConfig(input={}){if(!input||typeof input!=='object'||Array.isArray(input)||Object.keys(input).some(k=>!Object.hasOwn(DEFAULT_AI,k)))throw Error('Invalid AI tuning configuration.');const out=structuredClone(DEFAULT_AI);for(const group of Object.keys(out)){if(input[group]!==undefined&&(!input[group]||typeof input[group]!=='object'))throw Error('Invalid AI tuning group.');for(const [key,value] of Object.entries(input[group]||{})){if(!(key in out[group])||!Number.isFinite(value)||value<0||value>100000)throw Error(`Invalid AI tuning: ${group}.${key}`);if(/EveryDays|ProvisionDays|Radius|Invaders|Hundreds/.test(key)&&(!Number.isInteger(value)||value<1))throw Error(`AI tuning requires a positive integer: ${key}`);if(key==='maxInvaders'&&value>5)throw Error('AI invasions allow at most five initial commanders.');if(/Chance/.test(key)&&value>1)throw Error(`AI chance exceeds one: ${key}`);out[group][key]=value;}}return out;}
