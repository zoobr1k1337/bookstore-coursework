package controllers

import (
	"course_work/models"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

// Отримати всі книги
func FindBooks(c *gin.Context) {
	var books []models.Book = []models.Book{}
	db := models.DB

	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "12"))
	offset := (page - 1) * limit

	category := c.Query("category")
	if category != "" {
		db = db.Where("category = ?", category)
	}

	search := c.Query("search")
	if search != "" {
		likeQuery := "%" + search + "%"
		db = db.Where("title LIKE ? OR author LIKE ?", likeQuery, likeQuery)
	}

	minPrice := c.Query("min_price")
	if minPrice != "" {
		db = db.Where("price >= ?", minPrice)
	}

	maxPrice := c.Query("max_price")
	if maxPrice != "" {
		db = db.Where("price <= ?", maxPrice)
	}

	sortQuery := c.Query("sort")
	switch sortQuery {
	case "price_asc":
		db = db.Order("price asc")
	case "price_desc":
		db = db.Order("price desc")
	case "newest":
		db = db.Order("id desc")
	case "title_asc":
		db = db.Order("title asc")
	default:
		db = db.Order("id desc")
	}

	db.Limit(limit).Offset(offset).Find(&books)
	c.JSON(http.StatusOK, books)
}

// Створити книгу
func CreateBook(c *gin.Context) {
	var book models.Book
	if err := c.ShouldBindJSON(&book); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	models.DB.Create(&book)
	c.JSON(http.StatusOK, book)
}

// Знайти книгу по ID
func FindBookByID(c *gin.Context) {
	var book models.Book
	if err := models.DB.First(&book, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Book not found"})
		return
	}

	c.JSON(http.StatusOK, book)
}

// Оновити книгу
func UpdateBook(c *gin.Context) {
	var book models.Book

	if err := models.DB.First(&book, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Book not found"})
		return
	}

	var input models.Book
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	models.DB.Model(&book).Updates(input)
	c.JSON(http.StatusOK, book)
}

// Видалити книгу
func DeleteBook(c *gin.Context) {
	var book models.Book
	if err := models.DB.First(&book, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Book not found"})
		return
	}

	models.DB.Delete(&book)
	c.JSON(http.StatusOK, gin.H{"data": true})
}

// Отримати всі категорії
func GetCategories(c *gin.Context) {
	var categories []string

	result := models.DB.Model(&models.Book{}).
		Distinct("category").
		Where("category <> ? AND category <> ?", "", "Uncategorized").
		Order("category asc").
		Pluck("category", &categories)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch categories"})
		return
	}

	c.JSON(http.StatusOK, categories)
}
