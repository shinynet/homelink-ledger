use aiken/dict
use aiken/hash.{Blake2b_224, Hash}
use aiken/interval
use aiken/transaction.{
  Input, NoDatum, Output, OutputReference, Transaction, TransactionId,
}
use aiken/transaction/credential.{
  Address, VerificationKey, VerificationKeyCredential,
}
use aiken/transaction/value.{PolicyId, Value}

pub const pkh: Hash<Blake2b_224, VerificationKey> =
  #"00000000000000000000000000000000000000000000000000000000"

pub const policy_id: PolicyId = #"0000000000"

pub const token_name: ByteArray = "blah blah token_name"

pub fn default_utxo() -> OutputReference {
  OutputReference {
    transaction_id: TransactionId {
      hash: #"0000000000000000000000000000000000000000000000000000000000000000",
    },
    output_index: 0,
  }
}

pub fn default_output() -> Output {
  Output {
    address: Address {
      payment_credential: VerificationKeyCredential(pkh),
      stake_credential: None,
    },
    datum: NoDatum,
    reference_script: None,
    value: value.from_lovelace(1000000),
  }
}

pub fn default_input() -> Input {
  Input { output: default_output(), output_reference: default_utxo() }
}

pub fn default_tx(
  minted: Value,
  inputs: List<Input>,
  extra_signatories: List<Hash<Blake2b_224, VerificationKey>>,
) -> Transaction {
  // borrowed from: https://github.com/aiken-lang/stdlib/blob/main/lib/aiken/transaction.ak#L84
  Transaction {
    inputs,
    reference_inputs: [],
    outputs: [],
    fee: value.zero(),
    // add minted value
    mint: minted |> value.to_minted_value(),
    certificates: [],
    withdrawals: dict.new(),
    validity_range: interval.everything(),
    extra_signatories,
    redeemers: dict.new(),
    datums: dict.new(),
    id: TransactionId {
      hash: #"0000000000000000000000000000000000000000000000000000000000000000",
    },
  }
}
