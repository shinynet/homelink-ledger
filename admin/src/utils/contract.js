import { lucid } from 'boot/lucid'
import { applyDoubleCborEncoding, applyParamsToScript, fromText } from 'lucid-cardano'
import blueprint from '../../../aiken/plutus.json'

const token = blueprint.validators.find(
  v => v.title === 'lights.token'
)

const getScript = key => applyParamsToScript(
  token.compiledCode,
  [fromText(key)]
)

const getMintingPolicy = key => ({
  type: 'PlutusV2',
  script: applyDoubleCborEncoding(getScript(key))
})

const getPolicyId = key => lucid.utils.validatorToScriptHash({
  type: 'PlutusV2',
  script: getScript(key)
})

export {
  getPolicyId,
  getMintingPolicy
}
