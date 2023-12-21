use aiken/constants.{
  default_input, default_output, default_tx, default_utxo, pkh, policy_id,
  token_name,
}
use aiken/dict
use aiken/hash.{Blake2b_224, Hash}
use aiken/list
use aiken/transaction.{
  Input, OutputReference, ScriptContext, Transaction, TransactionId,
} as tx
use aiken/transaction/credential.{VerificationKey}
use aiken/transaction/value

type Action {
  Mint
  Burn
}

type NFTParams {
  pkh: Hash<Blake2b_224, VerificationKey>,
  utxo: OutputReference,
  token_name: ByteArray,
}

validator(params: NFTParams) {
  fn token(redeemer: Action, context: ScriptContext) -> Bool {
    when context.purpose is {
      tx.Mint(policy_id) -> {
        let NFTParams { pkh, utxo, token_name } = params

        // pattern match on the script context to get transaction
        let ScriptContext { transaction, .. } = context

        let must_be_signed =
          list.has(context.transaction.extra_signatories, pkh)

        // pattern match on the transaction to get inputs and mint from transaction. inputs contains minted assets
        let Transaction { inputs, mint, .. } = transaction

        // ensure transaction inputs contains utxo
        let hasUTxO =
          list.any(inputs, fn(input) { input.output_reference == utxo })

        when
          mint
            |> value.from_minted_value
            |> value.tokens(policy_id)
            |> dict.to_list()
        is {
          [(asset_name, amount)] -> {
            // ensure amount to be minted is equal to n and asset_name is equal to token_name
            let hasCorrectMintingTokenNameAndAmount =
              fn(n) { amount == n && asset_name == token_name }

            must_be_signed? && when redeemer is {
              Mint -> hasUTxO && hasCorrectMintingTokenNameAndAmount(1)
              Burn -> hasCorrectMintingTokenNameAndAmount(-1)
            }
          }
          _ -> False
        }
      }
      _ -> False
    }
  }
}

test token_mint_success() {
  let params = NFTParams { pkh, utxo: default_utxo(), token_name }

  let redeemer = Mint

  let minted = value.from_asset(policy_id, token_name, 1)
  let context =
    ScriptContext {
      purpose: tx.Mint(policy_id),
      transaction: default_tx(
        minted,
        inputs: [default_input()],
        extra_signatories: [pkh],
      ),
    }
  token(params, redeemer, context)
}

test token_mint_failure_pkh_mismatch() {
  let params = NFTParams { pkh, utxo: default_utxo(), token_name }

  let redeemer = Mint

  let minted = value.from_asset(policy_id, token_name, 1)

  let pkh2 = #"00000000000000000000000000000000000000000000000000000001"

  let context =
    ScriptContext {
      purpose: tx.Mint(policy_id),
      transaction: default_tx(
        minted,
        inputs: [default_input()],
        extra_signatories: [pkh2],
      ),
    }
  !token(params, redeemer, context)
}

test token_mint_failure_utxo_mismatch() {
  let utxo2 =
    OutputReference {
      transaction_id: TransactionId {
        hash: #"0000000000000000000000000000000000000000000000000000000000000001",
      },
      output_index: 0,
    }

  let params = NFTParams { pkh, utxo: default_utxo(), token_name }

  let input = Input { output: default_output(), output_reference: utxo2 }

  let redeemer = Mint

  let minted = value.from_asset(policy_id, token_name, 1)
  let context =
    ScriptContext {
      purpose: tx.Mint(policy_id),
      transaction: default_tx(minted, inputs: [input], extra_signatories: [pkh]),
    }
  !token(params, redeemer, context)
}

test token_mint_failure_token_name_mismatch() {
  let token_name2 = "bleh"

  let params = NFTParams { pkh, utxo: default_utxo(), token_name }

  let redeemer = Mint

  let minted = value.from_asset(policy_id, token_name2, 1)
  let context =
    ScriptContext {
      purpose: tx.Mint(policy_id),
      transaction: default_tx(
        minted,
        inputs: [default_input()],
        extra_signatories: [pkh],
      ),
    }
  !token(params, redeemer, context)
}

test token_mint_failure_non_mint_purpose() {
  let params = NFTParams { pkh, utxo: default_utxo(), token_name }

  let redeemer = Mint

  let minted = value.from_asset(policy_id, token_name, 1)
  let context =
    ScriptContext {
      purpose: tx.Spend(default_utxo()),
      transaction: default_tx(
        minted,
        inputs: [default_input()],
        extra_signatories: [pkh],
      ),
    }

  !token(params, redeemer, context)
}

test token_mint_failure_no_tokens_in_tx() {
  let params = NFTParams { pkh, utxo: default_utxo(), token_name }

  let redeemer = Mint

  let context =
    ScriptContext { purpose: tx.Mint(policy_id), transaction: tx.placeholder() }

  !token(params, redeemer, context)
}
