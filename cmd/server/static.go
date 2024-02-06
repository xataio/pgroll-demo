package main

import (
	"embed"
	"fmt"
	"log"
	"mime"
	"net/http"
	"os"
	"path/filepath"
	"strings"
)

//go:embed dist
var fs embed.FS

func (s *Server) handleStatic(w http.ResponseWriter, r *http.Request) {
	path := filepath.Clean(r.URL.Path)
	if path == "/" {
		path = "index.html"
	}
	path = fmt.Sprintf("dist/%s", strings.TrimPrefix(path, "/"))

	log.Printf("serving static file: %s", path)

	f, err := fs.ReadFile(path)
	if err != nil {
		log.Println(err)
		if os.IsNotExist(err) {
			http.NotFound(w, r)
			return
		}
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	contentType := mime.TypeByExtension(filepath.Ext(path))
	w.Header().Set("Content-Type", contentType)
	w.Write(f)
}
