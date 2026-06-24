package handlers

import "net/http"

// TODO: Implement logic to get meal plan info from a real database
func (h *Handler) GetMealPlan(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("hello world"))
}
