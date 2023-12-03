use aiken/hash.{Blake2b_224, Hash}
use aiken/list
use aiken/transaction.{ScriptContext}
use aiken/transaction/credential.{VerificationKey}

type Datum {
  owner: Hash<Blake2b_224, VerificationKey>,
}

validator {
  fn token(datum: Datum, _redeemer: ByteArray, context: ScriptContext) -> Bool {
    let must_be_signed =
      list.has(context.transaction.extra_signatories, datum.owner)
    must_be_signed?
  }
}
