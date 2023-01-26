﻿## cipher-bsk-npm-package
Bornomala Symmetric Key (BSK) stream cipher, a simple text-encrypting developed cipher model

## Installation/Launch

    npm i cipher-bsk;

## Usage
To use in your project get the encrypt and decrypt function from object deconstruction

    const { encrypt, decrypt } = require('cipher-bsk')

    let M = "Hajee Mohammad Danesh Science and Technology University"
    let K = "Hstu@5200"

    console.log(encrypt(M, K))
    let C = encrypt(M, K)
    console.log(decrypt(C, K))

## Features
- Avalanche effect 
- Immune from frequency analysis attack
- Output ranges from ASCII(0-255)

## Documentations
- Published paper: [DOI: 10.5120/ijca2021921290](https://www.ijcaonline.org/archives/volume183/number2/31897-2021921290)
- Online tool: [BSK ONLINE](https://sazzad-saju.github.io/BSK-Online/)
