package handlers

import (
	"context"
	"net/http"

	"github.com/ambitechstrous/health-buddy/backend/internal/client"
)

// Interface definitions for handler, as well as struct. Stores clients such as SQL or HTTP clients.

// TODO: Figure out all endpoints to implement
type IHandler interface {
	GetMealPlan(w http.ResponseWriter, r *http.Request)
	GetNutritionInfo(w http.ResponseWriter, r *http.Request)
}

type Handler struct {
	mcpClient client.IMcpClient
}

func NewHandler() (IHandler, error) {
	mcpClient, err := client.NewMcpClient(context.Background(), "localhost:8081")
	if err != nil {
		return nil, err
	}

	return &Handler{
		mcpClient: mcpClient,
	}, nil
}
