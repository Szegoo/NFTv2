export const contractAddress = "5HG8mNM3UTLKShPVxWDhLoudYcCrC7Ktme2k2VgDafsw8Zzo";
export const ABI = {
  "metadataVersion": "0.1.0",
  "source": {
    "hash": "0xde39eabe4c172c22e66a886b11f01bd48132e923ba9e4ba50298e033997778d9",
    "language": "ink! 3.0.0-rc4",
    "compiler": "rustc 1.56.0-nightly"
  },
  "contract": {
    "name": "flipper",
    "version": "0.1.0",
    "authors": [
      "[your_name] <[your_email]>"
    ]
  },
  "spec": {
    "constructors": [
      {
        "args": [],
        "docs": [],
        "name": [
          "new"
        ],
        "selector": "0x9bae9d5e"
      }
    ],
    "docs": [],
    "events": [],
    "messages": [
      {
        "args": [
          {
            "name": "account",
            "type": {
              "displayName": [
                "AccountId"
              ],
              "type": 5
            }
          },
          {
            "name": "id",
            "type": {
              "displayName": [
                "u128"
              ],
              "type": 8
            }
          }
        ],
        "docs": [],
        "mutates": false,
        "name": [
          "balance_of"
        ],
        "payable": false,
        "returnType": {
          "displayName": [
            "Option"
          ],
          "type": 21
        },
        "selector": "0x0f755a56"
      },
      {
        "args": [
          {
            "name": "account",
            "type": {
              "displayName": [
                "AccountId"
              ],
              "type": 5
            }
          },
          {
            "name": "id",
            "type": {
              "displayName": [
                "u128"
              ],
              "type": 8
            }
          }
        ],
        "docs": [],
        "mutates": false,
        "name": [
          "price_of"
        ],
        "payable": false,
        "returnType": {
          "displayName": [
            "Option"
          ],
          "type": 21
        },
        "selector": "0x56ee00d9"
      },
      {
        "args": [],
        "docs": [],
        "mutates": false,
        "name": [
          "get_last_id"
        ],
        "payable": false,
        "returnType": {
          "displayName": [
            "u128"
          ],
          "type": 8
        },
        "selector": "0xd3de4d5a"
      },
      {
        "args": [
          {
            "name": "id",
            "type": {
              "displayName": [
                "u128"
              ],
              "type": 8
            }
          }
        ],
        "docs": [],
        "mutates": false,
        "name": [
          "get_request"
        ],
        "payable": false,
        "returnType": {
          "displayName": [
            "Option"
          ],
          "type": 22
        },
        "selector": "0x77ba7f13"
      },
      {
        "args": [],
        "docs": [],
        "mutates": false,
        "name": [
          "get_requests_length"
        ],
        "payable": false,
        "returnType": {
          "displayName": [
            "u128"
          ],
          "type": 8
        },
        "selector": "0x60c50c93"
      },
      {
        "args": [
          {
            "name": "id",
            "type": {
              "displayName": [
                "u128"
              ],
              "type": 8
            }
          }
        ],
        "docs": [],
        "mutates": false,
        "name": [
          "creator_of"
        ],
        "payable": false,
        "returnType": {
          "displayName": [
            "Option"
          ],
          "type": 23
        },
        "selector": "0x85a3d8cc"
      },
      {
        "args": [
          {
            "name": "account",
            "type": {
              "displayName": [
                "AccountId"
              ],
              "type": 5
            }
          },
          {
            "name": "token_id",
            "type": {
              "displayName": [
                "u128"
              ],
              "type": 8
            }
          }
        ],
        "docs": [],
        "mutates": false,
        "name": [
          "is_owner"
        ],
        "payable": false,
        "returnType": {
          "displayName": [
            "bool"
          ],
          "type": 14
        },
        "selector": "0xd7a3fbb1"
      },
      {
        "args": [
          {
            "name": "token_id",
            "type": {
              "displayName": [
                "u128"
              ],
              "type": 8
            }
          },
          {
            "name": "indx",
            "type": {
              "displayName": [
                "u128"
              ],
              "type": 8
            }
          }
        ],
        "docs": [],
        "mutates": false,
        "name": [
          "owners_of"
        ],
        "payable": false,
        "returnType": {
          "displayName": [
            "Option"
          ],
          "type": 23
        },
        "selector": "0x81845a81"
      },
      {
        "args": [
          {
            "name": "token_id",
            "type": {
              "displayName": [
                "u128"
              ],
              "type": 8
            }
          }
        ],
        "docs": [],
        "mutates": false,
        "name": [
          "get_owners_length"
        ],
        "payable": false,
        "returnType": {
          "displayName": [
            "u128"
          ],
          "type": 8
        },
        "selector": "0xddd5ef59"
      },
      {
        "args": [
          {
            "name": "amount",
            "type": {
              "displayName": [
                "u128"
              ],
              "type": 8
            }
          },
          {
            "name": "price",
            "type": {
              "displayName": [
                "u128"
              ],
              "type": 8
            }
          }
        ],
        "docs": [],
        "mutates": true,
        "name": [
          "mint"
        ],
        "payable": false,
        "returnType": null,
        "selector": "0xcfdd9aa2"
      },
      {
        "args": [
          {
            "name": "token_id",
            "type": {
              "displayName": [
                "u128"
              ],
              "type": 8
            }
          },
          {
            "name": "from",
            "type": {
              "displayName": [
                "AccountId"
              ],
              "type": 5
            }
          },
          {
            "name": "amount",
            "type": {
              "displayName": [
                "u128"
              ],
              "type": 8
            }
          },
          {
            "name": "sell_price",
            "type": {
              "displayName": [
                "u128"
              ],
              "type": 8
            }
          }
        ],
        "docs": [],
        "mutates": true,
        "name": [
          "buy"
        ],
        "payable": true,
        "returnType": null,
        "selector": "0x15d62801"
      },
      {
        "args": [
          {
            "name": "your_token_id",
            "type": {
              "displayName": [
                "u128"
              ],
              "type": 8
            }
          },
          {
            "name": "your_amount",
            "type": {
              "displayName": [
                "u128"
              ],
              "type": 8
            }
          },
          {
            "name": "confirmer_token_id",
            "type": {
              "displayName": [
                "u128"
              ],
              "type": 8
            }
          },
          {
            "name": "confirmer_amount",
            "type": {
              "displayName": [
                "u128"
              ],
              "type": 8
            }
          },
          {
            "name": "confirmer",
            "type": {
              "displayName": [
                "AccountId"
              ],
              "type": 5
            }
          }
        ],
        "docs": [],
        "mutates": true,
        "name": [
          "create_swap_request"
        ],
        "payable": false,
        "returnType": null,
        "selector": "0x5f56de20"
      },
      {
        "args": [
          {
            "name": "swap_request_id",
            "type": {
              "displayName": [
                "u128"
              ],
              "type": 8
            }
          }
        ],
        "docs": [],
        "mutates": true,
        "name": [
          "confirm_swap_request"
        ],
        "payable": false,
        "returnType": null,
        "selector": "0x1d327e50"
      }
    ]
  },
  "storage": {
    "struct": {
      "fields": [
        {
          "layout": {
            "struct": {
              "fields": [
                {
                  "layout": {
                    "struct": {
                      "fields": [
                        {
                          "layout": {
                            "cell": {
                              "key": "0x0000000000000000000000000000000000000000000000000000000000000000",
                              "ty": 1
                            }
                          },
                          "name": "header"
                        },
                        {
                          "layout": {
                            "struct": {
                              "fields": [
                                {
                                  "layout": {
                                    "cell": {
                                      "key": "0x0100000000000000000000000000000000000000000000000000000000000000",
                                      "ty": 2
                                    }
                                  },
                                  "name": "len"
                                },
                                {
                                  "layout": {
                                    "array": {
                                      "cellsPerElem": 1,
                                      "layout": {
                                        "cell": {
                                          "key": "0x0100000001000000000000000000000000000000000000000000000000000000",
                                          "ty": 3
                                        }
                                      },
                                      "len": 4294967295,
                                      "offset": "0x0200000000000000000000000000000000000000000000000000000000000000"
                                    }
                                  },
                                  "name": "elems"
                                }
                              ]
                            }
                          },
                          "name": "entries"
                        }
                      ]
                    }
                  },
                  "name": "keys"
                },
                {
                  "layout": {
                    "hash": {
                      "layout": {
                        "cell": {
                          "key": "0x0200000001000000000000000000000000000000000000000000000000000000",
                          "ty": 10
                        }
                      },
                      "offset": "0x0100000001000000000000000000000000000000000000000000000000000000",
                      "strategy": {
                        "hasher": "Blake2x256",
                        "postfix": "",
                        "prefix": "0x696e6b20686173686d6170"
                      }
                    }
                  },
                  "name": "values"
                }
              ]
            }
          },
          "name": "balances"
        },
        {
          "layout": {
            "struct": {
              "fields": [
                {
                  "layout": {
                    "struct": {
                      "fields": [
                        {
                          "layout": {
                            "cell": {
                              "key": "0x0200000001000000000000000000000000000000000000000000000000000000",
                              "ty": 1
                            }
                          },
                          "name": "header"
                        },
                        {
                          "layout": {
                            "struct": {
                              "fields": [
                                {
                                  "layout": {
                                    "cell": {
                                      "key": "0x0300000001000000000000000000000000000000000000000000000000000000",
                                      "ty": 2
                                    }
                                  },
                                  "name": "len"
                                },
                                {
                                  "layout": {
                                    "array": {
                                      "cellsPerElem": 1,
                                      "layout": {
                                        "cell": {
                                          "key": "0x0300000002000000000000000000000000000000000000000000000000000000",
                                          "ty": 3
                                        }
                                      },
                                      "len": 4294967295,
                                      "offset": "0x0400000001000000000000000000000000000000000000000000000000000000"
                                    }
                                  },
                                  "name": "elems"
                                }
                              ]
                            }
                          },
                          "name": "entries"
                        }
                      ]
                    }
                  },
                  "name": "keys"
                },
                {
                  "layout": {
                    "hash": {
                      "layout": {
                        "cell": {
                          "key": "0x0400000002000000000000000000000000000000000000000000000000000000",
                          "ty": 10
                        }
                      },
                      "offset": "0x0300000002000000000000000000000000000000000000000000000000000000",
                      "strategy": {
                        "hasher": "Blake2x256",
                        "postfix": "",
                        "prefix": "0x696e6b20686173686d6170"
                      }
                    }
                  },
                  "name": "values"
                }
              ]
            }
          },
          "name": "prices"
        },
        {
          "layout": {
            "struct": {
              "fields": [
                {
                  "layout": {
                    "struct": {
                      "fields": [
                        {
                          "layout": {
                            "cell": {
                              "key": "0x0400000002000000000000000000000000000000000000000000000000000000",
                              "ty": 1
                            }
                          },
                          "name": "header"
                        },
                        {
                          "layout": {
                            "struct": {
                              "fields": [
                                {
                                  "layout": {
                                    "cell": {
                                      "key": "0x0500000002000000000000000000000000000000000000000000000000000000",
                                      "ty": 2
                                    }
                                  },
                                  "name": "len"
                                },
                                {
                                  "layout": {
                                    "array": {
                                      "cellsPerElem": 1,
                                      "layout": {
                                        "cell": {
                                          "key": "0x0500000003000000000000000000000000000000000000000000000000000000",
                                          "ty": 11
                                        }
                                      },
                                      "len": 4294967295,
                                      "offset": "0x0600000002000000000000000000000000000000000000000000000000000000"
                                    }
                                  },
                                  "name": "elems"
                                }
                              ]
                            }
                          },
                          "name": "entries"
                        }
                      ]
                    }
                  },
                  "name": "keys"
                },
                {
                  "layout": {
                    "hash": {
                      "layout": {
                        "cell": {
                          "key": "0x0600000003000000000000000000000000000000000000000000000000000000",
                          "ty": 13
                        }
                      },
                      "offset": "0x0500000003000000000000000000000000000000000000000000000000000000",
                      "strategy": {
                        "hasher": "Blake2x256",
                        "postfix": "",
                        "prefix": "0x696e6b20686173686d6170"
                      }
                    }
                  },
                  "name": "values"
                }
              ]
            }
          },
          "name": "approvals"
        },
        {
          "layout": {
            "struct": {
              "fields": [
                {
                  "layout": {
                    "struct": {
                      "fields": [
                        {
                          "layout": {
                            "cell": {
                              "key": "0x0600000003000000000000000000000000000000000000000000000000000000",
                              "ty": 1
                            }
                          },
                          "name": "header"
                        },
                        {
                          "layout": {
                            "struct": {
                              "fields": [
                                {
                                  "layout": {
                                    "cell": {
                                      "key": "0x0700000003000000000000000000000000000000000000000000000000000000",
                                      "ty": 2
                                    }
                                  },
                                  "name": "len"
                                },
                                {
                                  "layout": {
                                    "array": {
                                      "cellsPerElem": 1,
                                      "layout": {
                                        "cell": {
                                          "key": "0x0700000004000000000000000000000000000000000000000000000000000000",
                                          "ty": 15
                                        }
                                      },
                                      "len": 4294967295,
                                      "offset": "0x0800000003000000000000000000000000000000000000000000000000000000"
                                    }
                                  },
                                  "name": "elems"
                                }
                              ]
                            }
                          },
                          "name": "entries"
                        }
                      ]
                    }
                  },
                  "name": "keys"
                },
                {
                  "layout": {
                    "hash": {
                      "layout": {
                        "cell": {
                          "key": "0x0800000004000000000000000000000000000000000000000000000000000000",
                          "ty": 16
                        }
                      },
                      "offset": "0x0700000004000000000000000000000000000000000000000000000000000000",
                      "strategy": {
                        "hasher": "Blake2x256",
                        "postfix": "",
                        "prefix": "0x696e6b20686173686d6170"
                      }
                    }
                  },
                  "name": "values"
                }
              ]
            }
          },
          "name": "creators"
        },
        {
          "layout": {
            "struct": {
              "fields": [
                {
                  "layout": {
                    "struct": {
                      "fields": [
                        {
                          "layout": {
                            "cell": {
                              "key": "0x0800000004000000000000000000000000000000000000000000000000000000",
                              "ty": 1
                            }
                          },
                          "name": "header"
                        },
                        {
                          "layout": {
                            "struct": {
                              "fields": [
                                {
                                  "layout": {
                                    "cell": {
                                      "key": "0x0900000004000000000000000000000000000000000000000000000000000000",
                                      "ty": 2
                                    }
                                  },
                                  "name": "len"
                                },
                                {
                                  "layout": {
                                    "array": {
                                      "cellsPerElem": 1,
                                      "layout": {
                                        "cell": {
                                          "key": "0x0900000005000000000000000000000000000000000000000000000000000000",
                                          "ty": 15
                                        }
                                      },
                                      "len": 4294967295,
                                      "offset": "0x0a00000004000000000000000000000000000000000000000000000000000000"
                                    }
                                  },
                                  "name": "elems"
                                }
                              ]
                            }
                          },
                          "name": "entries"
                        }
                      ]
                    }
                  },
                  "name": "keys"
                },
                {
                  "layout": {
                    "hash": {
                      "layout": {
                        "cell": {
                          "key": "0x0a00000005000000000000000000000000000000000000000000000000000000",
                          "ty": 17
                        }
                      },
                      "offset": "0x0900000005000000000000000000000000000000000000000000000000000000",
                      "strategy": {
                        "hasher": "Blake2x256",
                        "postfix": "",
                        "prefix": "0x696e6b20686173686d6170"
                      }
                    }
                  },
                  "name": "values"
                }
              ]
            }
          },
          "name": "requests"
        },
        {
          "layout": {
            "struct": {
              "fields": [
                {
                  "layout": {
                    "struct": {
                      "fields": [
                        {
                          "layout": {
                            "cell": {
                              "key": "0x0a00000005000000000000000000000000000000000000000000000000000000",
                              "ty": 1
                            }
                          },
                          "name": "header"
                        },
                        {
                          "layout": {
                            "struct": {
                              "fields": [
                                {
                                  "layout": {
                                    "cell": {
                                      "key": "0x0b00000005000000000000000000000000000000000000000000000000000000",
                                      "ty": 2
                                    }
                                  },
                                  "name": "len"
                                },
                                {
                                  "layout": {
                                    "array": {
                                      "cellsPerElem": 1,
                                      "layout": {
                                        "cell": {
                                          "key": "0x0b00000006000000000000000000000000000000000000000000000000000000",
                                          "ty": 3
                                        }
                                      },
                                      "len": 4294967295,
                                      "offset": "0x0c00000005000000000000000000000000000000000000000000000000000000"
                                    }
                                  },
                                  "name": "elems"
                                }
                              ]
                            }
                          },
                          "name": "entries"
                        }
                      ]
                    }
                  },
                  "name": "keys"
                },
                {
                  "layout": {
                    "hash": {
                      "layout": {
                        "cell": {
                          "key": "0x0c00000006000000000000000000000000000000000000000000000000000000",
                          "ty": 13
                        }
                      },
                      "offset": "0x0b00000006000000000000000000000000000000000000000000000000000000",
                      "strategy": {
                        "hasher": "Blake2x256",
                        "postfix": "",
                        "prefix": "0x696e6b20686173686d6170"
                      }
                    }
                  },
                  "name": "values"
                }
              ]
            }
          },
          "name": "is_owner"
        },
        {
          "layout": {
            "struct": {
              "fields": [
                {
                  "layout": {
                    "struct": {
                      "fields": [
                        {
                          "layout": {
                            "cell": {
                              "key": "0x0c00000006000000000000000000000000000000000000000000000000000000",
                              "ty": 1
                            }
                          },
                          "name": "header"
                        },
                        {
                          "layout": {
                            "struct": {
                              "fields": [
                                {
                                  "layout": {
                                    "cell": {
                                      "key": "0x0d00000006000000000000000000000000000000000000000000000000000000",
                                      "ty": 2
                                    }
                                  },
                                  "name": "len"
                                },
                                {
                                  "layout": {
                                    "array": {
                                      "cellsPerElem": 1,
                                      "layout": {
                                        "cell": {
                                          "key": "0x0d00000007000000000000000000000000000000000000000000000000000000",
                                          "ty": 19
                                        }
                                      },
                                      "len": 4294967295,
                                      "offset": "0x0e00000006000000000000000000000000000000000000000000000000000000"
                                    }
                                  },
                                  "name": "elems"
                                }
                              ]
                            }
                          },
                          "name": "entries"
                        }
                      ]
                    }
                  },
                  "name": "keys"
                },
                {
                  "layout": {
                    "hash": {
                      "layout": {
                        "cell": {
                          "key": "0x0e00000007000000000000000000000000000000000000000000000000000000",
                          "ty": 16
                        }
                      },
                      "offset": "0x0d00000007000000000000000000000000000000000000000000000000000000",
                      "strategy": {
                        "hasher": "Blake2x256",
                        "postfix": "",
                        "prefix": "0x696e6b20686173686d6170"
                      }
                    }
                  },
                  "name": "values"
                }
              ]
            }
          },
          "name": "owners"
        },
        {
          "layout": {
            "cell": {
              "key": "0x0e00000007000000000000000000000000000000000000000000000000000000",
              "ty": 8
            }
          },
          "name": "last_id"
        },
        {
          "layout": {
            "cell": {
              "key": "0x0f00000007000000000000000000000000000000000000000000000000000000",
              "ty": 8
            }
          },
          "name": "requests_length"
        },
        {
          "layout": {
            "struct": {
              "fields": [
                {
                  "layout": {
                    "struct": {
                      "fields": [
                        {
                          "layout": {
                            "cell": {
                              "key": "0x1000000007000000000000000000000000000000000000000000000000000000",
                              "ty": 1
                            }
                          },
                          "name": "header"
                        },
                        {
                          "layout": {
                            "struct": {
                              "fields": [
                                {
                                  "layout": {
                                    "cell": {
                                      "key": "0x1100000007000000000000000000000000000000000000000000000000000000",
                                      "ty": 2
                                    }
                                  },
                                  "name": "len"
                                },
                                {
                                  "layout": {
                                    "array": {
                                      "cellsPerElem": 1,
                                      "layout": {
                                        "cell": {
                                          "key": "0x1100000008000000000000000000000000000000000000000000000000000000",
                                          "ty": 15
                                        }
                                      },
                                      "len": 4294967295,
                                      "offset": "0x1200000007000000000000000000000000000000000000000000000000000000"
                                    }
                                  },
                                  "name": "elems"
                                }
                              ]
                            }
                          },
                          "name": "entries"
                        }
                      ]
                    }
                  },
                  "name": "keys"
                },
                {
                  "layout": {
                    "hash": {
                      "layout": {
                        "cell": {
                          "key": "0x1200000008000000000000000000000000000000000000000000000000000000",
                          "ty": 10
                        }
                      },
                      "offset": "0x1100000008000000000000000000000000000000000000000000000000000000",
                      "strategy": {
                        "hasher": "Blake2x256",
                        "postfix": "",
                        "prefix": "0x696e6b20686173686d6170"
                      }
                    }
                  },
                  "name": "values"
                }
              ]
            }
          },
          "name": "owners_length"
        }
      ]
    }
  },
  "types": [
    {
      "def": {
        "composite": {
          "fields": [
            {
              "name": "last_vacant",
              "type": 2,
              "typeName": "Index"
            },
            {
              "name": "len",
              "type": 2,
              "typeName": "u32"
            },
            {
              "name": "len_entries",
              "type": 2,
              "typeName": "u32"
            }
          ]
        }
      },
      "path": [
        "ink_storage",
        "collections",
        "stash",
        "Header"
      ]
    },
    {
      "def": {
        "primitive": "u32"
      }
    },
    {
      "def": {
        "variant": {
          "variants": [
            {
              "fields": [
                {
                  "type": 9,
                  "typeName": "VacantEntry"
                }
              ],
              "name": "Vacant"
            },
            {
              "fields": [
                {
                  "type": 4,
                  "typeName": "T"
                }
              ],
              "name": "Occupied"
            }
          ]
        }
      },
      "params": [
        4
      ],
      "path": [
        "ink_storage",
        "collections",
        "stash",
        "Entry"
      ]
    },
    {
      "def": {
        "tuple": [
          5,
          8
        ]
      }
    },
    {
      "def": {
        "composite": {
          "fields": [
            {
              "type": 6,
              "typeName": "[u8; 32]"
            }
          ]
        }
      },
      "path": [
        "ink_env",
        "types",
        "AccountId"
      ]
    },
    {
      "def": {
        "array": {
          "len": 32,
          "type": 7
        }
      }
    },
    {
      "def": {
        "primitive": "u8"
      }
    },
    {
      "def": {
        "primitive": "u128"
      }
    },
    {
      "def": {
        "composite": {
          "fields": [
            {
              "name": "next",
              "type": 2,
              "typeName": "Index"
            },
            {
              "name": "prev",
              "type": 2,
              "typeName": "Index"
            }
          ]
        }
      },
      "path": [
        "ink_storage",
        "collections",
        "stash",
        "VacantEntry"
      ]
    },
    {
      "def": {
        "composite": {
          "fields": [
            {
              "name": "value",
              "type": 8,
              "typeName": "V"
            },
            {
              "name": "key_index",
              "type": 2,
              "typeName": "KeyIndex"
            }
          ]
        }
      },
      "params": [
        8
      ],
      "path": [
        "ink_storage",
        "collections",
        "hashmap",
        "ValueEntry"
      ]
    },
    {
      "def": {
        "variant": {
          "variants": [
            {
              "fields": [
                {
                  "type": 9,
                  "typeName": "VacantEntry"
                }
              ],
              "name": "Vacant"
            },
            {
              "fields": [
                {
                  "type": 12,
                  "typeName": "T"
                }
              ],
              "name": "Occupied"
            }
          ]
        }
      },
      "params": [
        12
      ],
      "path": [
        "ink_storage",
        "collections",
        "stash",
        "Entry"
      ]
    },
    {
      "def": {
        "tuple": [
          5,
          5
        ]
      }
    },
    {
      "def": {
        "composite": {
          "fields": [
            {
              "name": "value",
              "type": 14,
              "typeName": "V"
            },
            {
              "name": "key_index",
              "type": 2,
              "typeName": "KeyIndex"
            }
          ]
        }
      },
      "params": [
        14
      ],
      "path": [
        "ink_storage",
        "collections",
        "hashmap",
        "ValueEntry"
      ]
    },
    {
      "def": {
        "primitive": "bool"
      }
    },
    {
      "def": {
        "variant": {
          "variants": [
            {
              "fields": [
                {
                  "type": 9,
                  "typeName": "VacantEntry"
                }
              ],
              "name": "Vacant"
            },
            {
              "fields": [
                {
                  "type": 8,
                  "typeName": "T"
                }
              ],
              "name": "Occupied"
            }
          ]
        }
      },
      "params": [
        8
      ],
      "path": [
        "ink_storage",
        "collections",
        "stash",
        "Entry"
      ]
    },
    {
      "def": {
        "composite": {
          "fields": [
            {
              "name": "value",
              "type": 5,
              "typeName": "V"
            },
            {
              "name": "key_index",
              "type": 2,
              "typeName": "KeyIndex"
            }
          ]
        }
      },
      "params": [
        5
      ],
      "path": [
        "ink_storage",
        "collections",
        "hashmap",
        "ValueEntry"
      ]
    },
    {
      "def": {
        "composite": {
          "fields": [
            {
              "name": "value",
              "type": 18,
              "typeName": "V"
            },
            {
              "name": "key_index",
              "type": 2,
              "typeName": "KeyIndex"
            }
          ]
        }
      },
      "params": [
        18
      ],
      "path": [
        "ink_storage",
        "collections",
        "hashmap",
        "ValueEntry"
      ]
    },
    {
      "def": {
        "composite": {
          "fields": [
            {
              "name": "initializer",
              "type": 5,
              "typeName": "AccountId"
            },
            {
              "name": "confirmer",
              "type": 5,
              "typeName": "AccountId"
            },
            {
              "name": "confirmer_token_id",
              "type": 8,
              "typeName": "u128"
            },
            {
              "name": "confirmer_amount",
              "type": 8,
              "typeName": "u128"
            },
            {
              "name": "initializer_token_id",
              "type": 8,
              "typeName": "u128"
            },
            {
              "name": "initialier_amount",
              "type": 8,
              "typeName": "u128"
            }
          ]
        }
      },
      "path": [
        "flipper",
        "erc1155",
        "SwapRequest"
      ]
    },
    {
      "def": {
        "variant": {
          "variants": [
            {
              "fields": [
                {
                  "type": 9,
                  "typeName": "VacantEntry"
                }
              ],
              "name": "Vacant"
            },
            {
              "fields": [
                {
                  "type": 20,
                  "typeName": "T"
                }
              ],
              "name": "Occupied"
            }
          ]
        }
      },
      "params": [
        20
      ],
      "path": [
        "ink_storage",
        "collections",
        "stash",
        "Entry"
      ]
    },
    {
      "def": {
        "tuple": [
          8,
          8
        ]
      }
    },
    {
      "def": {
        "variant": {
          "variants": [
            {
              "name": "None"
            },
            {
              "fields": [
                {
                  "type": 8,
                  "typeName": "T"
                }
              ],
              "name": "Some"
            }
          ]
        }
      },
      "params": [
        8
      ],
      "path": [
        "Option"
      ]
    },
    {
      "def": {
        "variant": {
          "variants": [
            {
              "name": "None"
            },
            {
              "fields": [
                {
                  "type": 18,
                  "typeName": "T"
                }
              ],
              "name": "Some"
            }
          ]
        }
      },
      "params": [
        18
      ],
      "path": [
        "Option"
      ]
    },
    {
      "def": {
        "variant": {
          "variants": [
            {
              "name": "None"
            },
            {
              "fields": [
                {
                  "type": 5,
                  "typeName": "T"
                }
              ],
              "name": "Some"
            }
          ]
        }
      },
      "params": [
        5
      ],
      "path": [
        "Option"
      ]
    }
  ]
}