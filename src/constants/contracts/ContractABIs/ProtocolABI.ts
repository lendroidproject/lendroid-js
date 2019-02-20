//tslint:disable
export const ProtocolABI = [
  {
    "name": "PositionStatusNotification",
    "inputs": [
      {
        "type": "address",
        "name": "_wrangler",
        "indexed": true
      },
      {
        "type": "bytes32",
        "name": "_position_hash",
        "indexed": true
      },
      {
        "type": "bytes",
        "name": "_notification_key",
        "indexed": false
      },
      {
        "type": "uint256",
        "name": "_notification_value",
        "indexed": false
      }
    ],
    "anonymous": false,
    "type": "event"
  },
  {
    "name": "PositionBorrowCurrencyNotification",
    "inputs": [
      {
        "type": "address",
        "name": "_wrangler",
        "indexed": true
      },
      {
        "type": "bytes32",
        "name": "_position_hash",
        "indexed": true
      },
      {
        "type": "bytes",
        "name": "_notification_key",
        "indexed": false
      },
      {
        "type": "uint256",
        "name": "_notification_value",
        "indexed": false
      }
    ],
    "anonymous": false,
    "type": "event"
  },
  {
    "name": "__init__",
    "outputs": [],
    "inputs": [
      {
        "type": "address",
        "name": "_protocol_token_address"
      }
    ],
    "constant": false,
    "payable": false,
    "type": "constructor"
  },
  {
    "name": "set_position_threshold",
    "outputs": [
      {
        "type": "bool",
        "name": "out"
      }
    ],
    "inputs": [
      {
        "type": "uint256",
        "name": "_value"
      }
    ],
    "constant": false,
    "payable": false,
    "type": "function",
    "gas": 35633
  },
  {
    "name": "set_wrangler_status",
    "outputs": [
      {
        "type": "bool",
        "name": "out"
      }
    ],
    "inputs": [
      {
        "type": "address",
        "name": "_address"
      },
      {
        "type": "bool",
        "name": "_is_active"
      }
    ],
    "constant": false,
    "payable": false,
    "type": "function",
    "gas": 35859
  },
  {
    "name": "can_borrow",
    "outputs": [
      {
        "type": "bool",
        "name": "out"
      }
    ],
    "inputs": [
      {
        "type": "address",
        "name": "_address"
      }
    ],
    "constant": true,
    "payable": false,
    "type": "function",
    "gas": 951
  },
  {
    "name": "can_lend",
    "outputs": [
      {
        "type": "bool",
        "name": "out"
      }
    ],
    "inputs": [
      {
        "type": "address",
        "name": "_address"
      }
    ],
    "constant": true,
    "payable": false,
    "type": "function",
    "gas": 981
  },
  {
    "name": "filled_or_cancelled_loan_amount",
    "outputs": [
      {
        "type": "uint256",
        "name": "out"
      }
    ],
    "inputs": [
      {
        "type": "bytes32",
        "name": "_kernel_hash"
      }
    ],
    "constant": true,
    "payable": false,
    "type": "function",
    "gas": 1263
  },
  {
    "name": "position",
    "outputs": [
      {
        "type": "uint256",
        "name": "out"
      },
      {
        "type": "address",
        "name": "out"
      },
      {
        "type": "address",
        "name": "out"
      },
      {
        "type": "address",
        "name": "out"
      },
      {
        "type": "address",
        "name": "out"
      },
      {
        "type": "uint256",
        "name": "out",
        "unit": "sec"
      },
      {
        "type": "uint256",
        "name": "out",
        "unit": "sec"
      },
      {
        "type": "uint256",
        "name": "out",
        "unit": "sec"
      },
      {
        "type": "address",
        "name": "out"
      },
      {
        "type": "address",
        "name": "out"
      },
      {
        "type": "uint256",
        "name": "out"
      },
      {
        "type": "uint256",
        "name": "out"
      },
      {
        "type": "uint256",
        "name": "out"
      },
      {
        "type": "uint256",
        "name": "out"
      },
      {
        "type": "uint256",
        "name": "out"
      },
      {
        "type": "uint256",
        "name": "out"
      },
      {
        "type": "uint256",
        "name": "out"
      },
      {
        "type": "uint256",
        "name": "out"
      },
      {
        "type": "uint256",
        "name": "out"
      },
      {
        "type": "uint256",
        "name": "out"
      },
      {
        "type": "bytes32",
        "name": "out"
      }
    ],
    "inputs": [
      {
        "type": "bytes32",
        "name": "_position_hash"
      }
    ],
    "constant": true,
    "payable": false,
    "type": "function",
    "gas": 9091
  },
  {
    "name": "kernel_hash",
    "outputs": [
      {
        "type": "bytes32",
        "name": "out"
      }
    ],
    "inputs": [
      {
        "type": "address[6]",
        "name": "_addresses"
      },
      {
        "type": "uint256[5]",
        "name": "_values"
      },
      {
        "type": "uint256",
        "name": "_kernel_expires_at",
        "unit": "sec"
      },
      {
        "type": "bytes32",
        "name": "_creator_salt"
      },
      {
        "type": "uint256",
        "name": "_daily_interest_rate"
      },
      {
        "type": "uint256",
        "name": "_position_duration_in_seconds",
        "unit": "sec"
      }
    ],
    "constant": true,
    "payable": false,
    "type": "function",
    "gas": 2351
  },
  {
    "name": "position_hash",
    "outputs": [
      {
        "type": "bytes32",
        "name": "out"
      }
    ],
    "inputs": [
      {
        "type": "address[6]",
        "name": "_addresses"
      },
      {
        "type": "uint256[7]",
        "name": "_values"
      },
      {
        "type": "uint256",
        "name": "_lend_currency_owed_value"
      },
      {
        "type": "uint256",
        "name": "_nonce"
      }
    ],
    "constant": true,
    "payable": false,
    "type": "function",
    "gas": 2364
  },
  {
    "name": "position_counts",
    "outputs": [
      {
        "type": "uint256",
        "name": "out"
      },
      {
        "type": "uint256",
        "name": "out"
      }
    ],
    "inputs": [
      {
        "type": "address",
        "name": "_address"
      }
    ],
    "constant": true,
    "payable": false,
    "type": "function",
    "gas": 1378
  },
  {
    "name": "topup_position",
    "outputs": [
      {
        "type": "bool",
        "name": "out"
      }
    ],
    "inputs": [
      {
        "type": "bytes32",
        "name": "_position_hash"
      },
      {
        "type": "uint256",
        "name": "_borrow_currency_increment"
      }
    ],
    "constant": false,
    "payable": false,
    "type": "function",
    "gas": 74881
  },
  {
    "name": "liquidate_position",
    "outputs": [
      {
        "type": "bool",
        "name": "out"
      }
    ],
    "inputs": [
      {
        "type": "bytes32",
        "name": "_position_hash"
      }
    ],
    "constant": false,
    "payable": false,
    "type": "function",
    "gas": 883709
  },
  {
    "name": "close_position",
    "outputs": [
      {
        "type": "bool",
        "name": "out"
      }
    ],
    "inputs": [
      {
        "type": "bytes32",
        "name": "_position_hash"
      }
    ],
    "constant": false,
    "payable": false,
    "type": "function",
    "gas": 885542
  },
  {
    "name": "fill_kernel",
    "outputs": [
      {
        "type": "bool",
        "name": "out"
      }
    ],
    "inputs": [
      {
        "type": "address[6]",
        "name": "_addresses"
      },
      {
        "type": "uint256[7]",
        "name": "_values"
      },
      {
        "type": "uint256",
        "name": "_nonce"
      },
      {
        "type": "uint256",
        "name": "_kernel_daily_interest_rate"
      },
      {
        "type": "bool",
        "name": "_is_creator_lender"
      },
      {
        "type": "uint256[2]",
        "name": "_timestamps"
      },
      {
        "type": "uint256",
        "name": "_position_duration_in_seconds",
        "unit": "sec"
      },
      {
        "type": "bytes32",
        "name": "_kernel_creator_salt"
      },
      {
        "type": "uint256[3][2]",
        "name": "_sig_data"
      }
    ],
    "constant": false,
    "payable": false,
    "type": "function",
    "gas": 1241857
  },
  {
    "name": "cancel_kernel",
    "outputs": [
      {
        "type": "bool",
        "name": "out"
      }
    ],
    "inputs": [
      {
        "type": "address[6]",
        "name": "_addresses"
      },
      {
        "type": "uint256[5]",
        "name": "_values"
      },
      {
        "type": "uint256",
        "name": "_kernel_expires",
        "unit": "sec"
      },
      {
        "type": "bytes32",
        "name": "_kernel_creator_salt"
      },
      {
        "type": "uint256",
        "name": "_kernel_daily_interest_rate"
      },
      {
        "type": "uint256",
        "name": "_position_duration_in_seconds",
        "unit": "sec"
      },
      {
        "type": "uint256[3]",
        "name": "_sig_data"
      },
      {
        "type": "uint256",
        "name": "_lend_currency_cancel_value"
      }
    ],
    "constant": false,
    "payable": false,
    "type": "function",
    "gas": 50331
  },
  {
    "name": "__default__",
    "outputs": [],
    "inputs": [],
    "constant": false,
    "payable": true,
    "type": "function"
  },
  {
    "name": "protocol_token_address",
    "outputs": [
      {
        "type": "address",
        "name": "out"
      }
    ],
    "inputs": [],
    "constant": true,
    "payable": false,
    "type": "function",
    "gas": 1023
  },
  {
    "name": "owner",
    "outputs": [
      {
        "type": "address",
        "name": "out"
      }
    ],
    "inputs": [],
    "constant": true,
    "payable": false,
    "type": "function",
    "gas": 1053
  },
  {
    "name": "kernels_filled",
    "outputs": [
      {
        "type": "uint256",
        "name": "out"
      }
    ],
    "inputs": [
      {
        "type": "bytes32",
        "name": "arg0"
      }
    ],
    "constant": true,
    "payable": false,
    "type": "function",
    "gas": 1216
  },
  {
    "name": "kernels_cancelled",
    "outputs": [
      {
        "type": "uint256",
        "name": "out"
      }
    ],
    "inputs": [
      {
        "type": "bytes32",
        "name": "arg0"
      }
    ],
    "constant": true,
    "payable": false,
    "type": "function",
    "gas": 1246
  },
  {
    "name": "positions__index",
    "outputs": [
      {
        "type": "uint256",
        "name": "out"
      }
    ],
    "inputs": [
      {
        "type": "bytes32",
        "name": "arg0"
      }
    ],
    "constant": true,
    "payable": false,
    "type": "function",
    "gas": 1348
  },
  {
    "name": "positions__lender",
    "outputs": [
      {
        "type": "address",
        "name": "out"
      }
    ],
    "inputs": [
      {
        "type": "bytes32",
        "name": "arg0"
      }
    ],
    "constant": true,
    "payable": false,
    "type": "function",
    "gas": 1384
  },
  {
    "name": "positions__borrower",
    "outputs": [
      {
        "type": "address",
        "name": "out"
      }
    ],
    "inputs": [
      {
        "type": "bytes32",
        "name": "arg0"
      }
    ],
    "constant": true,
    "payable": false,
    "type": "function",
    "gas": 1414
  },
  {
    "name": "positions__relayer",
    "outputs": [
      {
        "type": "address",
        "name": "out"
      }
    ],
    "inputs": [
      {
        "type": "bytes32",
        "name": "arg0"
      }
    ],
    "constant": true,
    "payable": false,
    "type": "function",
    "gas": 1444
  },
  {
    "name": "positions__wrangler",
    "outputs": [
      {
        "type": "address",
        "name": "out"
      }
    ],
    "inputs": [
      {
        "type": "bytes32",
        "name": "arg0"
      }
    ],
    "constant": true,
    "payable": false,
    "type": "function",
    "gas": 1474
  },
  {
    "name": "positions__created_at",
    "outputs": [
      {
        "type": "uint256",
        "name": "out",
        "unit": "sec"
      }
    ],
    "inputs": [
      {
        "type": "bytes32",
        "name": "arg0"
      }
    ],
    "constant": true,
    "payable": false,
    "type": "function",
    "gas": 1504
  },
  {
    "name": "positions__expires_at",
    "outputs": [
      {
        "type": "uint256",
        "name": "out",
        "unit": "sec"
      }
    ],
    "inputs": [
      {
        "type": "bytes32",
        "name": "arg0"
      }
    ],
    "constant": true,
    "payable": false,
    "type": "function",
    "gas": 1534
  },
  {
    "name": "positions__updated_at",
    "outputs": [
      {
        "type": "uint256",
        "name": "out",
        "unit": "sec"
      }
    ],
    "inputs": [
      {
        "type": "bytes32",
        "name": "arg0"
      }
    ],
    "constant": true,
    "payable": false,
    "type": "function",
    "gas": 1564
  },
  {
    "name": "positions__borrow_currency_address",
    "outputs": [
      {
        "type": "address",
        "name": "out"
      }
    ],
    "inputs": [
      {
        "type": "bytes32",
        "name": "arg0"
      }
    ],
    "constant": true,
    "payable": false,
    "type": "function",
    "gas": 1594
  },
  {
    "name": "positions__lend_currency_address",
    "outputs": [
      {
        "type": "address",
        "name": "out"
      }
    ],
    "inputs": [
      {
        "type": "bytes32",
        "name": "arg0"
      }
    ],
    "constant": true,
    "payable": false,
    "type": "function",
    "gas": 1624
  },
  {
    "name": "positions__borrow_currency_value",
    "outputs": [
      {
        "type": "uint256",
        "name": "out"
      }
    ],
    "inputs": [
      {
        "type": "bytes32",
        "name": "arg0"
      }
    ],
    "constant": true,
    "payable": false,
    "type": "function",
    "gas": 1654
  },
  {
    "name": "positions__borrow_currency_current_value",
    "outputs": [
      {
        "type": "uint256",
        "name": "out"
      }
    ],
    "inputs": [
      {
        "type": "bytes32",
        "name": "arg0"
      }
    ],
    "constant": true,
    "payable": false,
    "type": "function",
    "gas": 1684
  },
  {
    "name": "positions__lend_currency_filled_value",
    "outputs": [
      {
        "type": "uint256",
        "name": "out"
      }
    ],
    "inputs": [
      {
        "type": "bytes32",
        "name": "arg0"
      }
    ],
    "constant": true,
    "payable": false,
    "type": "function",
    "gas": 1714
  },
  {
    "name": "positions__lend_currency_owed_value",
    "outputs": [
      {
        "type": "uint256",
        "name": "out"
      }
    ],
    "inputs": [
      {
        "type": "bytes32",
        "name": "arg0"
      }
    ],
    "constant": true,
    "payable": false,
    "type": "function",
    "gas": 1744
  },
  {
    "name": "positions__status",
    "outputs": [
      {
        "type": "uint256",
        "name": "out"
      }
    ],
    "inputs": [
      {
        "type": "bytes32",
        "name": "arg0"
      }
    ],
    "constant": true,
    "payable": false,
    "type": "function",
    "gas": 1774
  },
  {
    "name": "positions__nonce",
    "outputs": [
      {
        "type": "uint256",
        "name": "out"
      }
    ],
    "inputs": [
      {
        "type": "bytes32",
        "name": "arg0"
      }
    ],
    "constant": true,
    "payable": false,
    "type": "function",
    "gas": 1804
  },
  {
    "name": "positions__relayer_fee",
    "outputs": [
      {
        "type": "uint256",
        "name": "out"
      }
    ],
    "inputs": [
      {
        "type": "bytes32",
        "name": "arg0"
      }
    ],
    "constant": true,
    "payable": false,
    "type": "function",
    "gas": 1834
  },
  {
    "name": "positions__monitoring_fee",
    "outputs": [
      {
        "type": "uint256",
        "name": "out"
      }
    ],
    "inputs": [
      {
        "type": "bytes32",
        "name": "arg0"
      }
    ],
    "constant": true,
    "payable": false,
    "type": "function",
    "gas": 1864
  },
  {
    "name": "positions__rollover_fee",
    "outputs": [
      {
        "type": "uint256",
        "name": "out"
      }
    ],
    "inputs": [
      {
        "type": "bytes32",
        "name": "arg0"
      }
    ],
    "constant": true,
    "payable": false,
    "type": "function",
    "gas": 1894
  },
  {
    "name": "positions__closure_fee",
    "outputs": [
      {
        "type": "uint256",
        "name": "out"
      }
    ],
    "inputs": [
      {
        "type": "bytes32",
        "name": "arg0"
      }
    ],
    "constant": true,
    "payable": false,
    "type": "function",
    "gas": 1924
  },
  {
    "name": "positions__hash",
    "outputs": [
      {
        "type": "bytes32",
        "name": "out"
      }
    ],
    "inputs": [
      {
        "type": "bytes32",
        "name": "arg0"
      }
    ],
    "constant": true,
    "payable": false,
    "type": "function",
    "gas": 1954
  },
  {
    "name": "last_position_index",
    "outputs": [
      {
        "type": "uint256",
        "name": "out"
      }
    ],
    "inputs": [],
    "constant": true,
    "payable": false,
    "type": "function",
    "gas": 1773
  },
  {
    "name": "position_index",
    "outputs": [
      {
        "type": "bytes32",
        "name": "out"
      }
    ],
    "inputs": [
      {
        "type": "uint256",
        "name": "arg0"
      }
    ],
    "constant": true,
    "payable": false,
    "type": "function",
    "gas": 1936
  },
  {
    "name": "position_threshold",
    "outputs": [
      {
        "type": "uint256",
        "name": "out"
      }
    ],
    "inputs": [],
    "constant": true,
    "payable": false,
    "type": "function",
    "gas": 1833
  },
  {
    "name": "last_borrow_position_index",
    "outputs": [
      {
        "type": "uint256",
        "name": "out"
      }
    ],
    "inputs": [
      {
        "type": "address",
        "name": "arg0"
      }
    ],
    "constant": true,
    "payable": false,
    "type": "function",
    "gas": 2035
  },
  {
    "name": "last_lend_position_index",
    "outputs": [
      {
        "type": "uint256",
        "name": "out"
      }
    ],
    "inputs": [
      {
        "type": "address",
        "name": "arg0"
      }
    ],
    "constant": true,
    "payable": false,
    "type": "function",
    "gas": 2065
  },
  {
    "name": "borrow_positions",
    "outputs": [
      {
        "type": "bytes32",
        "name": "out"
      }
    ],
    "inputs": [
      {
        "type": "address",
        "name": "arg0"
      },
      {
        "type": "uint256",
        "name": "arg1"
      }
    ],
    "constant": true,
    "payable": false,
    "type": "function",
    "gas": 2216
  },
  {
    "name": "lend_positions",
    "outputs": [
      {
        "type": "bytes32",
        "name": "out"
      }
    ],
    "inputs": [
      {
        "type": "address",
        "name": "arg0"
      },
      {
        "type": "uint256",
        "name": "arg1"
      }
    ],
    "constant": true,
    "payable": false,
    "type": "function",
    "gas": 2246
  },
  {
    "name": "wranglers",
    "outputs": [
      {
        "type": "bool",
        "name": "out"
      }
    ],
    "inputs": [
      {
        "type": "address",
        "name": "arg0"
      }
    ],
    "constant": true,
    "payable": false,
    "type": "function",
    "gas": 2155
  },
  {
    "name": "wrangler_nonces",
    "outputs": [
      {
        "type": "uint256",
        "name": "out"
      }
    ],
    "inputs": [
      {
        "type": "address",
        "name": "arg0"
      },
      {
        "type": "address",
        "name": "arg1"
      }
    ],
    "constant": true,
    "payable": false,
    "type": "function",
    "gas": 2345
  },
  {
    "name": "SECONDS_PER_DAY",
    "outputs": [
      {
        "type": "uint256",
        "name": "out"
      }
    ],
    "inputs": [],
    "constant": true,
    "payable": false,
    "type": "function",
    "gas": 2043
  },
  {
    "name": "POSITION_STATUS_OPEN",
    "outputs": [
      {
        "type": "uint256",
        "name": "out"
      }
    ],
    "inputs": [],
    "constant": true,
    "payable": false,
    "type": "function",
    "gas": 2073
  },
  {
    "name": "POSITION_STATUS_CLOSED",
    "outputs": [
      {
        "type": "uint256",
        "name": "out"
      }
    ],
    "inputs": [],
    "constant": true,
    "payable": false,
    "type": "function",
    "gas": 2103
  },
  {
    "name": "POSITION_STATUS_LIQUIDATED",
    "outputs": [
      {
        "type": "uint256",
        "name": "out"
      }
    ],
    "inputs": [],
    "constant": true,
    "payable": false,
    "type": "function",
    "gas": 2133
  },
  {
    "name": "POSITION_TOPPED_UP",
    "outputs": [
      {
        "type": "uint256",
        "name": "out"
      }
    ],
    "inputs": [],
    "constant": true,
    "payable": false,
    "type": "function",
    "gas": 2163
  }
]