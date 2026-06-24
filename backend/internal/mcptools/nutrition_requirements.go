package mcptools

import (
	"context"
	"encoding/json"
	"fmt"
	"math"
	"os"

	"github.com/anthropics/anthropic-sdk-go"
	"github.com/modelcontextprotocol/go-sdk/mcp"
)

type Sex string

type NutritionRequirementsRequest struct {
	Age    int    // Age in years
	Weight int    // Weight in pounds
	Height int    // Height in inches
	Goals  string // Generic prompt highlighting user's goals
	Sex    Sex    // Sex to help determine metabolic differences
}

type NutritionRequirementsResponse struct {
	Calories int
	Protein  int
	Carbs    int
	Fat      int
	Fiber    int
}

const systemPrompt = `You are an expert nutritionist. You will be given information such as a user's weight, sex, height, and age. You will also be given a generic prompt with their weight loss goals.
Please use this information to give recommendations on calorie, protein, carbs, fat, and fiber intake based on this information. 
You will return this in JSON format, keyed on the type of nutrient, with an integer value based on number of grams.
Here is an example output for a user that needs 2000 calories, 18g protein, 10g carbs, 10g fat, and 30g fiber: {"calories": 2000, "protein": 18, "carbs": 10", "fat": 10, "fiber": 30}`

const (
	Male   Sex = "Male"
	Female Sex = "Female"
)

func NewNutritionRequirementsTool() *mcp.Tool {
	return &mcp.Tool{
		Name:        "nutrition_requirements",
		Description: "Given a user's weight and goals, calculate calorie, macro, and fiber requirements",
	}
}

func NutritionRequirementsHandler(ctx context.Context, req *mcp.CallToolRequest, args NutritionRequirementsRequest) (*mcp.CallToolResult, *NutritionRequirementsResponse, error) {
	// Testing mode so we don't spend tokens unnecessarily during testing and debugging
	if os.Getenv("TEST") == "true" {
		return nil, mockResponse(args), nil
	}

	client := anthropic.NewClient()
	prompt := fmt.Sprintf("I am a %d year old %s that weigh %d pounds, and I'm %d inches tall. My fitness goal is %s. Please tell me my nutrition requirements.", args.Weight, args.Age, args.Height, args.Goals)
	resp, err := client.Messages.New(ctx, anthropic.MessageNewParams{
		Model:     anthropic.ModelClaudeSonnet4_5, // TODO: Use Opus. Sonnet is just cheaper
		MaxTokens: 256,
		System: []anthropic.TextBlockParam{{
			Text: systemPrompt,
		}},
		Messages: []anthropic.MessageParam{
			anthropic.NewUserMessage(anthropic.NewTextBlock(prompt)),
		},
	})
	if err != nil {
		return nil, nil, fmt.Errorf("anthropic query failed: %v", err)
	}

	// Print full response for debugging
	fmt.Printf("Response: %v", resp)
	fmt.Printf("Content: %v", resp.Content)

	// Look for JSON blob in the content
	var response *NutritionRequirementsResponse
	for i := 0; i < len(resp.Content); i++ {
		content := resp.Content[i].Text
		err = json.Unmarshal([]byte(content), response)
		if err != nil {
			fmt.Printf("error processing content %s: %v", content, err)
		} else {
			fmt.Println("found JSON blob in content")
			break
		}
	}

	if err != nil {
		return nil, nil, err
	}

	return nil, response, nil
}

// Mock response. Returns basic calculation of the average requirements for a given person
func mockResponse(req NutritionRequirementsRequest) *NutritionRequirementsResponse {
	// Common equation used for calculating resting burn rate
	calories := 5*req.Weight + 16*req.Height - 5*req.Age + 5

	// Protein and fat requirements are based on general guidelines for macros per body weight
	protein := int(math.Round(0.8 * float64(req.Weight)))
	fat := int(math.Round(0.35 * float64(req.Weight)))

	// Carbs are the lowest priority macro most of the time. Calculate based on remaining calories available.
	remainingCalories := calories - (protein * 4) - (fat * 9)
	carbs := remainingCalories / 4

	return &NutritionRequirementsResponse{
		Calories: calories,
		Protein:  protein,
		Fat:      fat,
		Carbs:    carbs,
		Fiber:    14 * calories, // General guideline for fiber is 14g per 1000 calories
	}
}
