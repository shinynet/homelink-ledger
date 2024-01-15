use aiken/constants.{policy_id}
use aiken/transaction.{ScriptContext} as tx

validator(_key: ByteArray) {
  fn token(_redeemer: Void, _context: ScriptContext) -> Bool {
    True
  }
}

test token_test_success() {
  let key = "8bcf424c-c913-46d1-9f71-1c636d7c5d1d"

  let redeemer = Void

  let context =
    ScriptContext { purpose: tx.Mint(policy_id), transaction: tx.placeholder() }

  token(key, redeemer, context)
}
