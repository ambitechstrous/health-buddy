package client

import (
	"context"

	"github.com/modelcontextprotocol/go-sdk/mcp"
)

type IMcpClient interface {
	CallTool(ctx context.Context, name string, args map[string]any) (*mcp.CallToolResult, error)
}

type McpClient struct {
	session *mcp.ClientSession
}

func NewMcpClient(ctx context.Context, serverURL string) (IMcpClient, error) {
	client := mcp.NewClient(&mcp.Implementation{
		Name:    "bud-buddy-recommender",
		Version: "1.0.0",
	}, nil)

	session, err := client.Connect(ctx, &mcp.StreamableClientTransport{
		Endpoint: serverURL,
	}, nil)
	if err != nil {
		return nil, err
	}

	return &McpClient{
		session: session,
	}, nil
}

func (c *McpClient) CallTool(ctx context.Context, name string, args map[string]any) (*mcp.CallToolResult, error) {
	return c.session.CallTool(ctx, &mcp.CallToolParams{
		Name:      name,
		Arguments: args,
	})
}
