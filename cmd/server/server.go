package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"

	"github.com/lib/pq"
)

type Server struct {
	Mux *http.ServeMux
	db  *sql.DB
}

func NewServer(pgUrl, searchPath string) (*Server, error) {
	if searchPath == "" {
		return nil, fmt.Errorf("search path must be specified")
	}

	db, err := sql.Open("postgres", pgUrl)
	if err != nil {
		return nil, err
	}

	log.Printf("Setting search path to %q", searchPath)
	_, err = db.Exec(fmt.Sprintf("SET search_path = %s", pq.QuoteIdentifier(searchPath)))
	if err != nil {
		return nil, fmt.Errorf("failed to set search path: %s", err)
	}

	srv := &Server{
		Mux: http.NewServeMux(),
		db:  db,
	}
	srv.Mux.HandleFunc("/", srv.handleStatic)
	srv.Mux.HandleFunc("/api/items", srv.handleItems)

	return srv, nil
}
