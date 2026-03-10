package main

import (
	"net/http"

	internal "github.com/ambitechstrous/health-buddy/backend/cmd/internal/handlers"
	"github.com/go-chi/chi/v5"
)

func main() {
	handler := internal.NewHandler()

	r := chi.NewRouter()

	r.Get("/meals", handler.GetMealPlan)

	http.ListenAndServe(":8080", r)
}
