package main

import (
	"net/http"

	"github.com/ambitechstrous/health-buddy/backend/internal/handlers"
	"github.com/go-chi/chi/v5"
)

func main() {
	handler, err := handlers.NewHandler()
	if err != nil {
		panic(err)
	}

	r := chi.NewRouter()

	r.Get("/meals", handler.GetMealPlan)
	r.Get("/nutrition", handler.GetNutritionInfo)

	err = http.ListenAndServe(":8080", r)
	if err != nil {
		panic(err)
	}
}
