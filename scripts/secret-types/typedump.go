// Copyright 2026 The Sneakers-PAM Authors
// SPDX-License-Identifier: Apache-2.0

// sync.mjs runs this file inside a sneakers-vault checkout through
// `go run -overlay`, so nothing is written into the checkout. It prints the
// vault's built-in type catalogue, extension packs and default connections as
// JSON, in the vault's own protojson form.
package main

import (
	"fmt"
	"os"

	"github.com/Sneakers-PAM/sneakers-vault/internal/vault/grpcsvc"
	"google.golang.org/protobuf/encoding/protojson"
	"google.golang.org/protobuf/proto"
)

func list[T proto.Message](name string, items []T, last bool) {
	fmt.Printf("%q:[", name)
	for i, item := range items {
		if i > 0 {
			fmt.Print(",")
		}
		b, err := protojson.Marshal(item)
		if err != nil {
			fmt.Fprintln(os.Stderr, err)
			os.Exit(1)
		}
		os.Stdout.Write(b)
	}
	fmt.Print("]")
	if !last {
		fmt.Print(",")
	}
}

func main() {
	fmt.Print("{")
	list("types", grpcsvc.BuiltinTypes(), false)
	list("extensions", grpcsvc.ExtensionCatalog(), false)
	list("connections", grpcsvc.BuiltinConnections(), true)
	fmt.Println("}")
}
