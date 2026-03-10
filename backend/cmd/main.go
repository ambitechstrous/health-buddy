package main

import (
	"net/http"

	"github.com/ambitechstrous/health-buddy/backend/cmd/internal/handlers"
	"github.com/go-chi/chi/v5"
)

func main() {
	handler := handlers.NewHandler()

	r := chi.NewRouter()

	r.Get("/meals", handler.GetMealPlan)

	http.ListenAndServe(":8080", r)
}
