package controllers

import (
	"course_work/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

type OrderInput struct {
	Items []struct {
		BookID   uint `json:"book_id"`
		Quantity int  `json:"quantity"`
	} `json:"items"`
}

func CreateOrder(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	var input OrderInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	tx := models.DB.Begin()

	var totalAmount float64
	var totalQuantity int
	var orderItems []models.OrderItem

	for _, item := range input.Items {
		var book models.Book
		if err := tx.First(&book, item.BookID).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusNotFound, gin.H{"error": "Book not found"})
			return
		}

		if book.StockQuantity < item.Quantity {
			tx.Rollback()
			c.JSON(http.StatusBadRequest, gin.H{"error": "Not enough stock for: " + book.Title})
			return
		}

		book.StockQuantity -= item.Quantity
		if err := tx.Save(&book).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update stock"})
			return
		}

		orderItems = append(orderItems, models.OrderItem{
			BookID:          book.ID,
			Quantity:        item.Quantity,
			PriceAtPurchase: book.Price,
		})

		totalAmount += book.Price * float64(item.Quantity)
		totalQuantity += item.Quantity
	}

	discount := 0.0

	if totalQuantity >= 3 {
		discount = totalAmount * 0.05
	}

	finalAmount := totalAmount - discount

	order := models.Order{
		UserID:      userID.(uint),
		TotalAmount: finalAmount,
		Status:      "New",
		Items:       orderItems,
	}

	if err := tx.Create(&order).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create order"})
		return
	}

	tx.Commit()

	c.JSON(http.StatusCreated, gin.H{
		"message":      "Order created",
		"order_id":     order.ID,
		"total_amount": totalAmount,
		"discount":     discount,
		"final_amount": finalAmount,
	})
}

func GetMyOrders(c *gin.Context) {
	userID, _ := c.Get("user_id")
	var orders []models.Order
	models.DB.Preload("Items.Book").Where("user_id = ?", userID).Find(&orders)
	c.JSON(http.StatusOK, orders)
}
