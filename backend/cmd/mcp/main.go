package main

import (
	"log"
	"net/http"

	"github.com/joho/godotenv"
	"github.com/modelcontextprotocol/go-sdk/mcp"

	"github.com/ambitechstrous/health-buddy/backend/internal/mcptools"
)

func main() {
	// Load environment variables from .env file
	if err := godotenv.Load(); err != nil {
		log.Fatalf("Error loading .env file: %v", err)
	}

	// Initialize the MCP server
	mcpServer := mcp.NewServer(
		&mcp.Implementation{
			Name:    "bud-buddy-recommender",
			Version: "1.0.0",
		},
		nil,
	)

	// Register the relevant tools
	mcp.AddTool(mcpServer, mcptools.NewNutritionRequirementsTool(), mcptools.NutritionRequirementsHandler)

	// Instantiate SSE transport manager to enable HTTP requests vs server-sent events
	httpServer := mcp.NewStreamableHTTPHandler(func(r *http.Request) *mcp.Server {
		return mcpServer
	}, nil)

	// Set up the standard net/http multiplexer to handle incoming HTTP requests
	mux := http.NewServeMux()
	mux.Handle("/mcp", httpServer)

	log.Println("Starting MCP server on :8081...")
	if err := http.ListenAndServe(":8081", mux); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
