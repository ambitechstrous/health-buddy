package handlers

import "net/http"

// Interface definitions for handler, as well as struct. Stores clients such as SQL or HTTP clients.

// TODO: Figure out all endpoints to implement
type IHandler interface {
	GetMealPlan(w http.ResponseWriter, r *http.Request)
}

type Handler struct{}

func NewHandler() IHandler {
	return &Handler{}
}
