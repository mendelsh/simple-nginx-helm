package main

import (
	"embed"
	"encoding/binary"
	"fmt"
	"log"
	"net/http"
	"sync/atomic"
	"io/fs"
)

//go:embed site/*
var embeddedFiles embed.FS

var Counter uint64 = 0

func handleCount(w http.ResponseWriter, r *http.Request) {
	current := atomic.AddUint64(&Counter, 1)

	var buf [8]byte
	binary.BigEndian.PutUint64(buf[:], current)
	w.Write(buf[:])
}

func main() {
	subFS, err := fs.Sub(embeddedFiles, "site")
	if err != nil {
		log.Fatal(err)
	}

	fs := http.FileServer(http.FS(subFS))

	http.Handle("/", fs)
	http.HandleFunc("/count", handleCount)

	fmt.Println("Server is running...")

	log.Fatal(http.ListenAndServe("0.0.0.0:80", nil))
}
