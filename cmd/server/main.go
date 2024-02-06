package main

import (
	"log"
	"net/http"
	"os"

	"github.com/rs/cors"
)

const defaultPgUrl = "postgres://postgres:postgres@localhost:5432/postgres?sslmode=disable"

func main() {
	pgUrl, ok := os.LookupEnv("PG_URL")
	if !ok {
		pgUrl = defaultPgUrl
	}

	dbVersion, ok := os.LookupEnv("DB_VERSION")
	if !ok {
		log.Fatalf("DB_VERSION environment variable not set")
	}

	srv, err := NewServer(pgUrl, dbVersion)
	if err != nil {
		log.Fatalf("Failed to initialize API server: %s", err)
	}

	log.Println("Listening on :8080")
	log.Fatal(http.ListenAndServe(":8080", cors.Default().Handler(srv.Mux)))
}
