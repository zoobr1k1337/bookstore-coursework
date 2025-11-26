package controllers

import (
	"course_work/models"
	"encoding/json"
	"fmt"
	"io"
	"math/rand"
	"net/http"
	"net/url"

	"github.com/gin-gonic/gin"
)

type GoogleBooksResponse struct {
	Items []struct {
		VolumeInfo struct {
			Title       string   `json:"title"`
			Authors     []string `json:"authors"`
			Description string   `json:"description"`
			Categories  []string `json:"categories"`
			ImageLinks  *struct {
				Thumbnail string `json:"thumbnail"`
			} `json:"imageLinks"`
		} `json:"volumeInfo"`
	} `json:"items"`
}

func PopulateBooks(c *gin.Context) {
	query := c.Query("q")
	if query == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Query parameter 'q' is required"})
		return
	}

	safeQuery := url.QueryEscape(query)
	url := fmt.Sprintf("https://www.googleapis.com/books/v1/volumes?q=%s&maxResults=20", safeQuery)

	resp, err := http.Get(url)
	if err != nil {
		fmt.Println("Network Error:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch from Google Books"})
		return
	}
	defer resp.Body.Close()

	bodyBytes, err := io.ReadAll(resp.Body)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read response body"})
		return
	}

	if resp.StatusCode != 200 {
		fmt.Println("Google API Error Body:", string(bodyBytes))
		c.JSON(resp.StatusCode, gin.H{"error": "Google API returned error", "details": string(bodyBytes)})
		return
	}

	var googleResp GoogleBooksResponse
	if err := json.Unmarshal(bodyBytes, &googleResp); err != nil {
		fmt.Println("JSON Decode Error:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to decode Google response"})
		return
	}

	count := 0
	for _, item := range googleResp.Items {
		author := "Unknown Author"
		if len(item.VolumeInfo.Authors) > 0 {
			author = item.VolumeInfo.Authors[0]
		}

		category := "Uncategorized"
		if len(item.VolumeInfo.Categories) > 0 {
			category = item.VolumeInfo.Categories[0]
		}

		randomPrice := 100.0 + rand.Float64()*(900.0-100.0)

		image := "https://via.placeholder.com/150"
		if item.VolumeInfo.ImageLinks != nil && item.VolumeInfo.ImageLinks.Thumbnail != "" {
			image = item.VolumeInfo.ImageLinks.Thumbnail
		}

		book := models.Book{
			Title:         item.VolumeInfo.Title,
			Author:        author,
			Description:   item.VolumeInfo.Description,
			Price:         float64(int(randomPrice)),
			StockQuantity: 50,
			ImageURL:      image,
			Category:      category,
		}

		if err := models.DB.Where(models.Book{Title: book.Title}).FirstOrCreate(&book).Error; err == nil {
			count++
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"message": fmt.Sprintf("Successfully added %d books from query '%s'", count, query),
	})
}
