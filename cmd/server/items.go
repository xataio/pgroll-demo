package main

import (
	"encoding/json"
	"fmt"
	"net/http"
)

type item struct {
	Name string `json:"name"`
	Done bool   `json:"done"`
}

func (s *Server) handleItems(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet:
		s.handleGetItems(w, r)
	case http.MethodPost:
		s.handlePostItem(w, r)
	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

func (s *Server) handleGetItems(w http.ResponseWriter, r *http.Request) {
	rows, err := s.db.Query("SELECT name, done FROM items")
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	items := []item{}
	for rows.Next() {
		var i item
		err := rows.Scan(&i.Name, &i.Done)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		items = append(items, i)
	}

	w.Header().Set("Content-Type", "application/json")
	err = json.NewEncoder(w).Encode(items)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
}

func (s *Server) handlePostItem(w http.ResponseWriter, r *http.Request) {
	var item item
	err := json.NewDecoder(r.Body).Decode(&item)
	if err != nil {
		http.Error(w, fmt.Sprintf("bad payload: %v", err), http.StatusBadRequest)
		return
	}

	var id int
	err = s.db.QueryRow("INSERT INTO items (name, done) VALUES ($1, $2) RETURNING id",
		item.Name,
		item.Done).Scan(&id)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.Header().Set("Location", fmt.Sprintf("/items/%d", id))
	w.WriteHeader(http.StatusCreated)
}
