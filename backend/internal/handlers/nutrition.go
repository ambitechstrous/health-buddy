package handlers

import (
	"fmt"
	"net/http"
	"strings"

	"github.com/modelcontextprotocol/go-sdk/mcp"
)

func (h *Handler) GetNutritionInfo(w http.ResponseWriter, r *http.Request) {
	result, err := h.mcpClient.CallTool(r.Context(), "nutrition_requirements", map[string]any{
		"Age":    30,
		"Weight": 250,
		"Height": 72,
		"Goals":  "Get under 200 pounds by end of year",
		"Sex":    "Male",
	})
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("error calling tool: " + err.Error()))
	}

	if len(result.Content) == 0 {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("no content returned from tool"))

	}

	fmt.Printf("Content: %v", result)

	responses := make([]string, len(result.Content))
	for i, content := range result.Content {
		responses[i] = content.(*mcp.TextContent).Text
	}
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(strings.Join(responses, "\n")))
}
