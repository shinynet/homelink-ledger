use aiken/hash.{Blake2b_224, Hash}
use aiken/list
use aiken/transaction.{
  OutputReference, ScriptContext, Spend, Transaction, TransactionId,
}
use aiken/transaction/credential.{VerificationKey}

validator(owner: Hash<Blake2b_224, VerificationKey>) {
  fn token(_redeemer: Void, context: ScriptContext) -> Bool {
    let must_be_signed = list.has(context.transaction.extra_signatories, owner)
    must_be_signed?
  }
}

test token_test_success() {
  let owner = #"00000000000000000000000000000000000000000000000000000000"

  let redeemer = Void

  let placeholder_utxo =
    OutputReference { transaction_id: TransactionId(""), output_index: 0 }

  let context =
    ScriptContext {
      purpose: Spend(placeholder_utxo),
      transaction: transaction.placeholder()
        |> fn(transaction) {
             Transaction { ..transaction, extra_signatories: [owner] }
           },
    }

  token(owner, redeemer, context)
}
